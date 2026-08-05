import { prisma } from "@/lib/prisma";
import {
  CreateListingInput,
  ListingDTO,
  GetListingsQueryOptions,
  PaginatedListingsResponse,
} from "@/schemas/listing";
import { ListingCondition, ListingStatus, Currency, Prisma } from "@/app/generated/prisma/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const defaultSellerSelect = {
  id: true,
  name: true,
  displayName: true,
  username: true,
  avatar: true,
  city: true,
  isVerifiedSeller: true,
};

const listingInclude = {
  brand: {
    select: { id: true, name: true, slug: true },
  },
  category: {
    select: { id: true, name: true, slug: true },
  },
  images: {
    orderBy: { position: "asc" },
    select: { id: true, imageUrl: true, position: true, altText: true },
  },
  seller: {
    select: defaultSellerSelect,
  },
} as const;

type ListingWithRelations = Prisma.ListingGetPayload<{ include: typeof listingInclude }>;

function mapListingToDTO(listing: ListingWithRelations): ListingDTO {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: Number(listing.price),
    currency: listing.currency,
    condition: listing.condition,
    status: listing.status,
    size: listing.size,
    color: listing.color,
    material: listing.material,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
    brand: listing.brand,
    category: listing.category,
    images: listing.images,
    seller: listing.seller,
  };
}

function buildPublicListingsWhere(
  options: GetListingsQueryOptions = {}
): Prisma.ListingWhereInput {
  const whereConditions: Prisma.ListingWhereInput = {
    status: ListingStatus.ACTIVE,
    deletedAt: null,
  };

  if (options.search && options.search.trim().length > 0) {
    const query = options.search.trim();
    whereConditions.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { brand: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  if (options.category && options.category !== "All Items") {
    const catQuery = options.category.trim();
    whereConditions.category = {
      OR: [
        { slug: { equals: slugify(catQuery), mode: "insensitive" } },
        { name: { equals: catQuery, mode: "insensitive" } },
      ],
    };
  }

  if (options.brand && options.brand !== "All Brands") {
    const brandQuery = options.brand.trim();
    whereConditions.brand = {
      OR: [
        { slug: { equals: slugify(brandQuery), mode: "insensitive" } },
        { name: { equals: brandQuery, mode: "insensitive" } },
      ],
    };
  }

  if (options.condition && options.condition !== "ALL") {
    whereConditions.condition = options.condition as ListingCondition;
  }

  return whereConditions;
}

/**
 * Creates a new Listing for the specified seller.
 * Handles automatic upsert for Brand and Category taxonomy entities.
 */
export async function createListing(
  sellerId: string,
  input: CreateListingInput
): Promise<ListingDTO> {
  // 1. Resolve or create Brand
  let brandId: string | undefined;
  if (input.brandName && input.brandName.trim().length > 0) {
    const brandSlug = slugify(input.brandName);
    const brand = await prisma.brand.upsert({
      where: { slug: brandSlug },
      create: {
        name: input.brandName.trim(),
        slug: brandSlug,
      },
      update: {},
    });
    brandId = brand.id;
  }

  // 2. Resolve or create Category
  let categoryId: string | undefined = input.categoryId;
  if (!categoryId && input.categoryName && input.categoryName.trim().length > 0) {
    const categorySlug = slugify(input.categoryName);
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      create: {
        name: input.categoryName.trim(),
        slug: categorySlug,
      },
      update: {},
    });
    categoryId = category.id;
  }

  // Default image if none provided
  const imagesData =
    input.images && input.images.length > 0
      ? input.images.map((img, index) => ({
          imageUrl: img.imageUrl,
          position: index,
          altText: img.altText || `${input.title} photo ${index + 1}`,
        }))
      : [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
            position: 0,
            altText: input.title,
          },
        ];

  // 3. Create Listing with nested images
  const listing = await prisma.listing.create({
    data: {
      title: input.title,
      description: input.description || null,
      price: input.price,
      currency: (input.currency as Currency) || Currency.INR,
      condition: input.condition as ListingCondition,
      status: (input.status as ListingStatus) || ListingStatus.ACTIVE,
      size: input.size || null,
      color: input.color || null,
      material: input.material || null,
      sellerId,
      brandId: brandId || null,
      categoryId: categoryId || null,
      images: {
        create: imagesData,
      },
    },
    include: listingInclude,
  });

  return mapListingToDTO(listing);
}

/**
 * Retrieves all active (non-deleted) listings owned by the given seller, newest first.
 */
export async function getSellerListings(sellerId: string): Promise<ListingDTO[]> {
  const listings = await prisma.listing.findMany({
    where: {
      sellerId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: listingInclude,
  });

  return listings.map((item) => mapListingToDTO(item));
}

/**
 * Queries public ACTIVE listings for the Browse marketplace view.
 * Supports search (title, description, brand), category/brand/condition filters,
 * sorting (newest, price_asc, price_desc), and page-based pagination.
 */
export async function getMarketplaceListings(
  options: GetListingsQueryOptions = {}
): Promise<PaginatedListingsResponse> {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.max(1, Math.min(50, options.pageSize || 12));
  const skip = (page - 1) * pageSize;

  const whereConditions = buildPublicListingsWhere(options);

  let orderBy: Prisma.ListingOrderByWithRelationInput = { createdAt: "desc" };
  if (options.sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (options.sort === "price_desc") {
    orderBy = { price: "desc" };
  }

  const [total, listings] = await Promise.all([
    prisma.listing.count({ where: whereConditions }),
    prisma.listing.findMany({
      where: whereConditions,
      orderBy,
      skip,
      take: pageSize,
      include: listingInclude,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return {
    listings: listings.map((item) => mapListingToDTO(item)),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getPublicListings(
  options: GetListingsQueryOptions = {}
): Promise<PaginatedListingsResponse> {
  return getMarketplaceListings(options);
}

/**
 * Fetches a single listing by ID with full details for the Listing Detail view.
 * Ensures the listing is not soft-deleted.
 */
export async function getListingById(id: string): Promise<ListingDTO | null> {
  const listing = await prisma.listing.findFirst({
    where: {
      id,
      status: ListingStatus.ACTIVE,
      deletedAt: null,
    },
    include: listingInclude,
  });

  if (!listing) return null;

  return mapListingToDTO(listing);
}

export async function getListingFavoriteStatus(
  userId: string,
  listingId: string
): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_listingId: {
        userId,
        listingId,
      },
    },
  });

  return Boolean(favorite);
}

export async function addFavorite(
  userId: string,
  listingId: string
): Promise<void> {
  const listing = await prisma.listing.findFirst({
    where: {
      id: listingId,
      status: ListingStatus.ACTIVE,
      deletedAt: null,
    },
  });

  if (!listing) {
    throw new Error("Listing not found or unavailable.");
  }

  await prisma.favorite.upsert({
    where: {
      userId_listingId: {
        userId,
        listingId,
      },
    },
    create: {
      userId,
      listingId,
    },
    update: {},
  });
}

export async function removeFavorite(
  userId: string,
  listingId: string
): Promise<boolean> {
  const deleted = await prisma.favorite.deleteMany({
    where: {
      userId,
      listingId,
    },
  });

  return deleted.count > 0;
}

export async function getUserFavorites(userId: string): Promise<ListingDTO[]> {
  const listings = await prisma.listing.findMany({
    where: {
      status: ListingStatus.ACTIVE,
      deletedAt: null,
      favoritedBy: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: listingInclude,
  });

  return listings.map((item) => mapListingToDTO(item));
}

/**
 * Fetches up to `limit` related active listings in the same category, excluding current listing.
 */
export async function getRelatedListings(
  categoryId: string | null,
  currentListingId: string,
  limit = 4
): Promise<ListingDTO[]> {
  const whereConditions: Prisma.ListingWhereInput = {
    status: ListingStatus.ACTIVE,
    deletedAt: null,
    id: { not: currentListingId },
  };

  if (categoryId) {
    whereConditions.categoryId = categoryId;
  }

  let listings = await prisma.listing.findMany({
    where: whereConditions,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: listingInclude,
  });

  // Fallback: If not enough related category items, pull general active listings
  if (listings.length < limit && categoryId) {
    const fallbackListings = await prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
        deletedAt: null,
        id: { notIn: [currentListingId, ...listings.map((l) => l.id)] },
      },
      take: limit - listings.length,
      orderBy: { createdAt: "desc" },
      include: listingInclude,
    });

    listings = [...listings, ...fallbackListings];
  }

  return listings.map((item) => mapListingToDTO(item));
}

/**
 * Fetches unique category and brand names currently used by active listings.
 */
export async function getFilterOptions(): Promise<{
  categories: string[];
  brands: string[];
}> {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: {
        listings: {
          some: {
            status: ListingStatus.ACTIVE,
            deletedAt: null,
          },
        },
      },
      select: { name: true },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      where: {
        listings: {
          some: {
            status: ListingStatus.ACTIVE,
            deletedAt: null,
          },
        },
      },
      select: { name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    categories: Array.from(new Set(categories.map((c) => c.name))),
    brands: Array.from(new Set(brands.map((b) => b.name))),
  };
}
