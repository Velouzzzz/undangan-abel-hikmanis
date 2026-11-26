# Undangan Digital — Buku Cerita Bergambar

Proyek HTML/CSS/JavaScript murni, mobile-first, tanpa build tool (langsung bisa di-deploy). Ilustrasi asli PNG tetap disimpan di `assets/illustrations/`; tampilan memakai salinan WebP berwarna di `assets/illustrations/tint/` (lebih ringan). Font di-host lokal di `assets/fonts/` (tanpa Google Fonts).

## Struktur
- `index.html` — undangan utama.
- `config.js` — satu tempat untuk data mempelai, acara, foto, rekening, musik, tema, endpoint, section, dan efek.
- `css/style.css`, `js/app.js` — tampilan dan interaksi.
- `assets/illustrations/` — seluruh ilustrasi asli PNG + salinan WebP lossless.
- `assets/photos/` — placeholder foto SVG; ganti dengan foto milik sendiri.
- `assets/og/og-preview.svg` — placeholder Open Graph.
- `generator-link-tamu.html` — pembuat tautan personal dan pesan WhatsApp.
- `backend/Code.gs` — backend Google Apps Script.

## Pemetaan semua elemen ZIP
| File asli | Pemakaian di undangan |
|---|---|
| `01_floral_corner.png` | Ornamen sudut kiri atas cover |
| `02_buket_bunga.png` | Loading, cover, dekorasi buku tamu/ucapan |
| `03_cincin_pernikahan.png` | Kutipan, dekorasi akad |
| `04_arch_bunga.png` | Cover dan latar dekoratif hero |
| `05_divider_daun.png` | Pemisah setelah hero |
| `06_frame_floral.png` | Dekorasi RSVP |
| `07_amplop_hati.png` | Section tanda kasih/amplop digital |
| `08_kado_pita.png` | Dekorasi alamat pengiriman hadiah |
| `09_kalender_acara.png` | Hitung mundur dan kartu resepsi |
| `10_pin_lokasi.png` | Section lokasi |
| `11_ranting_daun.png` | Pemisah profil dan ilustrasi timeline kisah |
| `12_angsa_hati.png` | Hero pasangan, timeline, dan penutup |
| `13_buket_bunga_liar_alternatif.png` | Ilustrasi utama penutup |

Tidak ada ilustrasi sumber yang digambar ulang atau diubah. File asli disimpan apa adanya; animasi CSS hanya diterapkan pada elemen HTML yang menampilkan ilustrasi.

## Cara custom
1. Buka `config.js`.
2. Ganti semua placeholder `[NAMA ...]`, `[TANGGAL ...]`, nama orang tua, waktu, venue, alamat, teks pembuka/penutup, kutipan, rekening, dan URL Maps.
3. Atur `event.dateISO`, `akad.startISO`, `akad.endISO`, `reception.startISO`, dan `reception.endISO` dengan tanggal ISO lengkap termasuk zona waktu. Contoh `2027-06-20T08:00:00+07:00`.
4. Ganti `assets/photos/foto-pria-placeholder.svg`, `foto-wanita-placeholder.svg`, dan `galeri-placeholder.svg` dengan foto WebP/JPG milik sendiri. Sesuaikan `photo` dan `gallery[].src` di `config.js`. Kompres foto sekitar 150–350 KB per foto dan gunakan ukuran yang sesuai.
5. Letakkan file musik MP3 di `assets/music/` (buat folder jika perlu), lalu isi `music.url`. Musik baru dimulai setelah tombol Buka Undangan ditekan; jika browser menolak autoplay, tombol musik tetap tersedia.
6. Ubah `sections` dan `effects` untuk menyalakan/mematikan fitur. `story.enabled` dan `sections.story` mengontrol kisah kami.
7. Ganti placeholder `assets/og/og-preview.svg` dengan gambar JPG/PNG 1200×630. Untuk WhatsApp/OG, gunakan URL absolut dan pastikan `og:image` pada `index.html` (sekarang `assets/og/og-preview.png`, 1200×630) menunjuk URL absolut tersebut setelah deploy. Preview WhatsApp dapat memerlukan waktu cache.

Nama tamu diambil dari parameter `?to=` melalui `URLSearchParams`, lalu ditampilkan sebagai `textContent` (bukan HTML), sehingga markup/script dari URL tidak dieksekusi. Form membatasi panjang input dan Apps Script membersihkan karakter HTML dasar. Untuk personalisasi RSVP, nama tamu otomatis terisi.

## RSVP dan ucapan: Google Apps Script + Sheets
Endpoint diatur di **satu tempat**: `const RSVP_API_URL = "";` di bagian atas `config.js`.
- Kosong → form menampilkan "Sistem RSVP belum dikonfigurasi" dan tidak mengirim apa pun (tidak ada simulasi sukses).
- Terisi URL Web App (`https://script.google.com/macros/s/.../exec`) → form mengirim **satu** request POST (`Content-Type: text/plain`, isi JSON, tanpa preflight CORS) dan baru menampilkan sukses jika server menjawab JSON `{"ok":true}`.

Data yang dikirim:
```json
{"action":"rsvp","name":"Siti","status":"Hadir | Tidak hadir | Masih ragu","guests":2,"message":"Ucapan/doa (boleh kosong)","timestamp":"2026-11-26T06:23:17.417Z"}
```
`guests` = 0 bila "Tidak hadir". `GET ?action=wishes` mengembalikan `{wishes:[...],counts:{hadir,tidak,ragu}}` (opsional, untuk daftar ucapan dan penghitung).

Langkah nanti: (1) buat Spreadsheet + Apps Script (contoh siap pakai: `backend/Code.gs`, sudah sesuai kontrak di atas), (2) Deploy sebagai Web App: Execute as *Me*, access *Anyone*, (3) tempel URL `/exec` ke `RSVP_API_URL`, (4) uji dari HP lalu cek sheet. Setiap mengubah kode Apps Script, deploy versi baru.

Keamanan: jangan menaruh API key rahasia di frontend. Web App Apps Script bersifat publik; untuk kebutuhan anti-spam lebih tinggi tambahkan CAPTCHA/pembatasan di sisi server.

## Generator link tamu
Buka `generator-link-tamu.html` dari komputer (klik dua kali; di produksi file ini sengaja diblokir), masukkan URL undangan yang sudah live, tempel daftar nama (satu nama per baris), lalu klik Buat link personal. Setiap tamu memperoleh URL `?to=...` dan pesan WhatsApp siap salin.

## Deploy
Cukup unggah isi folder ini apa adanya (tidak perlu build).
- **Netlify:** drag-and-drop folder ke Netlify Drop, atau hubungkan repository Git (Build command kosong, Publish directory `.`). File `_headers` (security header + cache) dan `_redirects` (memblokir `/backend/*`, `README.md`, `generator-link-tamu.html` di produksi) dipakai otomatis. Setelah deploy, buka URL langsung dan refresh — harus tetap berfungsi (single page, tanpa routing).
- **Vercel / GitHub Pages:** framework preset *Other*, tanpa build, output `.`. `_headers`/`_redirects` khusus Netlify dan akan diabaikan di sana; file `backend/`, `README.md` akan ikut terlayani, jadi hapus bila tidak diinginkan.
- Jalankan lokal: `python3 -m http.server 8000` lalu buka http://localhost:8000.

Zoom: viewport memakai `maximum-scale=1.0, user-scalable=no`; iOS Safari mengabaikan itu, sehingga `js/app.js` juga mencegat gesture pinch, dan `touch-action: manipulation` mematikan double-tap zoom. Catatan aksesibilitas: ini mencegah pengguna low-vision memperbesar halaman (Lighthouse menandainya).

## Checklist sebelum dibagikan
- [ ] Semua placeholder di `config.js` telah diganti.
- [ ] Foto placeholder, musik, rekening, dan alamat hadiah sudah benar.
- [ ] Tanggal ISO dan zona waktu sudah benar.
- [ ] URL Google Maps dan embed sudah diuji.
- [ ] Apps Script sudah deploy dan URL endpoint sudah diisi.
- [ ] Tes RSVP dan ucapan dari HP; periksa sheet.
- [ ] Tes `?to=Nama+Tamu` dan nama dengan karakter khusus.
- [ ] Tes semua tombol, kalender, salin rekening, lightbox, navigasi, dan musik.
- [ ] Upload gambar OG 1200×630, ubah metadata menjadi URL absolut, dan cek preview WhatsApp.
- [ ] Uji layar 360 px, desktop, koneksi lambat, serta `prefers-reduced-motion`.

## Catatan implementasi
Loading hanya mem-preload dua ilustrasi penting dan memiliki timeout aman; konten utama tidak bergantung pada animasi untuk dibaca. Foto galeri menggunakan lazy loading. CSS menyediakan fallback font sistem dan menghormati `prefers-reduced-motion`. Untuk hasil Lighthouse terbaik, kompres foto, host font lokal bila ingin menghindari request eksternal, dan gunakan OG JPG/PNG berukuran optimal. Desain ini tidak memuat analytics atau API key pihak ketiga.

## Tampilan baru (mengikuti video referensi)
- Palet krem sage + marun + hijau tua + aksen oranye (diatur di `config.js` → `theme`).
- Ilustrasi asli tetap utuh di `assets/illustrations/`; salinan berwarna marun/hijau/oranye ada di `assets/illustrations/tint/` (dipakai di tampilan).
- Setiap bagian setinggi satu layar dengan scroll-snap; dock navigasi hijau di bawah (`sections.bottomNav`).
- RSVP dan ucapan digabung dalam satu form (nama, ucapan, kehadiran: Hadir / Tidak hadir / Masih ragu) dengan penghitung. Setelah mengganti `backend/Code.gs`, deploy ulang Web App agar penghitung dan status ucapan berfungsi.
- Instagram mempelai opsional: isi `instagram` pada `couple.groom` / `couple.bride` di `config.js`.
- Perbaikan: sampul sekarang benar-benar tersembunyi setelah "Open Invitation" (atribut `hidden` sebelumnya tertimpa CSS `display:grid`).
- Animasi masuk: isi tiap section (judul, ilustrasi, teks, kartu, foto galeri) bergerak masuk bertahap saat section muncul, dan diulang saat dilihat lagi. Diatur di CSS `.rv` dan blok "animasi masuk" pada `js/app.js`.
- Gerakan saat scroll: ilustrasi dan bingkai foto bergeser pelan (parallax) dan ilustrasi sedikit miring mengikuti posisi scroll (blok "gerakan mengikuti scroll" di js/app.js).
- Klik dock: perpindahan antar section dibuat pelan (durasi dasar 1,6 detik, konstanta DUR di js/app.js).
- Scroll mouse/trackpad dibuat sedikit lambat dan halus di desktop (`SPEED`, `EASE` di `js/app.js`). Di HP, scroll sentuh memakai scroll bawaan browser sehingga kecepatannya tidak bisa diubah.
- Musik: `assets/music/musik-undangan.mp3` (150 detik, 80 kbps, ±1,5 MB, fade in/out), diputar berulang setelah tombol Open Invitation ditekan.
- Galeri: bingkai bunga pada tiap foto dengan kolase 2 foto di atas dan 1 di tengah bawah (class .g-item di css/style.css). Label "Ganti foto di sini" hilang otomatis saat foto asli dipasang.
- Perbaikan: coretan kecil ">" di kiri bingkai bunga (bawaan file ilustrasi 06) dihapus dari salinan berwarna di assets/illustrations/tint/.
