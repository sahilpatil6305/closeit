import React from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";

export const metadata = {
  title: "My Listings",
  description: "Manage your active listings on Closeit.",
};

const CATEGORIES = ["All Items", "Vintage", "Streetwear", "Outerwear", "Denim", "Footwear"];

export default function ListingsPage(): React.ReactElement {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Listings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your active closet items and track listing performance
          </p>
        </div>
        <Link
          href="/sell"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>List an Item</span>
        </Link>
      </div>

      {/* Category Filter Pills */}
      <div
        role="tablist"
        aria-label="Filter by category"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        {CATEGORIES.map((cat, idx) => (
          <button
            key={cat}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              idx === 0
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                : "bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Container / Empty State */}
      <EmptyState
        title="No listings yet"
        description="Start selling pre-loved fashion from your closet. Create your first listing to get started."
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        }
        action={{
          label: "Create First Listing",
          href: "/sell",
        }}
      />
    </div>
  );
}
