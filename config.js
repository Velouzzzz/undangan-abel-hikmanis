/* =========================================================
   SATU-SATUNYA TEMPAT CUSTOM DATA UNDANGAN
   Ganti teks [PLACEHOLDER] dan URL/foto sesuai kebutuhan.
   Tanggal acara gunakan format ISO: YYYY-MM-DDTHH:mm:ss+07:00
   ========================================================= */
/* ---------------------------------------------------------
   RSVP — URL Web App Google Apps Script (berakhiran /exec).
   Kosong = sistem RSVP belum aktif (form menampilkan pesan
   "belum dikonfigurasi" dan TIDAK berpura-pura berhasil).
   Hanya URL publik Web App yang boleh di sini; jangan pernah
   menaruh API key / credential rahasia di file ini.
   --------------------------------------------------------- */
const RSVP_API_URL = "https://script.google.com/macros/s/AKfycbzEbvalcbEJs2jDjkPXYXPzKiG6p52VDUS03IhgqVzldwZYgzwnReZwwGZSb-OoJi68/exec";

window.WEDDING_CONFIG = {
  couple: {
    groom: { nickname: "Abel", fullName: "Muhammad Abel Tan Togar Islami", parents: "Putra dari Bapak Hendra Kusuma & Ibu Leni Marlina", photo: "assets/photos/foto-pria-placeholder.svg", alt: "Foto Abel", instagram: "" },
    bride: { nickname: "Hikmanis", fullName: "Hikmanis Suprian", parents: "Putri dari Bapak Suprian & Ibu Nurlaili", photo: "assets/photos/foto-wanita-placeholder.svg", alt: "Foto Hikmanis", instagram: "" }
  },
  event: {
    dateLabel: "Minggu, 3 Januari 2027",
    dateISO: "2027-01-03T08:00:00+07:00",
    akad: { dateLabel: "Minggu, 3 Januari 2027", time: "[JAM AKAD]", startISO: "2027-01-03T08:00:00+07:00", endISO: "2027-01-03T10:00:00+07:00", venue: "[NAMA TEMPAT AKAD]", address: "[ALAMAT LENGKAP]" },
    reception: { dateLabel: "Minggu, 3 Januari 2027", time: "[JAM RESEPSI]", startISO: "2027-01-03T11:00:00+07:00", endISO: "2027-01-03T14:00:00+07:00", venue: "[NAMA TEMPAT RESEPSI]", address: "[ALAMAT LENGKAP]" },
    locationName: "[NAMA LOKASI ACARA]",
    mapsUrl: "https://maps.google.com/?q=Indonesia",
    mapsEmbedUrl: "https://www.google.com/maps?q=Indonesia&output=embed"
  },
  copy: {
    title: "Undangan Pernikahan Abel & Hikmanis",
    hashtag: "#ABELongToHikmanis",
    description: "Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di hari istimewa kami.",
    opening: "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami.",
    quote: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu.",
    quoteSource: "QS. Ar-Rum: 21",
    closing: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.",
    thankYou: "Terima kasih atas doa, cinta, dan kehadiran Anda."
  },
  story: {
    enabled: true,
    moments: [
      { date: "[BULAN TAHUN]", title: "[PERTAMA BERTEMU]", text: "[CERITAKAN MOMEN PERTAMA]", illustration: "assets/illustrations/tint/03_cincin_pernikahan_green.webp" },
      { date: "[BULAN TAHUN]", title: "[MULAI BERSAMA]", text: "[CERITAKAN PERJALANAN]", illustration: "assets/illustrations/tint/11_ranting_daun_maroon.webp" },
      { date: "[BULAN TAHUN]", title: "[LAMARAN]", text: "[CERITAKAN MOMEN LAMARAN]", illustration: "assets/illustrations/tint/12_angsa_hati_maroon.webp" }
    ]
  },
  gallery: [
    { src: "assets/photos/galeri-placeholder.svg", alt: "Foto prewedding 1" },
    { src: "assets/photos/galeri-placeholder.svg", alt: "Foto prewedding 2" },
    { src: "assets/photos/galeri-placeholder.svg", alt: "Foto prewedding 3" }
  ],
  gifts: {
    enabled: true,
    accounts: [
      { bank: "[NAMA BANK]", number: "[NOMOR REKENING]", holder: "[NAMA PEMILIK]" }
    ],
    shippingAddress: "[ALAMAT PENGIRIMAN HADIAH]"
  },
  music: { enabled: true, url: "assets/music/musik-undangan.mp3" },
  backend: {
    /* Jumlah ucapan yang tampil per halaman. URL endpoint ada di RSVP_API_URL (atas file). */
    pageSize: 4
  },
  theme: { ink: "#6B1E27", green: "#2F4A38", accent: "#E8892B", paper: "#E5E6D6", text: "#4A3A38" },
  sections: { story: true, gallery: true, rsvp: true, wishes: true, gifts: true, bottomNav: true, qr: false },
  effects: { boilingLine: true, flowerGrowth: true, parallax: true, petals: true, handwriting: true, easterEgg: true, autoDisableOnLowPower: true },
  seo: { ogImage: "assets/og/og-preview.png", siteUrl: "https://example.com" }
};
