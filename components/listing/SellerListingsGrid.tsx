"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ListingDTO } from "@/schemas/listing";
import { ListingCard } from "@/components/listing/ListingCard";
import { EmptyState } from "@/components/EmptyState";

export interface SellerListingsGridProps {
  initialListings: ListingDTO[];
  showSuccessBanner?: boolean;
}

export function SellerListingsGrid({
  initialListings,
  showSuccessBanner = false,
}: SellerListingsGridProps): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");
  const [dismissedBanner, setDismissedBanner] = useState<boolean>(!showSuccessBanner);

  // Extract unique category names for filter pills
  const categories = [
    "All Items",
    ...Array.from(
      new Set(
        initialListings
          .map((item) => item.category?.name)
          .filter((name): name is string => Boolean(name))
      )
    ),
  ];

  const filteredListings =
    selectedCategory === "All Items"
      ? initialListings
      : initialListings.filter((item) => item.category?.name === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {!dismissedBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-emerald-500 text-white shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Item Listed Successfully!</p>
              <p className="text-xs opacity-90">Your pre-loved item is now live in your closet and ready for buyers.</p>
            </div>
          </div>
          <button
            onClick={() => setDismissedBanner(true)}
            className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-colors"
            aria-label="Dismiss banner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Listings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your active closet items ({initialListings.length} {initialListings.length === 1 ? "item" : "items"})
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

      {/* Category Filter Pills (if listings exist) */}
      {initialListings.length > 0 && categories.length > 1 && (
        <div
          role="tablist"
          aria-label="Filter listings by category"
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                  : "bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid or Empty State */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={selectedCategory === "All Items" ? "No listings yet" : `No items in ${selectedCategory}`}
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
      )}
    </div>
  );
}
