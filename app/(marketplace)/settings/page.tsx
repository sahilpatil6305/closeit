import React from "react";
import { auth } from "@/auth";

export const metadata = {
  title: "Settings",
  description: "Manage your Closeit account preferences and security settings.",
};

export default async function SettingsPage(): Promise<React.ReactElement> {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account preferences, shipping address, and security
        </p>
      </div>

      {/* ─── Account Info ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700/60">
          Account Information
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="settings-name"
              className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5"
            >
              Full Name
            </label>
            <input
              id="settings-name"
              type="text"
              readOnly
              defaultValue={user?.name ?? ""}
              aria-readonly="true"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="settings-email"
              className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5"
            >
              Email Address
            </label>
            <input
              id="settings-email"
              type="email"
              readOnly
              defaultValue={user?.email ?? ""}
              aria-readonly="true"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Profile editing is not yet available. Check back soon.
          </p>
        </div>
      </div>

      {/* ─── Security ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700/60">
          Security
        </h2>
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Password</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Last changed: Never
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
}
