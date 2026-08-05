import Image from "next/image";
import React from "react";
import { ListingDTO } from "@/schemas/listing";

export interface ListingCardProps {
  listing: ListingDTO;
}

export function ListingCard({ listing }: ListingCardProps): React.ReactElement {
  const coverImage =
    listing.images && listing.images.length > 0
      ? listing.images[0].imageUrl
      : "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800";

  const formattedDate = new Date(listing.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    DRAFT: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    RESERVED: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    SOLD: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    ARCHIVED: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {/* Cover Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Image
          src={coverImage}
          alt={listing.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, 33vw"
        />

        {/* Status Badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-xs backdrop-blur-xs ${
            statusStyles[listing.status] || statusStyles.ACTIVE
          }`}
        >
          {listing.status}
        </span>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-900/85 dark:bg-slate-950/90 text-white font-bold text-sm backdrop-blur-xs shadow-xs">
          ₹{listing.price.toLocaleString("en-IN")}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand & Category line */}
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          {listing.brand?.name && <span>{listing.brand.name}</span>}
          {listing.brand?.name && listing.category?.name && <span>•</span>}
          {listing.category?.name && <span>{listing.category.name}</span>}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {listing.title}
        </h3>

        {/* Fashion Specs (Size/Color/Condition) */}
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          {listing.condition && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900/60 font-medium">
              {listing.condition.replace(/_/g, " ")}
            </span>
          )}
          {listing.size && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900/60 font-medium">
              Size: {listing.size}
            </span>
          )}
          {listing.color && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900/60 font-medium">
              {listing.color}
            </span>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>Listed {formattedDate}</span>
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {listing.images.length} {listing.images.length === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>
    </div>
  );
}
