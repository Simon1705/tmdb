# Project Structure

## Overview
\`\`\`
movie-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── movies/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts     # GET, PUT, DELETE single movie
│   │   │   └── route.ts         # GET all movies, POST new movie
│   │   ├── sync/
│   │   │   └── route.ts         # POST sync, GET last sync status
│   │   └── analytics/
│   │       └── route.ts         # GET analytics data
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard page with charts
│   ├── data-management/
│   │   └── page.tsx             # CRUD table page
│   └── page.tsx                 # Home page
├── components/
│   └── sync-button.tsx          # Reusable sync button component
├── lib/
│   ├── supabase.ts              # Supabase client & types
│   └── tmdb.ts                  # TMDB API client & helpers
├── .env.local                   # Environment variables (gitignored)
├── supabase-schema.sql          # Database schema
└── README.md                    # Main documentation
\`\`\`

## File Descriptions

### `/app` - Application Pages & API

#### Pages (Frontend)
- **page.tsx**: Landing page dengan navigasi ke Dashboard dan Data Management
- **dashboard/page.tsx**: Halaman analytics dengan charts dan summary cards
- **data-management/page.tsx**: Halaman CRUD dengan tabel, search, filter, sort

#### API Routes (Backend)
- **api/movies/route.ts**: 
  - GET: Fetch movies dengan query params (search, genre, sortBy, sortOrder)
  - POST: Create movie baru
  
- **api/movies/[id]/route.ts**:
  - GET: Fetch single movie by ID
  - PUT: Update movie by ID
  - DELETE: Delete movie by ID

- **api/sync/route.ts**:
  - POST: Sync data dari TMDB API ke Supabase
  - GET: Get last sync log

- **api/analytics/route.ts**:
  - GET: Aggregate data untuk charts (genre distribution, movies per date)

### `/components` - Reusable Components

- **sync-button.tsx**: 
  - Button untuk trigger sync
  - Menampilkan last sync time
  - Loading state saat syncing

### `/lib` - Utility Libraries

- **supabase.ts**:
  - Supabase client initialization
  - TypeScript interfaces (Movie, SyncLog)
  - Database connection

- **tmdb.ts**:
  - TMDB API client functions
  - Genre mapping (ID to name)
  - Helper functions (getPosterUrl, getGenreName)
  - Fetch functions (fetchPopularMovies, fetchMoviesByDateRange)

### Configuration Files

- **.env.local**: Environment variables (API keys, database URLs)
- **supabase-schema.sql**: SQL schema untuk setup database
- **tailwind.config.ts**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration
- **next.config.js**: Next.js configuration

## Data Flow

### 1. Sync Flow
\`\`\`
User clicks "Sync Data"
  ↓
POST /api/sync
  ↓
Fetch from TMDB API (lib/tmdb.ts)
  ↓
Upsert to Supabase (lib/supabase.ts)
  ↓
Log sync activity to sync_logs table
  ↓
Return success response
  ↓
Refresh page & show updated data
\`\`\`

### 2. CRUD Flow
\`\`\`
User action (Create/Read/Update/Delete)
  ↓
API call to /api/movies or /api/movies/[id]
  ↓
Supabase query (SELECT/INSERT/UPDATE/DELETE)
  ↓
Return response
  ↓
Update UI state
\`\`\`

### 3. Analytics Flow
\`\`\`
User opens Dashboard
  ↓
GET /api/analytics?startDate=X&endDate=Y
  ↓
Aggregate queries to Supabase
  ↓
Return genre distribution & movies per date
  ↓
Render charts with Recharts
\`\`\`

## Key Technologies

### Frontend
- **Next.js 14**: React framework dengan App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Recharts**: Chart library untuk visualisasi
- **Lucide React**: Icon library
- **date-fns**: Date manipulation

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Supabase**: PostgreSQL database dengan REST API
- **TMDB API**: External API untuk data film

### Development
- **ESLint**: Code linting
- **TypeScript**: Static type checking

## Database Schema

### movies table
\`\`\`sql
id              UUID PRIMARY KEY
api_id          INTEGER UNIQUE      -- TMDB movie ID
title           TEXT
release_date    DATE
genre           TEXT
overview        TEXT
poster_path     TEXT
backdrop_path   TEXT
vote_average    DECIMAL(3,1)
vote_count      INTEGER
popularity      DECIMAL(10,3)
original_language TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP           -- Auto-updated via trigger
\`\`\`

### sync_logs table
\`\`\`sql
id                UUID PRIMARY KEY
synced_at         TIMESTAMP
records_fetched   INTEGER
records_created   INTEGER
records_updated   INTEGER
status            TEXT                -- 'success', 'partial', 'failed'
error_message     TEXT
\`\`\`

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/movies | Get all movies (with filters) |
| POST | /api/movies | Create new movie |
| GET | /api/movies/[id] | Get single movie |
| PUT | /api/movies/[id] | Update movie |
| DELETE | /api/movies/[id] | Delete movie |
| POST | /api/sync | Sync from TMDB |
| GET | /api/sync | Get last sync status |
| GET | /api/analytics | Get analytics data |

## Environment Variables

\`\`\`env
NEXT_PUBLIC_TMDB_API_KEY        # TMDB API key
TMDB_API_BASE_URL               # TMDB base URL
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase anon key
\`\`\`

## Features Checklist

- ✅ Konsumsi API publik (TMDB)
- ✅ Penyimpanan data ke database (Supabase)
- ✅ Data memiliki tanggal (release_date)
- ✅ Data memiliki kategori (genre)
- ✅ Menu manajemen data terpisah
- ✅ Fitur Sync dengan tombol
- ✅ Update data & hindari duplikasi (upsert)
- ✅ Tampilkan last sync time
- ✅ CRUD lengkap (Create, Read, Update, Delete)
- ✅ Tabel dengan data
- ✅ Default sorting by updated_at
- ✅ Pencarian (search by title)
- ✅ Filtering (by genre)
- ✅ Sorting setiap kolom
- ✅ Dashboard terpisah
- ✅ Pie Chart (genre distribution)
- ✅ Column Chart (movies per date)
- ✅ Filter tanggal (date range)
- ✅ Summary cards (nilai tambah)
- ✅ Responsive design (nilai tambah)
