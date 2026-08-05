import { z } from "zod";

export const listingConditionEnum = z.enum([
  "NEW_WITH_TAGS",
  "LIKE_NEW",
  "EXCELLENT",
  "GOOD",
  "FAIR",
]);

export const listingStatusEnum = z.enum([
  "DRAFT",
  "ACTIVE",
  "RESERVED",
  "SOLD",
  "ARCHIVED",
]);

export const currencyEnum = z.enum(["INR"]);

/**
 * Universal Listing Validation Schema
 * Supports Create, Update, and Draft workflows.
 */
export const createListingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(120, { message: "Title must not exceed 120 characters" }),

  description: z
    .string()
    .trim()
    .max(2000, { message: "Description must not exceed 2000 characters" })
    .optional()
    .or(z.literal("")),

  price: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Price must be a positive number",
    })
    .refine((val) => val <= 1000000, {
      message: "Price cannot exceed ₹10,00,000",
    }),

  currency: currencyEnum.default("INR"),

  condition: listingConditionEnum,

  status: listingStatusEnum.default("ACTIVE"),

  // Fashion Metadata
  brandName: z
    .string()
    .trim()
    .max(50, { message: "Brand name must not exceed 50 characters" })
    .optional()
    .or(z.literal("")),

  categoryName: z
    .string()
    .trim()
    .max(50, { message: "Category name must not exceed 50 characters" })
    .optional()
    .or(z.literal("")),

  categoryId: z.string().optional().or(z.literal("")),

  size: z
    .string()
    .trim()
    .max(30, { message: "Size must not exceed 30 characters" })
    .optional()
    .or(z.literal("")),

  color: z
    .string()
    .trim()
    .max(30, { message: "Color must not exceed 30 characters" })
    .optional()
    .or(z.literal("")),

  material: z
    .string()
    .trim()
    .max(50, { message: "Material must not exceed 50 characters" })
    .optional()
    .or(z.literal("")),

  // Gallery Images
  images: z
    .array(
      z.object({
        imageUrl: z
          .string()
          .trim()
          .url({ message: "Please provide a valid image URL" }),
        altText: z.string().trim().optional(),
      })
    )
    .optional()
    .default([]),
});

export type CreateListingFormInput = z.input<typeof createListingSchema>;
export type CreateListingInput = z.output<typeof createListingSchema>;

export interface ListingDTO {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  condition: string;
  status: string;
  size: string | null;
  color: string | null;
  material: string | null;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: Array<{
    id: string;
    imageUrl: string;
    position: number;
    altText: string | null;
  }>;
  seller: {
    id: string;
    name: string | null;
    displayName: string | null;
    username: string | null;
    avatar: string | null;
    city: string | null;
    isVerifiedSeller: boolean;
  };
}

export interface GetListingsQueryOptions {
  search?: string;
  category?: string;
  brand?: string;
  condition?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
}

export interface PaginatedListingsResponse {
  listings: ListingDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
