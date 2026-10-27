# NJM Advertising — PT Naga Jaya Mandiri

Landing page Jasa Neon Box, Huruf Timbul & Signage Jabodetabek. Next.js 16 + Tailwind CSS v4, di-host di Vercel
(project `nagajayamandiriweb`, domain `www.njm-advertising.com`). Setiap push ke `main` otomatis di-deploy Vercel.

## Pengembangan lokal

```bash
pnpm install
npx vercel env pull .env.local   # ambil BLOB_READ_WRITE_TOKEN (sekali saja)
pnpm dev                         # http://localhost:3000 · panel: http://localhost:3000/kelola-seo-njm
```

Data panel saat lokal/preview disimpan di folder `njm-local/` / `njm-preview/` pada Blob store, terpisah dari produksi (`njm/`).

## Panel SEO tersembunyi

- Alamat: `https://www.njm-advertising.com/kelola-seo-njm`. Tidak ditautkan dari halaman mana pun dan tidak diindeks.
- Password ditulis di kode (bukan `.env`) dalam bentuk hash scrypt di `lib/server/auth.ts`; cara menggantinya ada di komentar file itu.
  Setelah 5 kali salah, login dikunci 15 menit per IP.
- **Tab SEO:** judul, deskripsi, kata kunci, URL kanonik, izin indeks, verifikasi Google Search Console
  (tag meta atau file HTML), verifikasi Bing, Google Analytics 4, Google Tag Manager.
- **Tab Foto:** 28 slot — logo, gambar share, favicon, ikon WhatsApp, 6 slide hero, 3 foto owner, dan 15 foto portofolio.
  Bisa diganti lewat unggah file atau URL, dan dikembalikan ke default. Foto besar diperkecil otomatis di browser (maks. 2200 px).
- Perubahan langsung aktif tanpa deploy ulang: halaman dibuat ulang otomatis setiap kali panel menyimpan.

## Penyimpanan (Vercel Blob)

Filesystem Vercel read-only, jadi pengaturan dan foto unggahan disimpan di Vercel Blob store `njm-kelola-seo`
(token `BLOB_READ_WRITE_TOKEN` dipasang otomatis oleh Vercel). Setiap simpan menulis versi baru di
`njm/settings/{seo,images}/<waktu>.json`; 5 versi terakhir disimpan sebagai cadangan. Foto unggahan ada di `njm/uploads/`.

| Yang diubah | File |
|---|---|
| Nilai awal SEO (sebelum panel dipakai) | `config/seo.ts` |
| Daftar slot foto & foto default | `config/images.ts` |
| Navigasi, WhatsApp, Instagram | `config/site.ts` |
| Isi halaman (layanan, harga, FAQ, portofolio) | `app/(site)/page.tsx` |
