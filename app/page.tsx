'use client';

import Image from 'next/image';
import { BarChart3, Database, Sparkles, ArrowRight, Play } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.07),_transparent_35%)]" />
      </div>

      <div className="relative flex min-h-screen items-center">
        <div className="container mx-auto px-6 py-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6 text-left">

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight">
                  Movie Dashboard.
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <TransitionLink
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Open Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </TransitionLink>

                <TransitionLink
                  href="/data-management"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                >
                  <Database className="h-5 w-5" />
                  <span>Data Workspace</span>
                </TransitionLink>

                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-indigo-50/90 transition hover:-translate-y-0.5 hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                >
                  <Play className="h-4 w-4" />
                  <span>Live TMDB feed</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-indigo-100/80">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium backdrop-blur">
                  <span>Powered by </span>
                  <Image src="/tmdb.svg" alt="TMDB" width={64} height={18} className="h-4 w-auto" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TransitionLink
                href="/dashboard"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200/30 hover:bg-indigo-500/10"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-400/20 blur-3xl" />
                <div className="relative space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-100">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </div>
                  <h2 className="text-xl font-semibold">Dashboard</h2>
                  <p className="text-sm text-indigo-100/80">
                    See trending titles, ratings, and release curves with a single tap.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-100 group-hover:text-white">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </TransitionLink>

              <TransitionLink
                href="/data-management"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-emerald-200/30 hover:bg-emerald-500/10"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="relative space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                    <Database className="h-4 w-4" />
                    <span>Operations</span>
                  </div>
                  <h2 className="text-xl font-semibold">Data Management</h2>
                  <p className="text-sm text-indigo-100/80">
                    Edit, search, and keep your catalog clean with guardrails.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-100 group-hover:text-white">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
