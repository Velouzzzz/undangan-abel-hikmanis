/**
 * CONTOH Google Apps Script untuk RSVP + ucapan (referensi; sesuaikan bila Anda membuat sendiri).
 *
 * Kontrak dengan frontend (js/app.js):
 *   POST  (Content-Type: text/plain, isi JSON)
 *     { action:"rsvp", name, status:"Hadir|Tidak hadir|Masih ragu", guests:0-10, message, timestamp:ISO8601 }
 *   Respons WAJIB JSON {"ok":true} bila data sudah tersimpan, atau {"ok":false,"error":"..."}.
 *   Frontend hanya menampilkan "berhasil" jika menerima ok:true.
 *   GET ?action=wishes -> { wishes:[{name,message,status,timestamp}], counts:{hadir,tidak,ragu} }
 *
 * Cara pakai:
 * 1) Buat Google Sheet, salin ID-nya ke SHEET_ID. Tab RSVP & Ucapan dibuat otomatis.
 * 2) Extensions > Apps Script, tempel kode ini, simpan.
 * 3) Deploy > New deployment > Web app; Execute as: Me; Who has access: Anyone.
 * 4) Salin URL /exec ke RSVP_API_URL di config.js. Setiap mengubah kode, deploy ulang (New version).
 */
const SHEET_ID = 'GANTI_DENGAN_ID_GOOGLE_SHEET';
const RSVP_HEAD = ['Waktu Server', 'Waktu Kirim (klien)', 'Nama', 'Status', 'Jumlah Tamu', 'Ucapan'];
const WISH_HEAD = ['Waktu', 'Nama', 'Ucapan', 'Status'];
const STATUSES = ['Hadir', 'Tidak hadir', 'Masih ragu'];

function book() { return SpreadsheetApp.openById(SHEET_ID); }
function sheet(name, headers) { let s = book().getSheetByName(name); if (!s) { s = book().insertSheet(name); s.appendRow(headers); } return s; }
function clean(v, n) { return String(v == null ? '' : v).replace(/[<>]/g, '').trim().slice(0, n || 500); }
/* cegah rumus spreadsheet (=, +, -, @) dari input pengunjung */
function cell(v) { return /^[=+\-@]/.test(v) ? "'" + v : v; }
function output(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (d.action !== 'rsvp') return output({ ok: false, error: 'Aksi tidak dikenal' });
    const name = clean(d.name, 80), message = clean(d.message, 500), status = STATUSES.indexOf(d.status) > -1 ? d.status : '';
    if (!name) throw new Error('Nama wajib diisi');
    if (!status) throw new Error('Status kehadiran tidak valid');
    const guests = status === 'Tidak hadir' ? 0 : Math.max(1, Math.min(10, Number(d.guests) || 1));
    sheet('RSVP', RSVP_HEAD).appendRow([new Date(), clean(d.timestamp, 40), cell(name), status, guests, cell(message)]);
    if (message) sheet('Ucapan', WISH_HEAD).appendRow([new Date(), cell(name), cell(message), status]);
    return output({ ok: true });
  } catch (err) {
    return output({ ok: false, error: String(err.message || err) });
  } finally { try { lock.releaseLock(); } catch (x) {} }
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.action !== 'wishes') return output({ ok: false, error: 'Aksi tidak dikenal' });
  const rows = sheet('Ucapan', WISH_HEAD).getDataRange().getValues().slice(1).reverse().slice(0, 100);
  const wishes = rows.map(function (r) { return { name: String(r[1]), message: String(r[2]), status: String(r[3] || ''), timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0]) }; });
  const counts = { hadir: 0, tidak: 0, ragu: 0 };
  sheet('RSVP', RSVP_HEAD).getDataRange().getValues().slice(1).forEach(function (r) {
    const t = String(r[3]); if (t === 'Hadir') counts.hadir++; else if (t === 'Tidak hadir') counts.tidak++; else counts.ragu++;
  });
  return output({ ok: true, wishes: wishes, counts: counts });
}
