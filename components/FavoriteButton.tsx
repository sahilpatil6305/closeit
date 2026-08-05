"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface FavoriteButtonProps {
  listingId: string;
  initialIsFavorite?: boolean;
  size?: "sm" | "md";
}

export function FavoriteButton({
  listingId,
  initialIsFavorite = false,
  size = "md",
}: FavoriteButtonProps): React.ReactElement {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const buttonClasses = clsx(
    "inline-flex items-center justify-center rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    size === "sm" ? "h-9 w-9 p-0" : "px-3 py-2 text-sm",
    isFavorited
      ? "bg-rose-600 border-rose-600 text-white shadow-sm hover:bg-rose-700"
      : "bg-white dark:bg-slate-900 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
  );

  const handleToggleFavorite = () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/favorites/${listingId}`, {
          method: isFavorited ? "DELETE" : "POST",
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Unable to update wishlist.");
        }

        setIsFavorited((current) => !current);
        router.refresh();
      } catch (error) {
        console.error("Favorite toggle failed:", error);
      }
    });
  };

  return (
    <button
      type="button"
      aria-pressed={isFavorited}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleToggleFavorite();
      }}
      className={buttonClasses}
      title={isFavorited ? "Remove from wishlist" : "Save to wishlist"}
      disabled={isPending}
    >
      {isPending ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <span className="text-base leading-none">{isFavorited ? "♥" : "♡"}</span>
      )}
    </button>
  );
}
