import test from 'node:test';
import assert from 'node:assert/strict';
import { searchArticles, highlight, escapeHtml, formatClock, formatShortDate, isValidEmail, tokenize } from '../src/search.js';

const articles = [
  { id: '1', title: 'Rupiah Menguat, Pasar Menanti Sinyal yang Lebih Tegas', category: 'Ekonomi' },
  { id: '2', title: 'Trotoar Bukan Sekadar Jalan Kaki: Jakarta dan Hak Pejalan', category: 'Kota' },
  { id: '3', title: 'Di Ujung Laut yang Kian Hangat, Nelayan Mencari Arah Baru', category: 'Utama' },
  { id: '4', title: 'Usaha Kecil Menemukan Pasar Baru Lewat Komunitas', category: 'Ekonomi' },
];

test('tokenize drops single-character noise and lowercases', () => {
  assert.deepEqual(tokenize('  Pasar  BARU a '), ['pasar', 'baru']);
});

test('searchArticles ranks title hits above category-only hits', () => {
  const hits = searchArticles(articles, 'pasar ekonomi');
  assert.deepEqual(hits.map((a) => a.id), ['1', '4']);
  assert.equal(hits[0].category, 'Ekonomi');
});

test('searchArticles is diacritic and case insensitive', () => {
  assert.equal(searchArticles(articles, 'JAKARTÁ')[0].id, '2');
});

test('searchArticles returns empty for blank queries', () => {
  assert.deepEqual(searchArticles(articles, '   '), []);
});

test('highlight wraps matched tokens and escapes html', () => {
  assert.equal(highlight('Pasar <Baru>', 'pasar'), '<mark>Pasar</mark> &lt;Baru&gt;');
});

test('escapeHtml neutralises markup in user input', () => {
  assert.equal(escapeHtml(`<img src=x onerror="alert('x')">`), '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;');
});

test('formatClock renders WIB time in 24-hour form', () => {
  assert.equal(formatClock(new Date('2026-09-18T06:05:09Z')), '13:05:09 WIB');
});

test('formatShortDate uses dd.mm.yyyy in Jakarta time', () => {
  assert.equal(formatShortDate(new Date('2026-09-18T20:00:00Z')), '19.09.2026');
});

test('isValidEmail accepts plain addresses and rejects malformed ones', () => {
  assert.equal(isValidEmail('pembaca@matatinta.id'), true);
  assert.equal(isValidEmail('bukan-email'), false);
  assert.equal(isValidEmail('a@b'), false);
});
