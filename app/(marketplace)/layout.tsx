import React from "react";
import { auth } from "@/auth";
import { MarketplaceShell } from "@/components/MarketplaceShell";
import { getUnreadMessageCount } from "@/lib/message/service";

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const session = await auth();
  const unreadMessageCount = session?.user?.id
    ? await getUnreadMessageCount(session.user.id)
    : 0;

  return (
    <MarketplaceShell user={session?.user} unreadMessageCount={unreadMessageCount}>
      {children}
    </MarketplaceShell>
  );
}
