import { z } from "zod";
import type { ListingDTO } from "@/schemas/listing";

const optionalNullableString = (maxLength: number, fieldName: string) =>
  z
    .string()
    .trim()
    .max(maxLength, { message: `${fieldName} must not exceed ${maxLength} characters` })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value));

export const profileUpdateSchema = z.object({
  avatar: z
    .string()
    .trim()
    .url({ message: "Please provide a valid avatar URL." })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value)),
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username must not exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value)),
  displayName: optionalNullableString(80, "Display name"),
  bio: optionalNullableString(160, "Bio"),
  phone: optionalNullableString(30, "Phone"),
  city: optionalNullableString(50, "City"),
  country: optionalNullableString(50, "Country"),
});

export type ProfileUpdateInput = z.output<typeof profileUpdateSchema>;
export type ProfileUpdateFormInput = z.input<typeof profileUpdateSchema>;

export interface ProfileSummaryDTO {
  id: string;
  email: string;
  displayName: string | null;
  username: string | null;
  bio: string | null;
  avatar: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileOverviewDTO extends ProfileSummaryDTO {
  activeListingsCount: number;
  soldItemsCount: number;
  purchasedItemsCount: number;
  wishlistCount: number;
  recentListings: ListingDTO[];
}

export interface PublicSellerProfileDTO extends ProfileSummaryDTO {
  activeListingsCount: number;
  soldItemsCount: number;
  listings: ListingDTO[];
}
