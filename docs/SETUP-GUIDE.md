# Setup Guide - Step by Step

## 1. Persiapan TMDB API

### Cara Mendapatkan TMDB API Key:

1. Kunjungi https://www.themoviedb.org/
2. Klik "Join TMDB" di pojok kanan atas
3. Isi form registrasi dan verifikasi email
4. Setelah login, klik profile icon > Settings
5. Pilih menu "API" di sidebar kiri
6. Klik "Create" atau "Request an API Key"
7. Pilih "Developer" (untuk penggunaan non-komersial)
8. Isi form aplikasi:
   - Application Name: Movie Dashboard
   - Application URL: http://localhost:3000
   - Application Summary: Learning project for movie analytics
9. Setujui terms of use
10. Copy "API Key (v3 auth)" yang muncul

## 2. Persiapan Supabase

### Cara Setup Supabase Project:

1. Kunjungi https://supabase.com/
2. Klik "Start your project" dan login dengan GitHub
3. Klik "New Project"
4. Isi form:
   - Name: movie-dashboard
   - Database Password: (buat password kuat, simpan!)
   - Region: Pilih yang terdekat (Southeast Asia - Singapore)
5. Klik "Create new project" dan tunggu ~2 menit

### Setup Database Schema:

1. Setelah project ready, buka menu "SQL Editor" di sidebar
2. Klik "New query"
3. Copy seluruh isi file `supabase-schema.sql`
4. Paste ke SQL Editor
5. Klik "Run" atau tekan Ctrl+Enter
6. Pastikan muncul "Success. No rows returned"

### Dapatkan Credentials:

1. Buka menu "Settings" > "API"
2. Copy nilai berikut:
   - Project URL (di bagian "Project URL")
   - anon public key (di bagian "Project API keys")

## 3. Konfigurasi Environment Variables

1. Buka file `.env.local` di root project
2. Replace placeholder dengan nilai sebenarnya:

\`\`\`env
# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9... # Paste API key dari TMDB
TMDB_API_BASE_URL=https://api.themoviedb.org/3

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co # Paste Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Paste anon key
\`\`\`

3. Save file

## 4. Install Dependencies & Run

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

## 5. First Time Usage

1. Buka browser ke http://localhost:3000
2. Klik "Data Management"
3. Klik tombol "Sync Data" (biru dengan icon refresh)
4. Tunggu beberapa detik hingga muncul alert "Sync successful!"
5. Klik OK, halaman akan reload otomatis
6. Sekarang tabel akan terisi dengan data film dari TMDB
7. Kembali ke Home dan klik "Dashboard" untuk melihat analytics

## Troubleshooting

### Error: "Failed to fetch movies from TMDB"
- Cek apakah TMDB API key sudah benar
- Pastikan tidak ada spasi di awal/akhir API key
- Cek koneksi internet

### Error: "Failed to fetch movies" (dari Supabase)
- Pastikan Supabase URL dan anon key sudah benar
- Cek apakah schema sudah dijalankan dengan benar
- Buka Supabase dashboard > Table Editor, pastikan table "movies" dan "sync_logs" ada

### Table tidak muncul di Supabase
- Jalankan ulang SQL schema di SQL Editor
- Pastikan tidak ada error saat run SQL
- Refresh halaman Table Editor

### Sync berhasil tapi data tidak muncul
- Buka browser console (F12) dan cek error
- Pastikan tidak ada error CORS
- Cek Supabase logs di dashboard

### Port 3000 sudah digunakan
\`\`\`bash
# Gunakan port lain
npm run dev -- -p 3001
\`\`\`

## Tips

1. **Sync Data Berkala**: Klik Sync Data setiap beberapa hari untuk update data terbaru
2. **Backup Database**: Export data dari Supabase dashboard secara berkala
3. **Monitor Quota**: TMDB free tier ada limit request, jangan terlalu sering sync
4. **Development**: Gunakan React DevTools untuk debugging

## Next Steps

Setelah setup berhasil, coba:
- Tambah film manual via "Add Movie"
- Edit data film yang ada
- Coba filter dan search
- Lihat analytics di Dashboard
- Ubah date range untuk melihat data periode berbeda

## Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Recharts Documentation](https://recharts.org/)
