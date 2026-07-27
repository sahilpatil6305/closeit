import React from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  description,
}: StatCardProps): React.ReactElement {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              trend.isPositive
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
