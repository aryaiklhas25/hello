import { searchArticles, highlight, escapeHtml, formatClock, formatLongDate, formatShortDate, isValidEmail } from './src/search.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Dates and live clock (WIB) */
const now = new Date();
$('#topDate').textContent = formatLongDate(now);
$('#editionDate').textContent = formatShortDate(now);
const clock = $('#clock');
const tick = () => { clock.textContent = formatClock(new Date()); };
tick();
setInterval(tick, 1000);

/* Breaking ticker */
const tickers = [
  'Pemerintah menyiapkan peta jalan energi bersih untuk satu dekade ke depan',
  'Redaksi MataTinta menelusuri kota-kota yang tumbuh di sepanjang rel',
  'Indeks literasi nasional naik, tetapi akses buku masih timpang',
  'BMKG: musim hujan bergeser dua pekan di sebagian Jawa dan Sumatra',
  'Rupiah menguat tipis, pasar menunggu arah suku bunga bank sentral',
];
let tickerIndex = 0;
let tickerTimer;
const tickerText = $('#tickerText');
const tickerCount = $('#tickerCount');
function showTicker(index) {
  tickerIndex = (index + tickers.length) % tickers.length;
  tickerText.classList.add('changing');
  setTimeout(() => {
    tickerText.textContent = tickers[tickerIndex];
    tickerCount.textContent = `${tickerIndex + 1}/${tickers.length}`;
    tickerText.classList.remove('changing');
  }, 150);
}
function restartTicker() {
  clearInterval(tickerTimer);
  tickerTimer = setInterval(() => showTicker(tickerIndex + 1), 7000);
}
$('#tickerNext').addEventListener('click', () => { showTicker(tickerIndex + 1); restartTicker(); });
$('#tickerPrev').addEventListener('click', () => { showTicker(tickerIndex - 1); restartTicker(); });
$('.ticker').addEventListener('mouseenter', () => clearInterval(tickerTimer));
$('.ticker').addEventListener('mouseleave', restartTicker);
restartTicker();

/* Modal */
const modal = $('#modal');
const modalContent = $('#modalContent');
function openModal(html) {
  modalContent.innerHTML = html;
  if (!modal.open) modal.showModal();
}
$('.close-modal').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

$('#subscribeButton').addEventListener('click', () => openModal(`
  <span class="tag">LANGGANAN</span>
  <h2 id="modalTitle">Jadikan membaca kebiasaan baik.</h2>
  <p>Akses penuh ke semua liputan, kolom, dan arsip MataTinta. Mulai dari Rp29.000 per bulan, bisa dibatalkan kapan saja.</p>
  <ul><li>Liputan panjang tanpa batas</li><li>Edisi surel setiap Minggu pagi</li><li>Dukungan untuk jurnalisme independen</li></ul>
  <button class="subscribe-button" type="button" data-close>Mulai berlangganan →</button>`));

$$('.login-button').forEach((btn) => btn.addEventListener('click', () => {
  closeDrawer();
  openModal(`<span class="tag">AKUN</span><h2 id="modalTitle">Selamat datang kembali.</h2><p>Masuk untuk menyimpan artikel, mengikuti kolumnis favorit, dan menyinkronkan bacaan antar perangkat.</p><button class="subscribe-button" type="button" data-close>Masuk dengan email →</button>`);
}));
modalContent.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) modal.close(); });

/* Headline board expand/collapse */
const boardToggle = $('#boardToggle');
boardToggle.addEventListener('click', () => {
  const expanded = boardToggle.getAttribute('aria-expanded') === 'true';
  $$('.board-extra').forEach((el) => { el.hidden = expanded; });
  boardToggle.setAttribute('aria-expanded', String(!expanded));
  boardToggle.setAttribute('aria-label', expanded ? 'Tampilkan lebih banyak berita' : 'Tampilkan lebih sedikit berita');
});

/* Article index for search */
const articles = $$('article[data-category]').map((el, i) => {
  const heading = el.querySelector('h1, h2, h3');
  el.dataset.articleId = String(i);
  return { id: String(i), title: heading ? heading.textContent.trim() : '', category: el.dataset.category, el };
});

function runSearch(query) {
  const value = query.trim();
  if (!value) return;
  closeDrawer();
  const hits = searchArticles(articles, value).slice(0, 8);
  const list = hits.length
    ? `<ul class="search-results">${hits.map((a) => `<li><span class="tag">${escapeHtml(a.category.toUpperCase())}</span><a href="#" data-jump="${a.id}">${highlight(a.title, value)}</a></li>`).join('')}</ul>`
    : `<p>Tidak ada artikel yang cocok. Coba kata kunci lain, misalnya “kota”, “laut”, atau “ekonomi”.</p>`;
  openModal(`<span class="tag">PENCARIAN</span><h2 id="modalTitle">${hits.length} hasil untuk “${escapeHtml(value)}”</h2>${list}`);
}
$$('.search-form').forEach((form) => form.addEventListener('submit', (e) => {
  e.preventDefault();
  runSearch(form.elements.q.value);
}));
modalContent.addEventListener('click', (e) => {
  const link = e.target.closest('[data-jump]');
  if (!link) return;
  e.preventDefault();
  modal.close();
  jumpTo(articles[Number(link.dataset.jump)].el);
});
function jumpTo(el) {
  // Collapsed board items are hidden; reveal them before scrolling.
  if (el.hidden && el.classList.contains('board-extra')) boardToggle.click();
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('flash');
  setTimeout(() => el.classList.remove('flash'), 1600);
}

/* Newsletter */
const newsletterForm = $('#newsletterForm');
const formMessage = $('#formMessage');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = newsletterForm.elements.email.value;
  formMessage.classList.remove('error', 'success');
  if (!isValidEmail(email)) {
    formMessage.textContent = 'Mohon masukkan alamat email yang valid.';
    formMessage.classList.add('error');
    return;
  }
  formMessage.textContent = `Terima kasih. Edisi pertama akan tiba di ${email.trim()} Minggu depan.`;
  formMessage.classList.add('success');
  newsletterForm.reset();
});

/* Mobile drawer */
const drawer = $('#drawer');
const menuButton = $('#menuButton');
function setDrawer(open) {
  drawer.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
}
function closeDrawer() { if (!drawer.hidden) setDrawer(false); }
menuButton.addEventListener('click', () => setDrawer(drawer.hidden));
drawer.addEventListener('click', (e) => { if (e.target.closest('a')) closeDrawer(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

/* Active category highlight while scrolling */
const navLinks = $$('.nav-inner a');
const sectionByHash = new Map(navLinks.map((a) => [a.hash, document.querySelector(a.hash)]).filter(([, el]) => el));
function setActive(hash) {
  navLinks.forEach((a) => a.classList.toggle('active', a.hash === hash));
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((en) => en.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(`#${visible.target.id}`);
  }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, .1, .5] });
  sectionByHash.forEach((el) => observer.observe(el));
}
navLinks.forEach((a) => a.addEventListener('click', () => setActive(a.hash)));

/* Card click-through: whole card is the affordance */
$$('.headline-board article, .spotlight-side article, .latest article, .rail article, .media-grid article').forEach((card) => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h2, h3')?.textContent.trim() ?? '';
    const category = card.dataset.category ?? '';
    openModal(`<span class="tag">${escapeHtml(category.toUpperCase())}</span><h2 id="modalTitle">${escapeHtml(title)}</h2><p>Artikel lengkap akan tersedia saat CMS terhubung. Untuk sekarang, Anda dapat berlangganan agar tidak melewatkan terbitannya.</p><button class="subscribe-button" type="button" data-close>Tutup</button>`);
  });
});
