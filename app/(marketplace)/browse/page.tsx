import React from "react";
import Link from "next/link";
import { ListingCard } from "@/components/listing/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { getFilterOptions, getMarketplaceListings } from "@/lib/listing/service";
import { listingConditionEnum } from "@/schemas/listing";
import { GetListingsQueryOptions } from "@/schemas/listing";

export const metadata = {
  title: "Browse Marketplace",
  description: "Discover pre-loved vintage, streetwear, and designer fashion on Closeit.",
};

const DEFAULT_CATEGORY = "All Items";
const DEFAULT_BRAND = "All Brands";
const DEFAULT_CONDITION = "ALL";
const DEFAULT_SORT = "newest";
const PAGE_SIZE = 12;

const SORT_OPTIONS: Array<{ value: "newest" | "price_asc" | "price_desc"; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function normalizeParam(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | string[] | undefined): number {
  const raw = normalizeParam(value);
  const page = raw ? parseInt(raw, 10) : 1;
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

function buildQueryString(options: {
  search: string;
  category: string;
  brand: string;
  condition: string;
  sort: string;
  page: number;
}): string {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.category && options.category !== DEFAULT_CATEGORY) params.set("category", options.category);
  if (options.brand && options.brand !== DEFAULT_BRAND) params.set("brand", options.brand);
  if (options.condition && options.condition !== DEFAULT_CONDITION) params.set("condition", options.condition);
  if (options.sort && options.sort !== DEFAULT_SORT) params.set("sort", options.sort);
  params.set("page", String(options.page));
  return params.toString();
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<React.ReactElement> {
  const search = normalizeParam(searchParams.search) ?? "";
  const category = normalizeParam(searchParams.category) ?? DEFAULT_CATEGORY;
  const brand = normalizeParam(searchParams.brand) ?? DEFAULT_BRAND;
  const condition = normalizeParam(searchParams.condition) ?? DEFAULT_CONDITION;
  const sort = normalizeParam(searchParams.sort) ?? DEFAULT_SORT;
  const page = parsePage(searchParams.page);

  const [filters, response] = await Promise.all([
    getFilterOptions(),
    getMarketplaceListings({
      search,
      category,
      brand,
      condition,
      sort: sort as GetListingsQueryOptions["sort"],
      page,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const categories = [DEFAULT_CATEGORY, ...filters.categories];
  const brands = [DEFAULT_BRAND, ...filters.brands];
  const currentPage = response.page;
  const totalPages = response.totalPages;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Browse Marketplace
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Discover pre-loved vintage, streetwear, and designer fashion.
        </p>
      </div>

      <form method="get" className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Search</span>
            <input
              name="search"
              defaultValue={search}
              placeholder="Search title, description, brand"
              className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</span>
            <select
              name="category"
              defaultValue={category}
              className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Brand</span>
            <select
              name="brand"
              defaultValue={brand}
              className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            >
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Condition</span>
            <select
              name="condition"
              defaultValue={condition}
              className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            >
              <option value="ALL">All Conditions</option>
              {listingConditionEnum.options.map((value) => (
                <option key={value} value={value}>
                  {value.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sort</span>
            <select
              name="sort"
              defaultValue={sort}
              className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-end justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Apply filters
          </button>
        </div>
      </form>

      {response.listings.length === 0 ? (
        <EmptyState
          title="No listings found"
          description="Try adjusting your filters or search terms to discover pre-loved fashion items."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          action={{ label: "List Your Item", href: "/sell" }}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {response.listings.length} of {response.total} active listings
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Page {currentPage}</span>
              <span>•</span>
              <span>{response.totalPages} pages</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {response.listings.map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`} className="group">
                <ListingCard listing={listing} />
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {response.total} listings found
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/browse?${buildQueryString({ search, category, brand, condition, sort, page: Math.max(1, currentPage - 1) })}`}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  currentPage === 1
                    ? "cursor-not-allowed border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500"
                    : "border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300"
                }`}
                aria-disabled={currentPage === 1}
              >
                Previous
              </Link>
              <Link
                href={`/browse?${buildQueryString({ search, category, brand, condition, sort, page: Math.min(totalPages, currentPage + 1) })}`}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  currentPage === totalPages
                    ? "cursor-not-allowed border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500"
                    : "border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300"
                }`}
                aria-disabled={currentPage === totalPages}
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
