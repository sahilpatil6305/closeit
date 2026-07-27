import React from "react";
import { EmptyState } from "@/components/EmptyState";

export const metadata = {
  title: "Orders",
  description: "Track your purchases and manage sales on Closeit.",
};

export default function OrdersPage(): React.ReactElement {
  const tabs = ["All Orders", "Purchases", "Sales", "In Transit", "Completed"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Orders & Transactions
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track your purchases, manage sales fulfillment, and view order history
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            type="button"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              idx === 0
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <EmptyState
        title="No orders yet"
        description="When you buy or sell items on Closeit, your order details and shipping updates will appear here."
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        }
        action={{
          label: "Browse Marketplace",
          href: "/browse",
        }}
      />
    </div>
  );
}
