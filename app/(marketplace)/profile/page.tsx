import React from "react";
import Link from "next/link";
import { auth } from "@/auth";

export const metadata = {
  title: "Profile",
  description: "Your Closeit seller profile.",
};

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
  const user = session?.user;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ─── Profile Banner ──────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        {/* Avatar */}
        <div
          aria-label={`Avatar for ${user?.name ?? "Member"}`}
          className="shrink-0 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20"
        >
          {getInitials(user?.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user?.name ?? "Marketplace Member"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email}
              </p>
            </div>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Edit Profile
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              Verified Member
            </span>
          </div>
        </div>
      </div>

      {/* ─── Closet / Listings ───────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          My Closet
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Your listed items will appear here once you start selling. Build your reputation
          as a trusted seller on Closeit.
        </p>
        <Link
          href="/sell"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          List Item in Closet
        </Link>
      </div>
    </div>
  );
}
