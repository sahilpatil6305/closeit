import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { getProfileById } from "@/lib/profile/service";

export const metadata = {
  title: "Settings",
  description: "Manage your Closeit account preferences and security settings.",
};

export default async function SettingsPage(): Promise<React.ReactElement> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    notFound();
  }

  const profile = await getProfileById(userId);
  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your profile details and seller identity on Closeit.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700/60">
          Profile Settings
        </h2>
        <div className="mt-6">
          <ProfileSettingsForm initialValues={profile} />
        </div>
      </div>
    </div>
  );
}
