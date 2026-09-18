const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
test('site has MataTinta identity and core interactive hooks', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const js = fs.readFileSync('main.js', 'utf8');
  assert.match(html, /MataTinta/);
  assert.match(html, /id="newsletterForm"/);
  assert.match(html, /id="clock"/);
  assert.match(js, /updateClock/);
  assert.match(js, /nextTicker/);
});
