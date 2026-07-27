"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export interface MarketplaceShellProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}

export function MarketplaceShell({
  user,
  children,
}: MarketplaceShellProps): React.ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans">
      <Navbar
        user={user}
        onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
      />
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
