import React from "react";
import Link from "next/link";

export interface ActionItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  primary?: boolean;
}

export interface QuickActionsProps {
  actions: ActionItem[];
}

export function QuickActions({ actions }: QuickActionsProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {actions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
            action.primary
              ? "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white border-transparent shadow-md shadow-indigo-600/20"
              : "bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 shadow-sm"
          }`}
        >
          <div
            className={`p-2.5 rounded-xl ${
              action.primary
                ? "bg-white/20 text-white"
                : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {action.icon}
          </div>
          <span className="font-semibold text-sm">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
