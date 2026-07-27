import React from "react";
import { EmptyState } from "@/components/EmptyState";

export const metadata = {
  title: "Wishlist",
  description: "Your saved fashion items on Closeit.",
};

export default function WishlistPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Saved Wishlist
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Saved fashion items, vintage finds, and price drop alerts
        </p>
      </div>

      <EmptyState
        title="Your wishlist is empty"
        description="Explore the marketplace and tap the heart icon on any item to save it to your personal wishlist."
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        }
        action={{
          label: "Explore Vintage Fashion",
          href: "/browse",
        }}
      />
    </div>
  );
}
