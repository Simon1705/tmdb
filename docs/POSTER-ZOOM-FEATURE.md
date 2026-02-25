# Poster Zoom Feature

## Overview
Fitur ini memungkinkan pengguna untuk melihat poster film dalam ukuran yang lebih besar dengan mengklik poster di tabel data management.

## Komponen yang Ditambahkan

### 1. PosterZoomModal
**File:** `components/data-management/PosterZoomModal.tsx`

Modal yang menampilkan poster dalam ukuran besar dengan fitur:
- Backdrop blur dengan opacity 80%
- Animasi fade-in dan zoom-in saat dibuka
- Tombol close di pojok kanan atas
- Support keyboard (ESC untuk menutup)
- Click outside untuk menutup
- Menampilkan judul film di bawah poster
- Responsive design

### 2. usePosterZoom Hook
**File:** `components/data-management/hooks/usePosterZoom.ts`

Custom hook untuk mengelola state poster zoom modal:
- `isOpen`: Status modal terbuka/tertutup
- `posterData`: Data poster (URL dan title)
- `openPosterZoom(posterUrl, title)`: Fungsi untuk membuka modal
- `closePosterZoom()`: Fungsi untuk menutup modal

## Perubahan pada Komponen Existing

### MovieTable
**File:** `components/data-management/MovieTable.tsx`

Perubahan:
- Menambahkan prop `onPosterClick` untuk handle click event
- Poster sekarang clickable dengan:
  - Cursor pointer
  - Hover effect (ring indigo)
  - Keyboard accessible (Enter/Space)
  - ARIA label untuk accessibility
- Menggunakan poster size `w500` untuk modal (kualitas lebih tinggi)

### Data Management Page
**File:** `app/data-management/page.tsx`

Perubahan:
- Import `usePosterZoom` hook dan `PosterZoomModal` component
- Inisialisasi poster zoom state
- Pass `openPosterZoom` ke `MovieTable`
- Render `PosterZoomModal` di akhir component

## User Experience

1. User melihat poster di tabel dengan hover effect (ring indigo)
2. User klik poster
3. Modal muncul dengan animasi zoom-in dan fade-in
4. Poster ditampilkan dalam ukuran besar (w500 quality)
5. User dapat menutup dengan:
   - Klik tombol X
   - Klik di luar modal
   - Tekan ESC

## Accessibility

- Keyboard navigation support (Enter/Space untuk membuka)
- ARIA labels untuk screen readers
- Focus management
- ESC key untuk menutup modal

## Technical Details

- Menggunakan Next.js Image component untuk optimasi
- Poster quality: w185 untuk thumbnail, w500 untuk zoom
- Animation: Tailwind CSS animate-in utilities
- Body scroll lock saat modal terbuka
- Event cleanup untuk prevent memory leaks
