import { z } from "zod";

export const createOrderSchema = z.object({
  listingId: z.string().min(1, { message: "Listing ID is required." }),
});

export type CreateOrderInput = z.output<typeof createOrderSchema>;

export interface OrderItemDTO {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImageUrl: string | null;
  priceAtPurchase: number;
  currency: string;
  quantity: number;
}

export interface OrderPartyDTO {
  id: string;
  name: string | null;
  displayName: string | null;
  username: string | null;
  avatar: string | null;
}

export interface OrderDTO {
  id: string;
  status: string;
  subtotal: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  buyer: OrderPartyDTO;
  seller: OrderPartyDTO;
  items: OrderItemDTO[];
}
