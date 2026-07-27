import React from "react";
import { EmptyState } from "@/components/EmptyState";

export const metadata = {
  title: "Browse",
  description: "Discover pre-loved vintage, streetwear, and designer fashion on Closeit.",
};

const CATEGORIES = [
  "All Items",
  "Vintage",
  "Streetwear",
  "Outerwear",
  "Denim",
  "Footwear",
  "Accessories",
  "Knitwear",
  "Dresses",
  "Bags",
];

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"];

export default function BrowsePage(): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Browse Marketplace
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Discover pre-loved vintage, streetwear, and designer fashion
        </p>
      </div>

      {/* ─── Filters Row ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category pills */}
        <div
          role="tablist"
          aria-label="Browse by category"
          className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 flex-1"
        >
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={idx === 0}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                idx === 0
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="shrink-0">
          <label htmlFor="sort-select" className="sr-only">
            Sort listings
          </label>
          <select
            id="sort-select"
            className="h-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Results / Empty State ───────────────────────────── */}
      <EmptyState
        title="No listings yet"
        description="Be the first to list a vintage or pre-loved item. New arrivals will appear here once sellers start listing."
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        action={{
          label: "List Your First Item",
          href: "/sell",
        }}
      />
    </div>
  );
}
