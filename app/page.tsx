import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/LogoutButton";

export default async function HomePage(): Promise<React.ReactElement> {
  const session = await auth();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          CloseIt Authentication
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Next.js 16 + Auth.js v5 + Prisma 7 + PostgreSQL
        </p>

        {session?.user ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 text-left">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">
                Authenticated Session
              </div>
              <div className="text-base font-semibold text-slate-800 dark:text-slate-200">
                {session.user.name || "User"}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {session.user.email}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You are currently unauthenticated.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium text-sm transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
