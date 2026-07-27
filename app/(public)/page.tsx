import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = {
  title: "Closeit — Fashion Marketplace",
  description:
    "Buy and sell pre-loved fashion on Closeit. Discover vintage, streetwear, and pre-owned clothing at unbeatable prices.",
};

export default async function LandingPage(): Promise<React.ReactElement> {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-dvh bg-white dark:bg-slate-950 flex flex-col overflow-hidden">
      {/* ─── Top Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                close<span className="text-indigo-600 dark:text-indigo-400">it</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Auth links */}
          <nav className="flex items-center gap-3" aria-label="Authentication navigation">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-sm shadow-indigo-600/20 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-5 py-24 relative">
        {/* Background gradient orbs */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-3xl" />
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-violet-200/30 dark:bg-violet-900/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-pink-200/30 dark:bg-pink-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto space-y-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60 tracking-wide">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
            </span>
            Fashion Thrifting Marketplace
          </span>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Your closet,{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              reimagined.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Buy and sell pre-loved fashion on Closeit — a curated marketplace for vintage
            finds, streetwear, and premium secondhand clothing.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              id="hero-register-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start Selling Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              id="hero-login-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-base transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Browse Marketplace
            </Link>
          </div>

          {/* Social proof row */}
          <p className="text-xs text-slate-400 dark:text-slate-500 tracking-wide pt-2">
            Free to join · No listing fees · Secure payments
          </p>
        </div>
      </section>

      {/* ─── Feature pillars ─────────────────────────────────── */}
      <section className="relative border-t border-slate-100 dark:border-slate-800/60 py-16 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              ),
              title: "List in Minutes",
              body: "Snap a photo, set a price, and your item is live. No fees to list.",
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ),
              title: "Curated Closets",
              body: "Discover hand-picked vintage, designer, and streetwear at honest prices.",
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "Buyer Protection",
              body: "Shop with confidence. Every purchase is covered by our buyer guarantee.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60"
            >
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {feature.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 dark:border-slate-800/60 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <span>© {new Date().getFullYear()} Closeit. All rights reserved.</span>
          <span>AI-powered fashion thrifting marketplace</span>
        </div>
      </footer>
    </main>
  );
}
