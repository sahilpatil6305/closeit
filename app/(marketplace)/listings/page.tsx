import React from "react";
import { auth } from "@/auth";
import { getSellerListings } from "@/lib/listing/service";
import { SellerListingsGrid } from "@/components/listing/SellerListingsGrid";
import { ListingDTO } from "@/schemas/listing";

export const metadata = {
  title: "My Listings",
  description: "Manage your active listings on Closeit.",
};

interface ListingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps): Promise<React.ReactElement> {
  const session = await auth();
  const params = await searchParams;
  const isCreated = params.created === "true";

  let listings: ListingDTO[] = [];
  if (session?.user?.id) {
    listings = await getSellerListings(session.user.id);
  }

  return (
    <SellerListingsGrid
      initialListings={listings}
      showSuccessBanner={isCreated}
    />
  );
}
