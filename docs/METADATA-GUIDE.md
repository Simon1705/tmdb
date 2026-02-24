# Metadata Configuration Guide

## Current Metadata Setup

Metadata aplikasi sudah dikonfigurasi di `app/layout.tsx` dengan informasi berikut:

### Global Metadata

```typescript
{
  title: {
    default: "Movie Dashboard - TMDB Analytics",
    template: "%s | Movie Dashboard"
  },
  description: "Comprehensive movie analytics dashboard powered by TMDB API",
  keywords: ["movie", "dashboard", "TMDB", "analytics", "movies", "film"],
  // ... dan lainnya
}
```

## Cara Mengubah Metadata

### 1. Ubah Title & Description Utama

Edit file `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: "Judul Aplikasi Anda",
    template: "%s | Nama Brand Anda"
  },
  description: "Deskripsi aplikasi Anda",
  // ...
}
```

### 2. Ubah Author & Creator

```typescript
authors: [{ name: "Nama Anda" }],
creator: "Nama Anda atau Perusahaan",
```

### 3. Ubah URL Domain

Setelah deploy ke Vercel, update URL:

```typescript
openGraph: {
  url: "https://your-actual-domain.vercel.app",
  // ...
},
```

### 4. Tambah Metadata Per Halaman

Untuk halaman yang tidak menggunakan 'use client', tambahkan metadata:

**Contoh: `app/about/page.tsx`**

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our movie dashboard',
};

export default function AboutPage() {
  return <div>About content</div>;
}
```

### 5. Dynamic Metadata

Untuk metadata dinamis (misalnya detail movie):

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const movie = await fetchMovie(params.id);
  
  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      images: [movie.poster_path],
    },
  };
}
```

## Metadata untuk SEO

### Keywords yang Disarankan

Sesuaikan dengan target audience:

```typescript
keywords: [
  "movie dashboard",
  "film analytics", 
  "TMDB",
  "movie database",
  "film statistics",
  "movie tracker",
  "cinema analytics"
]
```

### Open Graph (Social Media)

Untuk tampilan bagus saat di-share di social media:

```typescript
openGraph: {
  type: "website",
  locale: "en_US", // atau "id_ID" untuk Indonesia
  url: "https://your-domain.com",
  title: "Movie Dashboard",
  description: "Your description",
  siteName: "Movie Dashboard",
  images: [{
    url: "https://your-domain.com/og-image.png",
    width: 1200,
    height: 630,
    alt: "Movie Dashboard Preview",
  }],
}
```

### Twitter Card

```typescript
twitter: {
  card: "summary_large_image",
  title: "Movie Dashboard",
  description: "Your description",
  images: ["https://your-domain.com/twitter-image.png"],
  creator: "@your_twitter_handle",
}
```

## Favicon

Untuk mengubah favicon, replace file:
- `app/favicon.ico` - Icon utama
- `app/icon.png` - PNG icon (optional)
- `app/apple-icon.png` - Apple touch icon (optional)

Atau generate favicon di: https://favicon.io

## Robots & Indexing

Untuk mengontrol search engine indexing:

```typescript
robots: {
  index: true,  // false jika tidak ingin diindex
  follow: true, // false jika tidak ingin link difollow
  googleBot: {
    index: true,
    follow: true,
  },
}
```

## Verification Tags

Untuk Google Search Console, Bing, dll:

```typescript
verification: {
  google: "your-google-verification-code",
  yandex: "your-yandex-verification-code",
  bing: "your-bing-verification-code",
}
```

## Manifest (PWA)

Untuk Progressive Web App, buat `app/manifest.json`:

```json
{
  "name": "Movie Dashboard",
  "short_name": "Movies",
  "description": "Movie analytics dashboard",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Testing Metadata

### Tools untuk Test:

1. **Open Graph**: https://www.opengraph.xyz/
2. **Twitter Card**: https://cards-dev.twitter.com/validator
3. **Google Rich Results**: https://search.google.com/test/rich-results
4. **Meta Tags**: https://metatags.io/

### Local Testing:

```bash
# Build dan jalankan production
npm run build
npm start

# Check metadata di browser:
# View Page Source → lihat <head> section
```

## Best Practices

1. ✅ Title maksimal 60 karakter
2. ✅ Description 150-160 karakter
3. ✅ Gunakan keywords yang relevan
4. ✅ Update URL setelah deploy
5. ✅ Tambahkan Open Graph images (1200x630px)
6. ✅ Test di berbagai platform social media
7. ✅ Gunakan HTTPS untuk semua URLs
8. ✅ Compress images untuk performa

## Contoh Lengkap

```typescript
export const metadata: Metadata = {
  title: {
    default: "Movie Dashboard - Analytics & Insights",
    template: "%s | Movie Dashboard"
  },
  description: "Track and analyze your movie collection with powerful analytics, charts, and insights powered by TMDB API",
  keywords: ["movie", "dashboard", "analytics", "TMDB", "film", "statistics"],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  creator: "Your Company",
  publisher: "Your Company",
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://movie-dashboard.vercel.app",
    title: "Movie Dashboard - Analytics & Insights",
    description: "Track and analyze your movie collection",
    siteName: "Movie Dashboard",
    images: [{
      url: "https://movie-dashboard.vercel.app/og-image.png",
      width: 1200,
      height: 630,
      alt: "Movie Dashboard Preview",
    }],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Movie Dashboard",
    description: "Track and analyze your movie collection",
    images: ["https://movie-dashboard.vercel.app/twitter-image.png"],
    creator: "@yourusername",
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  
  manifest: "/manifest.json",
};
```

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)
