import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/listing/ListingCard";
import { getPublicSellerProfile } from "@/lib/profile/service";

export const metadata = {
  title: "Seller Profile",
  description: "View a seller's public profile and active listings.",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<React.ReactElement> {
  const { username } = await params;
  const profile = await getPublicSellerProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-950 h-28 w-28 overflow-hidden">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.displayName ?? profile.username ?? "Seller avatar"}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">
                {profile.username?.slice(0, 2).toUpperCase() ?? "U"}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white truncate">
                {profile.displayName ?? profile.username}
              </h1>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                @{profile.username}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {profile.bio ?? "This seller has not added a bio yet."}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Member since
            </p>
            <p className="mt-2 text-sm text-slate-900 dark:text-white">
              {formatDate(profile.createdAt)}
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Active listings
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {profile.activeListingsCount}
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Sold items
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {profile.soldItemsCount}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Active Listings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Browse this seller’s current marketplace items.
            </p>
          </div>
        </div>

        {profile.listings.length === 0 ? (
          <EmptyState
            title="No active listings"
            description="This seller has no active items on Closeit right now."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profile.listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
