import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Movie Dashboard - TMDB Analytics",
    template: "%s | Movie Dashboard"
  },
  description: "Comprehensive movie analytics dashboard powered by TMDB API. Track, analyze, and manage your movie collection with advanced filtering, charts, and insights.",
  keywords: ["movie", "dashboard", "TMDB", "analytics", "movies", "film", "database", "statistics"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tmdb-three-rosy.vercel.app",
    title: "Movie Dashboard - TMDB Analytics",
    description: "Comprehensive movie analytics dashboard powered by TMDB API",
    siteName: "Movie Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Dashboard - TMDB Analytics",
    description: "Comprehensive movie analytics dashboard powered by TMDB API",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
