# Modal Interactivity Fix

## Problem
Director, cast, dan similar movies di MovieModal tidak berfungsi saat diklik - tidak ada aksi yang terjadi.

## Solution
Menambahkan interaktivitas penuh untuk semua elemen yang dapat diklik di modal:

### 1. Person Modal Component
- Dibuat `PersonModal.tsx` baru untuk menampilkan detail person (actor/director)
- Menampilkan biography, birthday, place of birth, dan known for movies
- Dapat diklik untuk membuka movie modal dari known for movies

### 2. Movie Modal Updates
- Menambahkan prop `onMovieClick` untuk handle klik pada similar movies
- Similar movies sekarang dapat diklik dan akan membuka movie modal baru
- Smooth transition saat berpindah dari satu movie ke movie lainnya
- Loading overlay saat fetching data movie baru

### 3. Dashboard Integration
- Mengintegrasikan `usePersonModal` hook yang sudah ada
- Menambahkan `PersonModal` component ke dashboard
- Menghubungkan semua handler:
  - `onPersonClick`: Membuka person modal saat cast/director diklik
  - `onMovieClick`: Membuka movie modal saat similar movie diklik

### 4. Type Updates
- Menambahkan `movies` field ke `PersonDetails` interface
- Menambahkan `onMovieClick` prop ke `MovieModalProps`

### 5. Complete Movie Data Fetching
- Dibuat endpoint `/api/movies/tmdb/[id]` untuk fetch data lengkap dari TMDB
- Update `useMovieModal` hook untuk auto-fetch data lengkap jika movie tidak memiliki backdrop/genre
- Update similar movies API untuk include backdrop_path dan overview
- Memastikan similar movies dan movies dari person modal menampilkan backdrop dan genre dengan benar

### 6. Smooth Modal Transitions
- Menambahkan `switchMovie` function di `useMovieModal` hook
- Similar movies sekarang switch tanpa menutup modal (no flicker)
- Loading overlay muncul saat fetching data movie baru
- Person modal tetap menutup dulu sebelum buka movie modal (berbeda jenis modal)

## Features
- Klik director → Buka person modal dengan detail director
- Klik cast member → Buka person modal dengan detail actor
- Klik similar movie → Switch ke movie baru tanpa menutup modal (smooth)
- Klik movie di person modal → Tutup person modal, buka movie modal
- Loading indicator saat fetching data movie baru
- Smooth animations dan transitions antar modal
- Auto-fetch data lengkap untuk movie yang datanya tidak lengkap

## Files Changed
- `components/dashboard/movies/PersonModal.tsx` (new)
- `components/dashboard/movies/MovieModal.tsx`
- `components/dashboard/movies/index.ts`
- `components/dashboard/types.ts`
- `components/dashboard/hooks/useMovieModal.ts`
- `app/dashboard/page.tsx`
- `app/api/movies/tmdb/[id]/route.ts` (new)
- `app/api/movies/[id]/details/route.ts`

## Testing
1. Buka dashboard dan klik movie card
2. Di movie modal, klik director atau cast member → Person modal terbuka
3. Di movie modal, klik similar movie → Modal tetap terbuka, loading indicator muncul, data movie baru dimuat
4. Di person modal, klik movie → Person modal tutup, movie modal terbuka
5. Verifikasi semua data (backdrop, genre, overview) tampil dengan benar
6. Verifikasi tidak ada flicker saat switch movie dari similar movies


