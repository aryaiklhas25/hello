// Pure helpers shared by the browser bundle and node tests.

export function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function tokenize(query) {
  return normalize(query).split(/\s+/).filter((t) => t.length > 1);
}

// Ranks articles by how many query tokens hit the title, weighting title matches over category.
export function searchArticles(articles, query) {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  return articles
    .map((article) => {
      const title = normalize(article.title);
      const category = normalize(article.category);
      let score = 0;
      for (const token of tokens) {
        if (title.includes(token)) score += 2;
        if (category.includes(token)) score += 1;
      }
      return { article, score };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.article.title.localeCompare(b.article.title, 'id'))
    .map((hit) => hit.article);
}

export function highlight(title, query) {
  const tokens = tokenize(query);
  if (!tokens.length) return escapeHtml(title);
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi');
  return escapeHtml(title).replace(pattern, '<mark>$1</mark>');
}

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatClock(date, timeZone = 'Asia/Jakarta') {
  const parts = new Intl.DateTimeFormat('id-ID', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '00';
  return `${get('hour')}:${get('minute')}:${get('second')} WIB`;
}

export function formatLongDate(date, timeZone = 'Asia/Jakarta') {
  return new Intl.DateTimeFormat('id-ID', { timeZone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function formatShortDate(date, timeZone = 'Asia/Jakarta') {
  const parts = new Intl.DateTimeFormat('id-ID', { timeZone, day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return `${get('day')}.${get('month')}.${get('year')}`;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
}
