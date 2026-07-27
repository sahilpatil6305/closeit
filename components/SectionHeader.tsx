import React from "react";
import Link from "next/link";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps): React.ReactElement {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-1"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
