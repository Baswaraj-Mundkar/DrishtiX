// DrishtiX local demo server.
// The report API is intentionally disabled for production deployments.
// This project does not implement real user authentication.

const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1].startsWith('#') || process.env[match[1]] !== undefined) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

loadLocalEnv();

const app = express();
const PORT = Number(process.env.PORT || 8000);
const HOST = '127.0.0.1';
const DEMO_API_ENABLED =
  process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEMO_API === 'true';
const REPORTS_FILE = path.join(os.homedir(), '.drishtix', 'reports.json');
const ALLOWED_PLATFORMS = new Set(['WhatsApp', 'Instagram', 'Facebook', 'Twitter', 'Other']);
const ALLOWED_STATUSES = new Set(['Pending', 'Verified Fake', 'Verified True']);

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

app.use(express.json({ limit: '16kb', strict: true }));

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

function createRateLimiter({ limit, windowMs }) {
  const buckets = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.socket.remoteAddress || 'local';
    const current = buckets.get(key);
    if (!current || now - current.startedAt >= windowMs) {
      buckets.set(key, { startedAt: now, count: 1 });
      return next();
    }
    if (current.count >= limit) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    current.count += 1;
    return next();
  };
}

app.use('/api', (req, res, next) => {
  if (!DEMO_API_ENABLED) {
    return res.status(503).json({
      error: 'The report API is disabled. Enable it only for local demonstrations.'
    });
  }

  const origin = req.get('origin');
  const expectedOrigin = `http://${req.get('host')}`;
  if (origin && origin !== expectedOrigin) {
    return res.status(403).json({ error: 'Cross-origin API requests are not allowed.' });
  }
  next();
});

app.get('/api/reports', createRateLimiter({ limit: 60, windowMs: 60_000 }), (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json(readReports());
  } catch (error) {
    console.error('Report read failed:', error.message);
    res.status(500).json({ error: 'Unable to load local demo reports.' });
  }
});

app.post('/api/reports', createRateLimiter({ limit: 10, windowMs: 15 * 60_000 }), (req, res) => {
  const validation = validateReport(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });

  try {
    const reports = readReports();
    reports.push(validation.value);
    writeReports(reports);
    res.status(201).json(validation.value);
  } catch (error) {
    console.error('Report save failed:', error.message);
    res.status(500).json({ error: 'Unable to save the local demo report.' });
  }
});

app.put('/api/reports/:id', createRateLimiter({ limit: 30, windowMs: 60_000 }), (req, res) => {
  const id = String(req.params.id || '');
  const status = req.body && req.body.status;
  if (!id || id.length > 64 || !ALLOWED_STATUSES.has(status)) {
    return res.status(400).json({ error: 'A valid report ID and status are required.' });
  }

  try {
    const reports = readReports();
    const report = reports.find(item => String(item.ID) === id);
    if (!report) return res.status(404).json({ error: 'Report not found.' });

    report.Status = status;
    writeReports(reports);
    res.json({ message: 'Report status updated.' });
  } catch (error) {
    console.error('Report update failed:', error.message);
    res.status(500).json({ error: 'Unable to update the local demo report.' });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Invalid JSON request body.' });
  }
  console.error('Request failed:', error.message);
  res.status(500).json({ error: 'Internal server error.' });
});

app.use(express.static(__dirname, { dotfiles: 'deny', index: 'index.html' }));

if (require.main === module) {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  app.listen(PORT, HOST, () => {
    console.log(`DrishtiX local demo server: http://${HOST}:${PORT}`);
    console.log(`Report API: ${DEMO_API_ENABLED ? 'enabled for local demo use' : 'disabled'}`);
  });
}

module.exports = { app, validateReport, ALLOWED_STATUSES, ALLOWED_PLATFORMS, DEMO_API_ENABLED };
