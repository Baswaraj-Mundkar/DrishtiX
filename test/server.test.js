const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer, validateReport, ALLOWED_STATUSES, ALLOWED_PLATFORMS } = require('../server');

const validReport = {
  Name: 'Test Reporter',
  Headline: 'A sample misleading claim',
  Platform: 'WhatsApp',
  Description: 'Context provided for a local demonstration report.',
  URL: 'https://example.com/report',
  Lat: '18.5204',
  Lng: '73.8567'
};

test('accepts a valid report and creates server-controlled metadata', () => {
  const result = validateReport(validReport);
  assert.ok(result.value);
  assert.equal(result.value.Name, 'Test Reporter');
  assert.equal(result.value.Status, 'Pending');
  assert.equal(result.value.Lat, 18.5204);
  assert.equal(result.value.Lng, 73.8567);
  assert.ok(result.value.ID);
  assert.ok(result.value.Date);
});

test('rejects missing or oversized required fields', () => {
  assert.match(validateReport({}).error, /Name is required/);
  assert.match(validateReport({ ...validReport, Headline: 'x'.repeat(241) }).error, /Headline/);
  assert.match(validateReport({ ...validReport, Description: 'x'.repeat(3001) }).error, /Description/);
});

test('rejects unsupported platforms and unsafe URL schemes', () => {
  assert.match(validateReport({ ...validReport, Platform: 'Unknown' }).error, /platform/i);
  assert.match(validateReport({ ...validReport, URL: 'javascript:alert(1)' }).error, /HTTP or HTTPS/);
});

test('rejects invalid or incomplete coordinates', () => {
  assert.match(validateReport({ ...validReport, Lat: '91' }).error, /Latitude/);
  assert.match(validateReport({ ...validReport, Lng: '-181' }).error, /Longitude/);
  assert.match(validateReport({ ...validReport, Lat: '18.5', Lng: '' }).error, /supplied together/);
});

test('keeps the accepted platform and status sets explicit', () => {
  assert.deepEqual([...ALLOWED_PLATFORMS].sort(), ['Facebook', 'Instagram', 'Other', 'Twitter', 'WhatsApp'].sort());
  assert.deepEqual([...ALLOWED_STATUSES].sort(), ['Pending', 'Verified Fake', 'Verified True'].sort());
});

test('serves the app locally, hides dotfiles, and keeps the API disabled by default', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const baseURL = `http://127.0.0.1:${address.port}`;

  try {
    const home = await fetch(baseURL);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /DrishtiX/);

    const hidden = await fetch(`${baseURL}/.env.example`);
    assert.equal(hidden.status, 404);

    const api = await fetch(`${baseURL}/api/reports`);
    assert.equal(api.status, 503);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
