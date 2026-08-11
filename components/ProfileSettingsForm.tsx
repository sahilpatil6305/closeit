"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProfileSummaryDTO, ProfileUpdateFormInput } from "@/schemas/profile";
import { profileUpdateSchema } from "@/schemas/profile";

interface ProfileSettingsFormProps {
  initialValues: ProfileSummaryDTO;
}

export function ProfileSettingsForm({ initialValues }: ProfileSettingsFormProps) {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateFormInput>({
    resolver: zodResolver(profileUpdateSchema) as Resolver<ProfileUpdateFormInput>,
    defaultValues: {
      avatar: initialValues.avatar ?? "",
      username: initialValues.username ?? "",
      displayName: initialValues.displayName ?? "",
      bio: initialValues.bio ?? "",
      phone: initialValues.phone ?? "",
      city: initialValues.city ?? "",
      country: initialValues.country ?? "",
    },
  });

  const onSubmit = (data: ProfileUpdateFormInput) => {
    startTransition(async () => {
      setStatusMessage(null);

      try {
        const response = await fetch("/api/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setStatusMessage(payload?.error ?? "Unable to update profile. Please try again.");
          return;
        }

        setStatusMessage("Profile updated successfully.");
        router.refresh();
      } catch (error) {
        console.error("Profile update failed:", error);
        setStatusMessage("Unable to update profile. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Avatar URL</span>
          <input
            type="url"
            {...register("avatar")}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.avatar ? (
            <p className="mt-1 text-xs text-rose-600">{errors.avatar.message}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Username</span>
          <input
            type="text"
            {...register("username")}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.username ? (
            <p className="mt-1 text-xs text-rose-600">{errors.username.message}</p>
          ) : null}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Display Name</span>
          <input
            type="text"
            {...register("displayName")}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.displayName ? (
            <p className="mt-1 text-xs text-rose-600">{errors.displayName.message}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Phone</span>
          <input
            type="tel"
            {...register("phone")}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.phone ? (
            <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>
          ) : null}
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Bio</span>
        <textarea
          rows={4}
          {...register("bio")}
          className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        {errors.bio ? (
          <p className="mt-1 text-xs text-rose-600">{errors.bio.message}</p>
        ) : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">City</span>
          <input
            type="text"
            {...register("city")}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.city ? (
            <p className="mt-1 text-xs text-rose-600">{errors.city.message}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Country</span>
          <input
            type="text"
            {...register("country")}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.country ? (
            <p className="mt-1 text-xs text-rose-600">{errors.country.message}</p>
          ) : null}
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        {statusMessage ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{statusMessage}</p>
        ) : null}
      </div>
    </form>
  );
}
