"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  listingId: string;
}

export function BuyNowButton({ listingId }: BuyNowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleBuyNow = () => {
    startTransition(async () => {
      setErrorMessage(null);

      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }

          const body = await response.json().catch(() => null);
          setErrorMessage(
            body?.error ?? "Unable to place order. Please try again."
          );
          return;
        }

        router.push("/orders");
      } catch (error) {
        console.error("Buy Now request failed:", error);
        setErrorMessage("Unable to place order. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={handleBuyNow}
        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Placing order..." : "Buy Now"}
      </button>
      {errorMessage ? (
        <p className="text-sm text-rose-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
