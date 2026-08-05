import Image from "next/image";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { FavoriteButton } from "@/components/FavoriteButton";
import {
  getListingById,
  getListingFavoriteStatus,
  getRelatedListings,
} from "@/lib/listing/service";

export const metadata = {
  title: "Listing Details | Closeit",
  description: "View item details, seller information, and related marketplace listings.",
};

const conditionLabels: Record<string, string> = {
  NEW_WITH_TAGS: "New With Tags",
  LIKE_NEW: "Like New",
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}): Promise<React.ReactElement> {
  const session = await auth();
  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  const [relatedListings, isFavorite] = await Promise.all([
    getRelatedListings(listing.category?.id ?? null, listing.id, 4),
    session?.user?.id
      ? getListingFavoriteStatus(session.user.id, params.id)
      : Promise.resolve(false),
  ]);

  const heroImage = listing.images[0]?.imageUrl ?? "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="flex-1 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-950/80 relative h-[420px]">
            <Image
              src={heroImage}
              alt={listing.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-4">
            {listing.images.slice(0, 4).map((image) => (
              <div
                key={image.id}
                className="relative h-28 overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-950/80"
              >
                <Image
                  src={image.imageUrl}
                  alt={image.altText ?? listing.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 100px"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
            <div className="flex flex-col gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {listing.brand?.name && <span>{listing.brand.name}</span>}
                {listing.brand?.name && listing.category?.name && <span> • </span>}
                {listing.category?.name && <span>{listing.category.name}</span>}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {listing.title}
              </h1>

              <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-slate-100 dark:bg-slate-950/70 px-3 py-1">
                  {conditionLabels[listing.condition] ?? listing.condition}
                </span>
                {listing.size && (
                  <span className="rounded-full bg-slate-100 dark:bg-slate-950/70 px-3 py-1">
                    Size: {listing.size}
                  </span>
                )}
                {listing.color && (
                  <span className="rounded-full bg-slate-100 dark:bg-slate-950/70 px-3 py-1">
                    {listing.color}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-baseline gap-3">
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  ₹{listing.price.toLocaleString("en-IN")}
                </p>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  {listing.status}
                </span>
              </div>

              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                {listing.description ?? "No description provided."}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Material
                  </p>
                  <p className="mt-2 text-sm text-slate-900 dark:text-white">
                    {listing.material ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Posted
                  </p>
                  <p className="mt-2 text-sm text-slate-900 dark:text-white">
                    {formatDate(listing.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950">
                  <Image
                    src={listing.seller.avatar ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"}
                    alt={listing.seller.displayName ?? listing.seller.username ?? "Seller avatar"}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {listing.seller.displayName || listing.seller.name || "Seller"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    @{listing.seller.username ?? "anonymous"}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">City:</span>{" "}
                  {listing.seller.city ?? "Unknown"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">Verified Seller:</span>{" "}
                  {listing.seller.isVerifiedSeller ? "Yes" : "No"}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <FavoriteButton listingId={listing.id} initialIsFavorite={isFavorite} size="sm" />
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Contact Seller
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Listing details</h2>
              <dl className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-4">
                  <dt className="font-semibold text-slate-900 dark:text-white">Category</dt>
                  <dd>{listing.category?.name ?? "Unspecified"}</dd>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-4">
                  <dt className="font-semibold text-slate-900 dark:text-white">Condition</dt>
                  <dd>{conditionLabels[listing.condition] ?? listing.condition}</dd>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-4">
                  <dt className="font-semibold text-slate-900 dark:text-white">Size</dt>
                  <dd>{listing.size ?? "N/A"}</dd>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-4">
                  <dt className="font-semibold text-slate-900 dark:text-white">Material</dt>
                  <dd>{listing.material ?? "N/A"}</dd>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-4">
                  <dt className="font-semibold text-slate-900 dark:text-white">Color</dt>
                  <dd>{listing.color ?? "N/A"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Related Listings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Items in the same category you may also like.
            </p>
          </div>
          <Link
            href="/browse"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {relatedListings.map((related) => (
            <Link
              key={related.id}
              href={`/listing/${related.id}`}
              className="group"
            >
              <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-sm overflow-hidden transition hover:shadow-md">
                <div className="relative h-44 w-full">
                  <Image
                    src={related.images[0]?.imageUrl ?? heroImage}
                    alt={related.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {related.brand?.name ?? "Unknown Brand"}
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    ₹{related.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
