import React from "react";
import { auth } from "@/auth";
import { StatCard } from "@/components/StatCard";
import { QuickActions, type ActionItem } from "@/components/QuickActions";
import { ActivityFeed } from "@/components/ActivityFeed";
import { EmptyState } from "@/components/EmptyState";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "Dashboard",
  description: "Your Closeit marketplace dashboard.",
};

export default async function DashboardPage(): Promise<React.ReactElement> {
  const session = await auth();
  const firstName = session?.user?.name
    ? session.user.name.trim().split(" ")[0]
    : "Member";

  const quickActionsList: ActionItem[] = [
    {
      label: "Sell Item",
      href: "/sell",
      primary: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      label: "Browse Marketplace",
      href: "/browse",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      label: "My Wishlist",
      href: "/wishlist",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      label: "Manage Orders",
      href: "/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* ─── Welcome Hero ────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-900/20">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/10 text-indigo-200 uppercase tracking-wider mb-3">
            Closeit Marketplace
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Your personal fashion marketplace. List items, track orders, and discover
            pre-loved fashion — all in one place.
          </p>
        </div>
        <div
          aria-hidden="true"
          className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-violet-600/20 to-transparent pointer-events-none"
        />
      </div>

      {/* ─── Statistics ──────────────────────────────────────── */}
      <section aria-labelledby="stats-heading" className="space-y-4">
        <h2 id="stats-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Marketplace Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Listings"
            value={0}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
            description="Items currently for sale"
          />
          <StatCard
            title="Items Sold"
            value={0}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            description="Completed sales history"
          />
          <StatCard
            title="Wishlist Items"
            value={0}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
            description="Saved fashion items"
          />
          <StatCard
            title="Pending Orders"
            value={0}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            }
            description="Orders awaiting fulfillment"
          />
        </div>
      </section>

      {/* ─── Quick Actions ───────────────────────────────────── */}
      <section aria-labelledby="actions-heading" className="space-y-4">
        <h2 id="actions-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h2>
        <QuickActions actions={quickActionsList} />
      </section>

      {/* ─── Two-column: Activity + Recommendations ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader title="Recent Activity" />
          <ActivityFeed activities={[]} />
        </div>

        {/* Recommended — empty state until feature is built */}
        <div className="space-y-4">
          <SectionHeader
            title="Recommended For You"
            action={{ label: "Browse All", href: "/browse" }}
          />
          <EmptyState
            title="No recommendations yet"
            description="Browse the marketplace and save items to your wishlist. Personalised picks will appear here."
            action={{ label: "Explore Marketplace", href: "/browse" }}
          />
        </div>
      </div>
    </div>
  );
}
