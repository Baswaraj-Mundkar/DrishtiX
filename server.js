// DrishtiX local demo server.
// Uses Node.js built-ins only. The report API is local-development-only.
// The browser role selector is not authentication.

const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;

function loadLocalEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

loadLocalEnv();

const PORT = Number(process.env.PORT || 8000);
const HOST = '127.0.0.1';
const DEMO_API_ENABLED =
  process.env.NODE_ENV === 'development' && process.env.ENABLE_DEMO_API === 'true';
const REPORTS_FILE = path.join(os.homedir(), '.drishtix', 'reports.json');
const ALLOWED_PLATFORMS = new Set(['WhatsApp', 'Instagram', 'Facebook', 'Twitter', 'Other']);
const ALLOWED_STATUSES = new Set(['Pending', 'Verified Fake', 'Verified True']);
const rateBuckets = new Map();
const PUBLIC_ROOT_FILES = new Set([
  'index.html', 'checker.html', 'dashboard.html', 'login.html',
  'report.html', 'examples.html', 'learn.html', 'quiz.html',
  'style.css', 'script.js', 'i18n.js', 'config.js', 'quiz_engine.js'
]);
const PUBLIC_DIRECTORIES = new Set(['assets', 'locales']);

function readReports() {
  if (!fs.existsSync(REPORTS_FILE)) return [];
  const parsed = JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error('Invalid local report store');
  return parsed;
}

function writeReports(reports) {
  const directory = path.dirname(REPORTS_FILE);
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const temporaryFile = `${REPORTS_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(reports, null, 2), {
    encoding: 'utf8',
    mode: 0o600
  });
  fs.renameSync(temporaryFile, REPORTS_FILE);
}

function validateReport(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'A JSON object is required.' };
  }

  const Name = typeof body.Name === 'string' ? body.Name.trim() : '';
  const Headline = typeof body.Headline === 'string' ? body.Headline.trim() : '';
  const Platform = typeof body.Platform === 'string' ? body.Platform.trim() : '';
  const Description = typeof body.Description === 'string' ? body.Description.trim() : '';
  const newsURL = typeof body.URL === 'string' ? body.URL.trim() : '';

  if (!Name || Name.length > 80) return { error: 'Name is required and must be 80 characters or fewer.' };
  if (Headline.length < 3 || Headline.length > 240) return { error: 'Headline must be between 3 and 240 characters.' };
  if (!ALLOWED_PLATFORMS.has(Platform)) return { error: 'Choose a supported platform.' };
  if (Description.length < 5 || Description.length > 3000) return { error: 'Description must be between 5 and 3000 characters.' };

  let safeURL = '';
  if (newsURL) {
    if (newsURL.length > 2048) return { error: 'News URL is too long.' };
    try {
      const parsedURL = new URL(newsURL);
      if (!['http:', 'https:'].includes(parsedURL.protocol)) return { error: 'News URL must use HTTP or HTTPS.' };
      safeURL = parsedURL.toString();
    } catch {
      return { error: 'Enter a valid news URL.' };
    }
  }

  const latValue = body.Lat === '' || body.Lat === null || body.Lat === undefined ? null : Number(body.Lat);
  const lngValue = body.Lng === '' || body.Lng === null || body.Lng === undefined ? null : Number(body.Lng);
  if ((latValue === null) !== (lngValue === null)) return { error: 'Latitude and longitude must be supplied together.' };
  if (latValue !== null && (!Number.isFinite(latValue) || latValue < -90 || latValue > 90)) {
    return { error: 'Latitude must be between -90 and 90.' };
  }
  if (lngValue !== null && (!Number.isFinite(lngValue) || lngValue < -180 || lngValue > 180)) {
    return { error: 'Longitude must be between -180 and 180.' };
  }

  return {
    value: {
      ID: crypto.randomUUID(),
      Date: new Date().toISOString(),
      Status: 'Pending',
      Name,
      Headline,
      Platform,
      Description,
      URL: safeURL,
      Lat: latValue,
      Lng: lngValue
    }
  };
}

function sendJson(res, statusCode, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
}

function checkRateLimit(req, key, limit, windowMs) {
  const now = Date.now();
  const bucketKey = `${key}:${req.socket.remoteAddress || 'local'}`;
  const current = rateBuckets.get(bucketKey);
  if (!current || now - current.startedAt >= windowMs) {
    rateBuckets.set(bucketKey, { startedAt: now, count: 1 });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

function checkLocalRequest(req) {
  if (!DEMO_API_ENABLED) return { status: 503, error: 'The report API is disabled. Enable it only for local demonstrations.' };

  const hostHeader = String(req.headers.host || '');
  const hostname = hostHeader.split(':')[0].toLowerCase();
  if (!['127.0.0.1', 'localhost'].includes(hostname)) {
    return { status: 403, error: 'Only localhost API access is allowed.' };
  }

  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).origin !== `http://${hostHeader}`) {
        return { status: 403, error: 'Cross-origin API requests are not allowed.' };
      }
    } catch {
      return { status: 403, error: 'Invalid request origin.' };
    }
  }
  return null;
}

async function readJsonBody(req) {
  const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    const error = new Error('Content-Type must be application/json.');
    error.statusCode = 415;
    throw error;
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 16 * 1024) {
      const error = new Error('Request body is too large.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    const text = Buffer.concat(chunks).toString('utf8');
    return text ? JSON.parse(text) : {};
  } catch {
    const error = new Error('Invalid JSON request body.');
    error.statusCode = 400;
    throw error;
  }
}

async function handleApi(req, res, pathname) {
  const localError = checkLocalRequest(req);
  if (localError) return sendJson(res, localError.status, { error: localError.error });

  if (req.method === 'GET' && pathname === '/api/reports') {
    if (!checkRateLimit(req, 'read', 60, 60_000)) {
      return sendJson(res, 429, { error: 'Too many requests. Please try again later.' });
    }
    try {
      return sendJson(res, 200, readReports());
    } catch (error) {
      console.error('Report read failed:', error.message);
      return sendJson(res, 500, { error: 'Unable to load local demo reports.' });
    }
  }

  if (req.method === 'POST' && pathname === '/api/reports') {
    if (!checkRateLimit(req, 'write', 10, 15 * 60_000)) {
      return sendJson(res, 429, { error: 'Too many requests. Please try again later.' });
    }
    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      return sendJson(res, error.statusCode || 400, { error: error.message });
    }
    const validation = validateReport(body);
    if (validation.error) return sendJson(res, 400, { error: validation.error });

    try {
      const reports = readReports();
      reports.push(validation.value);
      writeReports(reports);
      return sendJson(res, 201, validation.value);
    } catch (error) {
      console.error('Report save failed:', error.message);
      return sendJson(res, 500, { error: 'Unable to save the local demo report.' });
    }
  }

  const updateMatch = pathname.match(/^\/api\/reports\/([A-Za-z0-9_-]{1,64})$/);
  if (req.method === 'PUT' && updateMatch) {
    if (!checkRateLimit(req, 'update', 30, 60_000)) {
      return sendJson(res, 429, { error: 'Too many requests. Please try again later.' });
    }
    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      return sendJson(res, error.statusCode || 400, { error: error.message });
    }
    const status = body && body.status;
    if (!ALLOWED_STATUSES.has(status)) {
      return sendJson(res, 400, { error: 'A valid report status is required.' });
    }

    try {
      const reports = readReports();
      const report = reports.find(item => String(item.ID) === updateMatch[1]);
      if (!report) return sendJson(res, 404, { error: 'Report not found.' });
      report.Status = status;
      writeReports(reports);
      return sendJson(res, 200, { message: 'Report status updated.' });
    } catch (error) {
      console.error('Report update failed:', error.message);
      return sendJson(res, 500, { error: 'Unable to update the local demo report.' });
    }
  }

  return sendJson(res, 404, { error: 'API route not found.' });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mmd': 'text/plain; charset=utf-8',
  '.py': 'text/plain; charset=utf-8'
};

function serveStatic(req, res, pathname) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end('Method Not Allowed');
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400);
    return res.end('Bad Request');
  }

  if (decodedPath === '/') decodedPath = '/index.html';
  const filePath = path.resolve(ROOT, `.${decodedPath}`);
  const relativePath = path.relative(ROOT, filePath);
  const normalizedRelativePath = relativePath.split(path.sep).join('/');
  const pathParts = relativePath.split(path.sep);
  const isPublicFile = PUBLIC_ROOT_FILES.has(normalizedRelativePath);
  const isPublicAsset = pathParts.length > 1 && PUBLIC_DIRECTORIES.has(pathParts[0]);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath) ||
      pathParts.some(segment => segment.startsWith('.')) ||
      (!isPublicFile && !isPublicAsset)) {
    res.writeHead(404);
    return res.end('Not Found');
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      res.writeHead(404);
      return res.end('Not Found');
    }
    fs.readFile(filePath, (readError, content) => {
      if (readError) {
        res.writeHead(500);
        return res.end('Unable to read file');
      }
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Content-Length': content.length,
        'Cache-Control': 'no-cache'
      });
      if (req.method === 'HEAD') return res.end();
      res.end(content);
    });
  });
}

function createServer() {
  return http.createServer(async (req, res) => {
    applySecurityHeaders(res);
    let pathname;
    try {
      pathname = new URL(req.url, 'http://127.0.0.1').pathname;
    } catch {
      res.writeHead(400);
      return res.end('Bad Request');
    }

    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return handleApi(req, res, pathname);
    }
    return serveStatic(req, res, pathname);
  });
}

if (require.main === module) {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  createServer().listen(PORT, HOST, () => {
    console.log(`DrishtiX local demo server: http://${HOST}:${PORT}`);
    console.log(`Report API: ${DEMO_API_ENABLED ? 'enabled for local demo use' : 'disabled'}`);
  });
}

module.exports = {
  createServer,
  validateReport,
  readReports,
  ALLOWED_STATUSES,
  ALLOWED_PLATFORMS,
  DEMO_API_ENABLED
};
