import React from "react";
import { EmptyState } from "@/components/EmptyState";

export interface ActivityItem {
  id: string;
  type: "listing" | "order" | "like" | "system";
  title: string;
  timestamp: string;
  description?: string;
}

export interface ActivityFeedProps {
  activities?: ActivityItem[];
}

export function ActivityFeed({
  activities = [],
}: ActivityFeedProps): React.ReactElement {
  if (activities.length === 0) {
    return (
      <EmptyState
        title="No recent activity"
        description="Your recent sales, purchases, and marketplace activity will appear here."
      />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 divide-y divide-slate-100 dark:divide-slate-700/60">
      {activities.map((item) => (
        <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {item.title}
            </p>
            {item.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {item.description}
              </p>
            )}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
            {item.timestamp}
          </span>
        </div>
      ))}
    </div>
  );
}
