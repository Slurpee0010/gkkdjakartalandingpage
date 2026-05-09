# Tutorial Hosting Sementara GKKD Jakarta

Dokumen ini menjelaskan cara menayangkan web `gkkd-jakarta` secara online sementara untuk presentasi menggunakan Firebase Hosting Preview Channel.

## Tujuan

Dengan setup ini, Anda bisa:

- membuat link online publik sementara untuk demo,
- memperbarui isi website tanpa mengganti link channel yang sama,
- mengatur masa aktif link preview,
- menghindari mengganggu versi live utama.

## Sistem yang sudah disiapkan di project ini

Project ini sudah memiliki:

- build front-end Vite ke folder `dist`,
- konfigurasi Firebase Hosting di `firebase.json`,
- script deploy otomatis di `scripts/deploy-hosting.mjs`,
- command npm untuk login, deploy preview, dan deploy live.

Project Firebase yang dipakai saat ini:

```text
gen-lang-client-0644176391
```

## Perbedaan preview dan live

`Preview`

- cocok untuk presentasi sementara,
- menghasilkan URL khusus channel,
- bisa dihapus atau dibiarkan kadaluarsa otomatis,
- aman dipakai untuk demo karena tidak menimpa release live utama.

`Live`

- dipakai untuk publish ke URL utama Firebase Hosting,
- tidak disarankan untuk demo sementara kalau Anda hanya butuh link presentasi.

Untuk kebutuhan Anda, jalur utama yang dipakai adalah `preview`.

## Prasyarat

Sebelum deploy, pastikan:

- Node.js dan npm sudah terpasang,
- dependensi project sudah ter-install,
- Anda punya akses login ke project Firebase yang benar,
- terminal dibuka di folder project ini.

Folder project:

```powershell
C:\Users\CDC\Downloads\gkkd-jakarta
```

## Command yang tersedia

Daftar command penting:

```bash
npm run hosting:login
npm run hosting:preview
npm run hosting:preview:open
npm run hosting:live
```

Kalau PowerShell memblokir `npm.ps1`, gunakan versi aman berikut:

```powershell
npm.cmd run hosting:login
npm.cmd run hosting:preview
npm.cmd run hosting:preview:open
npm.cmd run hosting:live
```

## Langkah Lengkap Dari Nol

### 1. Masuk ke folder project

```powershell
cd C:\Users\CDC\Downloads\gkkd-jakarta
```

### 2. Login ke Firebase

Jalankan:

```powershell
npm.cmd run hosting:login
```

Yang akan terjadi:

- browser akan terbuka ke halaman login Google,
- Anda login dengan akun yang punya akses ke Firebase project,
- setelah berhasil, terminal akan menyimpan sesi login lokal.

Langkah ini biasanya cukup dilakukan sekali di mesin yang sama.

### 3. Deploy ke hosting sementara

Jalankan:

```powershell
npm.cmd run hosting:preview
```

Yang dilakukan script ini:

1. build production dengan Vite,
2. mengambil project Firebase dari `.firebaserc`,
3. deploy ke Firebase Hosting Preview Channel bernama `presentasi`,
4. menampilkan URL publik hasil deploy.

Contoh hasil akhir di terminal:

```text
Deploy preview channel 'presentasi' berhasil.
URL: https://nama-project--presentasi-xxxxx.web.app
```

Link itulah yang dibagikan ke audience presentasi.

### 4. Buka otomatis di browser

Kalau ingin setelah deploy langsung dibuka:

```powershell
npm.cmd run hosting:preview:open
```

### 5. Ulang deploy tanpa ganti link channel utama

Kalau Anda mengubah isi website lalu ingin memperbarui demo yang sama:

```powershell
npm.cmd run hosting:preview
```

Channel default project ini adalah `presentasi`, jadi deploy berikutnya akan memperbarui channel tersebut lagi.

Penting:

- Link preview bukan link permanen.
- Default masa aktif channel di project ini adalah `7d`.
- Jika hari ini sudah lewat lebih dari 7 hari sejak deploy terakhir, link lama memang akan mati dan Anda harus deploy ulang.

## Menggunakan Channel dan Waktu Kadaluarsa Custom

Kalau Anda ingin channel berbeda untuk acara tertentu:

```powershell
npm.cmd run hosting:preview -- --channel demo-pemuda --expires 3d
```

Penjelasan:

- `--channel demo-pemuda` membuat nama channel khusus,
- `--expires 3d` membuat link kadaluarsa dalam 3 hari.

Contoh lain:

```powershell
npm.cmd run hosting:preview -- --channel rapat-majelis --expires 7d
npm.cmd run hosting:preview -- --channel ibadah-khusus --expires 30d
npm.cmd run hosting:preview -- --channel presentasi-mei --expires 30d
```

## Alur Paling Praktis Untuk Presentasi

Jika Anda hanya ingin hasil cepat:

1. Buka terminal di folder project.
2. Jalankan `npm.cmd run hosting:login` jika belum login.
3. Jalankan `npm.cmd run hosting:preview`.
4. Tunggu sampai muncul `URL: ...`.
5. Buka link itu dan bagikan.

## Jika Ingin Publish ke URL Live

Untuk publish ke URL utama Firebase Hosting:

```powershell
npm.cmd run hosting:live
```

Gunakan ini hanya jika memang ingin mengganti versi utama yang aktif.

## Cara Cek Bahwa Deploy Berhasil

Deploy dianggap berhasil jika:

- terminal menampilkan `Deploy complete!`,
- ada baris `URL: https://...`,
- saat link dibuka, website tampil normal,
- refresh halaman tetap berhasil dan tidak error 404.

Project ini sudah memakai rewrite SPA ke `index.html`, jadi navigasi React tetap aman di hosting.

## Troubleshooting

### PowerShell menolak `npm`

Jika muncul error seperti:

```text
npm.ps1 cannot be loaded because running scripts is disabled on this system
```

Gunakan:

```powershell
npm.cmd run hosting:preview
```

Jangan pakai `npm run ...` biasa di PowerShell yang policy-nya ketat.

### Belum login Firebase

Jika deploy meminta login ulang, jalankan:

```powershell
npm.cmd run hosting:login
```

### Link preview tidak bisa dipakai untuk demo admin Google Login

Jika halaman admin memakai Firebase Authentication Google Sign-In, domain preview kadang perlu diizinkan dulu di Firebase Console.

Periksa di:

```text
Firebase Authentication > Settings > Authorized domains
```

Tambahkan domain preview yang dipakai jika login admin ditolak.

### Build gagal

Coba cek dulu build manual:

```powershell
npm.cmd run build
npm.cmd run lint
```

Kalau salah satu gagal, perbaiki error project dulu sebelum deploy.

### Ingin mengganti project Firebase

Project aktif dibaca dari file:

```text
.firebaserc
```

Jika suatu saat Anda ingin pindah project, ubah mapping project default di file tersebut dengan hati-hati.

## File Yang Terkait Dengan Sistem Hosting Ini

- `firebase.json`
- `.firebaserc`
- `scripts/deploy-hosting.mjs`
- `package.json`

## Ringkasan Cepat

Command utama untuk hosting sementara:

```powershell
npm.cmd run hosting:login
npm.cmd run hosting:preview
```

Command utama untuk update demo yang sama:

```powershell
npm.cmd run hosting:preview
```

Command untuk demo dengan channel custom:

```powershell
npm.cmd run hosting:preview -- --channel demo-acara --expires 7d
```

Jika Anda hanya butuh satu kalimat kerja:

```text
Login sekali, lalu setiap mau presentasi jalankan hosting:preview dan bagikan URL yang muncul.
```
