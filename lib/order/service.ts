import { prisma } from "@/lib/prisma";
import { CreateOrderInput, OrderDTO } from "@/schemas/order";
import {
  ListingStatus,
  OrderStatus,
  Prisma,
} from "@/app/generated/prisma/client";

const orderUserSelect = {
  id: true,
  name: true,
  displayName: true,
  username: true,
  avatar: true,
} as const;

const orderItemInclude = {
  listing: {
    select: {
      id: true,
      title: true,
      images: {
        take: 1,
        orderBy: { position: "asc" },
        select: { imageUrl: true },
      },
    },
  },
} as const;

const orderInclude = {
  buyer: { select: orderUserSelect },
  seller: { select: orderUserSelect },
  items: {
    select: {
      id: true,
      listingId: true,
      priceAtPurchase: true,
      currency: true,
      quantity: true,
      listing: { ...orderItemInclude.listing },
    },
  },
} as const;

type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

function formatOrderParty(user: {
  id: string;
  name: string | null;
  displayName: string | null;
  username: string | null;
  avatar: string | null;
}) {
  return {
    id: user.id,
    name: user.name,
    displayName: user.displayName,
    username: user.username,
    avatar: user.avatar,
  };
}

function mapOrderToDTO(order: OrderWithRelations): OrderDTO {
  return {
    id: order.id,
    status: order.status,
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    currency: order.currency,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    buyer: formatOrderParty(order.buyer),
    seller: formatOrderParty(order.seller),
    items: order.items.map((item) => ({
      id: item.id,
      listingId: item.listingId,
      listingTitle: item.listing.title,
      listingImageUrl: item.listing.images[0]?.imageUrl ?? null,
      priceAtPurchase: Number(item.priceAtPurchase),
      currency: item.currency,
      quantity: item.quantity,
    })),
  };
}

export async function createOrder(
  buyerId: string,
  input: CreateOrderInput
): Promise<OrderDTO> {
  const listing = await prisma.listing.findFirst({
    where: {
      id: input.listingId,
      status: ListingStatus.ACTIVE,
      deletedAt: null,
    },
    select: {
      id: true,
      price: true,
      currency: true,
      sellerId: true,
    },
  });

  if (!listing) {
    throw new Error("Listing not found or unavailable.");
  }

  if (listing.sellerId === buyerId) {
    throw new Error("You cannot purchase your own listing.");
  }

  const existingPurchase = await prisma.orderItem.findFirst({
    where: {
      listingId: listing.id,
      order: { buyerId },
    },
    select: { id: true },
  });

  if (existingPurchase) {
    throw new Error("You have already purchased this listing.");
  }

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        buyerId,
        sellerId: listing.sellerId,
        subtotal: listing.price,
        total: listing.price,
        currency: listing.currency,
        status: OrderStatus.PENDING,
        items: {
          create: [
            {
              listingId: listing.id,
              priceAtPurchase: listing.price,
              currency: listing.currency,
              quantity: 1,
            },
          ],
        },
      },
      include: orderInclude,
    });

    const updatedListings = await tx.listing.updateMany({
      where: {
        id: listing.id,
        status: ListingStatus.ACTIVE,
        deletedAt: null,
      },
      data: {
        status: ListingStatus.SOLD,
      },
    });

    if (updatedListings.count !== 1) {
      throw new Error("Failed to reserve listing for checkout.");
    }

    return createdOrder;
  });

  return mapOrderToDTO(order);
}

export async function getUserOrders(
  userId: string
): Promise<{ purchases: OrderDTO[]; sales: OrderDTO[] }> {
  const [purchases, sales] = await Promise.all([
    prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      include: orderInclude,
    }),
    prisma.order.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
      include: orderInclude,
    }),
  ]);

  return {
    purchases: purchases.map(mapOrderToDTO),
    sales: sales.map(mapOrderToDTO),
  };
}
