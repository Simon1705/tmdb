# Deployment Guide - Vercel

## Prerequisites
- Git repository (GitHub, GitLab, atau Bitbucket)
- Akun Vercel (gratis di https://vercel.com)
- Supabase database sudah setup
- TMDB API key

## Environment Variables yang Dibutuhkan

Sebelum deploy, siapkan environment variables berikut:

```env
# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_BASE_URL=https://api.themoviedb.org/3

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Langkah-langkah Deploy

### 1. Push ke Git Repository

Jika belum ada repository:

```bash
cd movie-dashboard
git init
git add .
git commit -m "Initial commit - Movie Dashboard"
```

Buat repository baru di GitHub, lalu:

```bash
git remote add origin https://github.com/username/movie-dashboard.git
git branch -M main
git push -u origin main
```

### 2. Deploy ke Vercel

#### Opsi A: Via Vercel Dashboard (Recommended)

1. Buka https://vercel.com dan login
2. Klik "Add New Project"
3. Import repository GitHub Anda
4. Vercel akan otomatis detect Next.js project
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (atau `movie-dashboard` jika di subfolder)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

6. Tambahkan Environment Variables:
   - Klik "Environment Variables"
   - Tambahkan semua variables dari `.env.local`
   - Pastikan pilih environment: Production, Preview, Development

7. Klik "Deploy"

#### Opsi B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd movie-dashboard
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (pilih account Anda)
# - Link to existing project? No
# - Project name? movie-dashboard
# - Directory? ./
# - Override settings? No

# Setelah deploy pertama, tambahkan environment variables:
vercel env add NEXT_PUBLIC_TMDB_API_KEY
vercel env add TMDB_API_KEY
vercel env add TMDB_API_BASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy production
vercel --prod
```

### 3. Verifikasi Deployment

Setelah deploy selesai:

1. Buka URL yang diberikan Vercel (contoh: `movie-dashboard.vercel.app`)
2. Test fitur-fitur:
   - ✅ Homepage loading
   - ✅ Dashboard dengan charts
   - ✅ Data Management CRUD
   - ✅ Sync dari TMDB
   - ✅ Filter dan search

### 4. Setup Custom Domain (Opsional)

1. Di Vercel Dashboard, buka project Anda
2. Klik tab "Settings" → "Domains"
3. Tambahkan domain custom Anda
4. Update DNS records sesuai instruksi Vercel

## Troubleshooting

### Build Error

Jika ada error saat build:

```bash
# Test build locally
npm run build

# Fix errors, commit, dan push lagi
git add .
git commit -m "Fix build errors"
git push
```

### Environment Variables Tidak Terbaca

- Pastikan variables dengan prefix `NEXT_PUBLIC_` untuk client-side
- Restart deployment setelah menambah env vars
- Check di Vercel Dashboard → Settings → Environment Variables

### Database Connection Error

- Verifikasi Supabase URL dan key benar
- Check Supabase dashboard untuk connection limits
- Pastikan RLS (Row Level Security) policies sudah benar

### TMDB API Error

- Verifikasi API key masih valid
- Check quota limit di TMDB dashboard
- Pastikan `NEXT_PUBLIC_TMDB_API_KEY` tersedia

## Continuous Deployment

Setelah setup awal, setiap push ke branch `main` akan otomatis trigger deployment baru:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel akan otomatis deploy
```

## Monitoring

- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Deployments → View Function Logs
- **Performance**: Vercel Dashboard → Speed Insights

## Rollback

Jika ada masalah dengan deployment terbaru:

1. Buka Vercel Dashboard → Deployments
2. Pilih deployment sebelumnya yang stabil
3. Klik "Promote to Production"

## Best Practices

1. ✅ Test locally sebelum push: `npm run build && npm start`
2. ✅ Gunakan Preview Deployments untuk testing (auto-created untuk PR)
3. ✅ Monitor error logs di Vercel Dashboard
4. ✅ Setup alerts untuk downtime
5. ✅ Backup database Supabase secara berkala

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
