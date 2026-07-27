import React from "react";
import Link from "next/link";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
      {icon ? (
        <div className="p-3.5 mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      ) : (
        <div className="p-3.5 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
