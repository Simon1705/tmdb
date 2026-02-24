# Movie Dashboard - TMDB API & Supabase

Dashboard analitik untuk data film dari TMDB API dengan fitur manajemen data lengkap (CRUD).

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **API**: The Movie Database (TMDB)
- **Icons**: Lucide React

## Fitur

### ✅ Konsumsi API Publik
- Integrasi dengan TMDB API untuk data film populer
- Sinkronisasi otomatis dengan tombol Sync
- Tracking waktu sinkronisasi terakhir

### ✅ Manajemen Data (CRUD)
- Create: Tambah film baru
- Read: Tampilan tabel dengan data lengkap
- Update: Edit data film
- Delete: Hapus film

### ✅ Fitur Pencarian & Filter
- Search by title
- Filter by genre
- Sort by semua kolom (title, date, genre, rating, updated_at)
- Default sorting: last updated (descending)

### ✅ Dashboard Analitik
- **Pie Chart**: Distribusi film berdasarkan genre
- **Column Chart**: Jumlah film per tanggal rilis
- **Summary Cards**: Total movies, most popular genre, total genres
- **Date Range Filter**: Filter data untuk periode tertentu (default: 1 bulan terakhir)

## Setup Instructions

### 1. Clone & Install Dependencies

\`\`\`bash
cd movie-dashboard
npm install
\`\`\`

### 2. Setup TMDB API

1. Buat akun di [TMDB](https://www.themoviedb.org/)
2. Dapatkan API Key dari [Settings > API](https://www.themoviedb.org/settings/api)
3. Copy API key

### 3. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com/)
2. Buka SQL Editor di dashboard Supabase
3. Copy isi file `supabase-schema.sql` dan jalankan di SQL Editor
4. Dapatkan Project URL dan Anon Key dari Settings > API

### 4. Environment Variables

Edit file `.env.local`:

\`\`\`env
# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_actual_tmdb_api_key
TMDB_API_BASE_URL=https://api.themoviedb.org/3

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000)

## Cara Penggunaan

### First Time Setup

1. Buka halaman **Data Management**
2. Klik tombol **Sync Data** untuk mengambil data dari TMDB API
3. Tunggu proses sync selesai (akan muncul notifikasi)
4. Data film akan muncul di tabel (~80 movies dari 4 kategori)

**Sync Categories:**
- Popular Movies
- Top Rated Movies
- Now Playing Movies
- Upcoming Movies

**Note:** Setiap sync akan fetch dari 4 kategori berbeda untuk variasi data yang lebih baik.

### Dashboard

- Lihat visualisasi data dalam bentuk Pie Chart dan Column Chart
- Gunakan date range filter untuk melihat data periode tertentu
- Summary cards menampilkan statistik ringkas

### Data Management

- **Search**: Ketik judul film di search box
- **Filter**: Pilih genre dari dropdown
- **Sort**: Klik header kolom untuk sorting
- **Add**: Klik tombol "Add Movie" untuk menambah film manual
- **Edit**: Klik icon pensil untuk edit data
- **Delete**: Klik icon trash untuk hapus data
- **Sync**: Klik "Sync Data" untuk update data dari TMDB

## Database Schema

### Table: movies
- `id`: UUID (Primary Key)
- `api_id`: Integer (Unique, dari TMDB)
- `title`: Text
- `release_date`: Date
- `genre`: Text
- `overview`: Text
- `poster_path`: Text
- `backdrop_path`: Text
- `vote_average`: Decimal
- `vote_count`: Integer
- `popularity`: Decimal
- `original_language`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp (auto-update)

### Table: sync_logs
- `id`: UUID (Primary Key)
- `synced_at`: Timestamp
- `records_fetched`: Integer
- `records_created`: Integer
- `records_updated`: Integer
- `status`: Text (success/partial/failed)
- `error_message`: Text

## API Endpoints

- `GET /api/movies` - Get all movies (with filters)
- `POST /api/movies` - Create new movie
- `GET /api/movies/[id]` - Get single movie
- `PUT /api/movies/[id]` - Update movie
- `DELETE /api/movies/[id]` - Delete movie
- `POST /api/sync` - Sync data from TMDB
- `GET /api/sync` - Get last sync status
- `GET /api/analytics` - Get analytics data

## Nilai Tambah

- ✅ Summary cards dengan statistik
- ✅ Loading states & error handling
- ✅ Responsive design
- ✅ Toast notifications (via alert)
- ✅ Auto-update timestamp
- ✅ Upsert mechanism (no duplicates)
- ✅ Clean & modern UI
- ✅ **Enhanced Date Filter**: Quick select buttons untuk periode umum
- ✅ **Active Filter Info**: Visual indicator periode yang sedang ditampilkan
- ✅ **Improved Cards**: Gradient icons dengan hover effects
- ✅ **Empty State**: Helpful message saat tidak ada data
- ✅ **Better Loading**: Animated spinner dengan descriptive text

## Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Troubleshooting

### Data tidak muncul setelah sync
- Pastikan TMDB API key valid
- Cek console browser untuk error
- Pastikan Supabase connection berhasil

### Chart tidak muncul
- Pastikan ada data di database
- Cek date range filter (mungkin tidak ada data di periode tersebut)

### Error saat CRUD
- Pastikan Supabase RLS (Row Level Security) disabled atau dikonfigurasi dengan benar
- Cek Supabase logs untuk detail error

## License

MIT

## Documentation

Dokumentasi lengkap tersedia di folder `docs/`:

- [Setup Guide](docs/SETUP-GUIDE.md) - Panduan setup lengkap
- [Project Structure](docs/PROJECT-STRUCTURE.md) - Struktur project dan arsitektur
- [Checklist Tugas](docs/CHECKLIST-TUGAS.md) - Checklist requirement tugas
- [UI Improvements](docs/UI-IMPROVEMENTS.md) - Dokumentasi peningkatan UI/UX
- [Data Management UX](docs/DATA-MANAGEMENT-UX-IMPROVEMENTS.md) - Peningkatan UX data management
- [Sync Improvements](docs/SYNC-IMPROVEMENTS.md) - Perbaikan fitur sync
- [Search Debounce](docs/SEARCH-DEBOUNCE.md) - Implementasi debounce search
- [Modal Improvements](docs/MODAL-TOAST-IMPROVEMENTS.md) - Peningkatan modal & toast
- [Modal Animations](docs/MODAL-ANIMATIONS.md) - Animasi modal
- [Next.js 15 Params Fix](docs/NEXTJS-15-PARAMS-FIX.md) - Fix untuk Next.js 15
- [API ID Fix](docs/API-ID-FIX.md) - Perbaikan API ID overflow
- [Text Contrast Fix](docs/TEXT-CONTRAST-FIX.md) - Perbaikan kontras teks
