const clock = document.querySelector('#clock');
const tickers = [
  'Pemerintah menyiapkan peta jalan energi bersih untuk satu dekade ke depan',
  'Redaksi MataTinta menelusuri kota-kota yang tumbuh di sepanjang rel',
  'Indeks literasi nasional naik, tetapi akses buku masih timpang'
];
let tickerIndex = 0;
function updateClock() { clock.textContent = `${new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date())} WIB`; }
updateClock(); setInterval(updateClock, 1000);
function nextTicker() { tickerIndex = (tickerIndex + 1) % tickers.length; const el = document.querySelector('#tickerText'); el.classList.add('changing'); setTimeout(() => { el.textContent = tickers[tickerIndex]; el.classList.remove('changing'); }, 150); }
document.querySelector('#tickerNext').addEventListener('click', nextTicker); setInterval(nextTicker, 7000);
const modal = document.querySelector('#modal'), modalContent = document.querySelector('#modalContent');
function openModal(html) { modalContent.innerHTML = html; modal.showModal(); }
document.querySelector('.close-modal').addEventListener('click', () => modal.close());
document.querySelector('#subscribeButton').addEventListener('click', () => openModal('<span class="tag">LANGGANAN</span><h2>Jadikan membaca kebiasaan baik.</h2><p>Dapatkan akses penuh untuk semua cerita MataTinta.</p><button class="subscribe-button">Mulai berlangganan →</button>'));
document.querySelector('#loginButton').addEventListener('click', () => openModal('<span class="tag">AKUN</span><h2>Selamat datang kembali.</h2><p>Fitur masuk akan segera tersedia.</p>'));
document.querySelector('#searchForm').addEventListener('submit', (e) => { e.preventDefault(); const value = document.querySelector('#searchInput').value.trim(); if (value) openModal(`<span class="tag">PENCARIAN</span><h2>Hasil untuk “${value.replace(/[<>]/g, '')}”</h2><p>Kami sedang menyiapkan arsip lengkap MataTinta untuk Anda.</p>`); });
document.querySelector('#newsletterForm').addEventListener('submit', (e) => { e.preventDefault(); document.querySelector('#formMessage').textContent = 'Terima kasih. Anda sudah terdaftar.'; e.target.reset(); });
document.querySelector('.menu-button').addEventListener('click', (e) => { const nav = document.querySelector('.category-nav'); const open = nav.classList.toggle('mobile-open'); e.currentTarget.setAttribute('aria-expanded', open); });
