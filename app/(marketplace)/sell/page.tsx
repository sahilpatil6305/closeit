import React from "react";
import { SellItemForm } from "@/components/listing/SellItemForm";

export const metadata = {
  title: "Sell Item",
  description: "List a pre-loved fashion item for sale on Closeit marketplace.",
};

export default function SellPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sell an Item
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          List your pre-loved fashion in minutes. Fill out the details below to publish to the marketplace.
        </p>
      </div>

      {/* Interactive Listing Form */}
      <SellItemForm />
    </div>
  );
}
