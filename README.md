# MataTinta

Situs berita editorial berbahasa Indonesia dengan identitas visual hangat (krem gandum/mentega, terracotta `#C7522A`, tipografi serif akademis). Dibangun sebagai halaman statis dengan Vite tanpa framework.

## Menjalankan

```bash
npm install
npm run start   # dev server di http://localhost:5173
npm run build   # hasil produksi di dist/
npm test        # unit test (node:test) untuk helper pencarian, format waktu, dan struktur halaman
```

## Struktur

- `index.html` — markup halaman: masthead, navigasi kategori sticky + jam WIB, ticker terkini, layout editorial 7/3, trending, sorotan, opini, newsletter, rails pendukung, foto & video, footer.
- `style.css` — token desain dan tata letak responsif (mobile-first breakpoints 760px / 960px).
- `main.js` — interaksi: jam WIB, ticker, pencarian artikel dengan hasil di modal, drawer menu mobile, papan berita expand/collapse, validasi newsletter, penyorotan kategori aktif saat menggulir.
- `src/search.js` — helper murni (pencarian, sorotan hasil, format tanggal/waktu, validasi email) yang diuji di `test/`.
