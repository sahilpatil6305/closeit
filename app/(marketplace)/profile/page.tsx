import Image from "next/image";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard } from "@/components/listing/ListingCard";
import { getProfileOverview } from "@/lib/profile/service";

export const metadata = {
  title: "Profile",
  description: "Your Closeit seller profile.",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function ProfilePage(): Promise<React.ReactElement> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    notFound();
  }

  const profile = await getProfileOverview(userId);
  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-950 h-28 w-28 overflow-hidden">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.displayName ?? profile.username ?? profile.email}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">
                  {getInitials(profile.displayName ?? profile.email)}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white truncate">
                  {profile.displayName ?? profile.username ?? profile.email}
                </h1>
                {profile.username ? (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    @{profile.username}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {profile.bio ?? "No bio yet. Share a little about your style and what you sell."}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Email
              </p>
              <p className="mt-2 text-sm text-slate-900 dark:text-white break-all">
                {profile.email}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Phone
              </p>
              <p className="mt-2 text-sm text-slate-900 dark:text-white">
                {profile.phone ?? "Not provided"}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Location
              </p>
              <p className="mt-2 text-sm text-slate-900 dark:text-white">
                {profile.city ?? ""}{profile.city && profile.country ? ", " : ""}{profile.country ?? "Not provided"}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Joined
              </p>
              <p className="mt-2 text-sm text-slate-900 dark:text-white">
                {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/settings"
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Edit profile
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Marketplace Summary
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Purchased items
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {profile.purchasedItemsCount}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Wishlist count
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {profile.wishlistCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent listings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your latest items on Closeit.
            </p>
          </div>
          <Link
            href="/listings"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            View all listings
          </Link>
        </div>

        {profile.recentListings.length === 0 ? (
          <EmptyState
            title="No recent listings"
            description="Add your first item to start building your marketplace profile."
            action={{ label: "List an item", href: "/sell" }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profile.recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
