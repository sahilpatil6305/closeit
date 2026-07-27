import React from "react";
import { auth } from "@/auth";
import { MarketplaceShell } from "@/components/MarketplaceShell";

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const session = await auth();

  return (
    <MarketplaceShell user={session?.user}>
      {children}
    </MarketplaceShell>
  );
}
