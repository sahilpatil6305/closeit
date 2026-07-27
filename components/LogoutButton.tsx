"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";

export function LogoutButton(): React.ReactElement {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Error during sign out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isSigningOut}
      className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
    >
      {isSigningOut ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
