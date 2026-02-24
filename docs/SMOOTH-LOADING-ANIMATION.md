# Smooth Loading Animation

## Problem
Loading overlay saat switch movie dari similar movies terlihat kaku - langsung hilang tanpa animasi smooth. Juga terjadi flicker saat loading selesai karena re-mount component.

## Solution
Menambahkan animasi fade-out untuk loading overlay dan fade-in untuk konten baru tanpa re-mount component:

### 1. Loading Fade-Out Animation
- Menambahkan state `isLoadingFadingOut` di `useMovieModal` hook
- Loading overlay fade-out dengan `transition-opacity duration-300` sebelum hilang
- Delay 300ms sebelum benar-benar menghilangkan loading state

### 2. Content Fade-In Animation (No Re-mount)
- Wrap konten dengan div yang memiliki `transition-opacity duration-500`
- Konten menjadi opacity-30 saat loading (redup)
- Konten fade-in ke opacity-100 saat loading selesai
- Tidak menggunakan `key` prop untuk menghindari re-mount dan flicker

### 3. Smooth Transition Flow
1. User klik similar movie
2. Loading overlay muncul instantly
3. Konten existing menjadi redup (opacity-30)
4. Data movie baru di-fetch
5. Loading overlay fade-out (300ms)
6. Konten baru fade-in ke opacity-100 (500ms)
7. Smooth transition tanpa flicker atau re-mount

## Technical Details

### Hook Changes
```typescript
const [isLoadingFadingOut, setIsLoadingFadingOut] = useState(false);

// In fetchMovieDetails finally block:
setIsLoadingFadingOut(true);
setTimeout(() => {
  setLoadingDetails(false);
  setIsLoadingFadingOut(false);
}, 300);
```

### Modal Changes
```tsx
// Loading overlay with fade-out
<div className={`... transition-opacity duration-300 ${
  isLoadingFadingOut ? 'opacity-0' : 'opacity-100'
}`}>

// Content wrapper with fade-in (no key prop to avoid re-mount)
<div className={`transition-opacity duration-500 ease-out ${
  isLoading && !isLoadingFadingOut ? 'opacity-30' : 'opacity-100'
}`}>
  {/* All content here */}
</div>
```

## Key Points
- **No `key` prop**: Menghindari re-mount yang menyebabkan flicker
- **Opacity transition**: Smooth fade tanpa scale/translate animation
- **Timing coordination**: Loading fade-out (300ms) + content fade-in (500ms)
- **Visual continuity**: Konten tetap visible (redup) saat loading

## Files Changed
- `components/dashboard/hooks/useMovieModal.ts`
- `components/dashboard/movies/MovieModal.tsx`
- `app/dashboard/page.tsx`

## Result
- Smooth fade-out untuk loading overlay
- Smooth fade-in untuk konten baru
- No flicker atau re-mount animation
- Professional transition experience
- Visual continuity maintained

