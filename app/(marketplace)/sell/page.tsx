import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Sell Item",
  description: "List a pre-loved fashion item for sale on Closeit marketplace.",
};

const STEPS: { step: number; title: string; description: string }[] = [
  {
    step: 1,
    title: "Add Photos",
    description: "Upload clear photos of your item from multiple angles. Good photos sell faster.",
  },
  {
    step: 2,
    title: "Describe Your Item",
    description: "Add a title, condition, size, brand, and a short description.",
  },
  {
    step: 3,
    title: "Set Your Price",
    description: "Pick a fair price. Research similar items to stay competitive.",
  },
  {
    step: 4,
    title: "Publish & Get Paid",
    description: "Go live instantly. When it sells, payment lands directly in your account.",
  },
];

export default function SellPage(): React.ReactElement {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sell an Item
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          List your pre-loved fashion in minutes. Free to list, no hidden fees.
        </p>
      </div>

      {/* ─── Coming Soon Card ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-100 dark:border-indigo-900/40 p-8">
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-indigo-100 dark:border-indigo-900/40">
            <svg
              className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Listing is coming soon
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              We&apos;re building the listing experience. You&apos;ll be able to photograph, describe,
              and price your items right here. Stay tuned.
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Browse Marketplace
          </Link>
        </div>
        {/* Decorative orb */}
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 w-64 h-64 bg-violet-200/50 dark:bg-violet-900/20 rounded-full blur-3xl pointer-events-none"
        />
      </div>

      {/* ─── How it works ─────────────────────────────────────── */}
      <section className="space-y-4" aria-labelledby="how-it-works-heading">
        <h2
          id="how-it-works-heading"
          className="text-base font-bold text-slate-900 dark:text-white"
        >
          How listing works
        </h2>

        <ol className="space-y-3" aria-label="Listing steps">
          {STEPS.map(({ step, title, description }) => (
            <li
              key={step}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
            >
              <span
                aria-hidden="true"
                className="shrink-0 w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center justify-center"
              >
                {step}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
