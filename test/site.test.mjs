import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

test('page is Indonesian and carries the MataTinta identity', () => {
  assert.match(html, /<html lang="id">/);
  assert.match(html, /MataTinta — Membaca Indonesia Lebih Dalam/);
  assert.match(css, /--terra:\s*#c7522a/i);
});

test('legacy layout regions are all present', () => {
  for (const selector of ['class="masthead', 'class="category-nav', 'id="clock"', 'class="ticker', 'class="hero-story', 'class="headline-board', 'class="trending', 'class="spotlight', 'class="opinion', 'class="newsletter', 'class="rails', 'class="multimedia', '<footer']) {
    assert.ok(html.includes(selector), `missing ${selector}`);
  }
});

test('every category nav link targets an existing section', () => {
  const hashes = [...html.matchAll(/<nav[\s\S]*?<\/nav>/g)][0][0].matchAll(/href="#([^"]+)"/g);
  for (const [, id] of hashes) {
    assert.ok(new RegExp(`id="${id}"`).test(html), `no section for #${id}`);
  }
});

test('desktop lead grid is 7/3 and collapses on mobile', () => {
  assert.match(css, /\.lead-grid\s*{[^}]*grid-template-columns:\s*7fr 3fr/);
  assert.match(css, /@media \(max-width: 960px\)[\s\S]*\.lead-grid\s*{\s*grid-template-columns:\s*1fr/);
});

test('every image has alt text', () => {
  for (const [tag] of html.matchAll(/<img[^>]*>/g)) {
    assert.match(tag, /alt="[^"]+"/, `image without alt: ${tag}`);
  }
});
