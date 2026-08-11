import { prisma } from "@/lib/prisma";
import { getSellerListings } from "@/lib/listing/service";
import type {
  ProfileOverviewDTO,
  ProfileSummaryDTO,
  ProfileUpdateInput,
  PublicSellerProfileDTO,
} from "@/schemas/profile";
import { ListingStatus, Prisma } from "@/app/generated/prisma/client";

const profileSelect = {
  id: true,
  email: true,
  displayName: true,
  username: true,
  bio: true,
  avatar: true,
  phone: true,
  city: true,
  country: true,
  createdAt: true,
  updatedAt: true,
} as const;

type UserProfileSelect = Prisma.UserGetPayload<{ select: typeof profileSelect }>;

function mapUserToProfileSummary(user: UserProfileSelect): ProfileSummaryDTO {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
    phone: user.phone,
    city: user.city,
    country: user.country,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getProfileOverview(
  userId: string
): Promise<ProfileOverviewDTO | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });

  if (!user) {
    return null;
  }

  const [activeListingsCount, soldItemsCount, purchasedItemsCount, wishlistCount, allListings] =
    await Promise.all([
      prisma.listing.count({
        where: {
          sellerId: userId,
          status: ListingStatus.ACTIVE,
          deletedAt: null,
        },
      }),
      prisma.listing.count({
        where: {
          sellerId: userId,
          status: ListingStatus.SOLD,
          deletedAt: null,
        },
      }),
      prisma.order.count({
        where: {
          buyerId: userId,
        },
      }),
      prisma.favorite.count({
        where: {
          userId,
        },
      }),
      getSellerListings(userId),
    ]);

  return {
    ...mapUserToProfileSummary(user),
    activeListingsCount,
    soldItemsCount,
    purchasedItemsCount,
    wishlistCount,
    recentListings: allListings.slice(0, 5),
  };
}

export async function getProfileById(userId: string): Promise<ProfileSummaryDTO | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });

  if (!user) {
    return null;
  }

  return mapUserToProfileSummary(user);
}

export async function updateProfile(
  userId: string,
  input: ProfileUpdateInput
): Promise<ProfileSummaryDTO> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: input.avatar,
        username: input.username,
        displayName: input.displayName,
        bio: input.bio,
        phone: input.phone,
        city: input.city,
        country: input.country,
      },
      select: profileSelect,
    });

    return mapUserToProfileSummary(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("That username is already taken.");
    }

    throw error;
  }
}

export async function getPublicSellerProfile(
  username: string
): Promise<PublicSellerProfileDTO | null> {
  const seller = await prisma.user.findUnique({
    where: { username },
    select: profileSelect,
  });

  if (!seller) {
    return null;
  }

  const [activeListingsCount, soldItemsCount, allListings] = await Promise.all([
    prisma.listing.count({
      where: {
        sellerId: seller.id,
        status: ListingStatus.ACTIVE,
        deletedAt: null,
      },
    }),
    prisma.listing.count({
      where: {
        sellerId: seller.id,
        status: ListingStatus.SOLD,
        deletedAt: null,
      },
    }),
    getSellerListings(seller.id),
  ]);

  return {
    ...mapUserToProfileSummary(seller),
    activeListingsCount,
    soldItemsCount,
    listings: allListings.filter((listing) => listing.status === "ACTIVE"),
  };
}
