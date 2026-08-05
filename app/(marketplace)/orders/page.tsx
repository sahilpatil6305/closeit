import Image from "next/image";
import React from "react";
import { auth } from "@/auth";
import { EmptyState } from "@/components/EmptyState";
import { getUserOrders } from "@/lib/order/service";

export const metadata = {
  title: "Orders",
  description: "Track your purchases and manage sales on Closeit.",
};

export default async function OrdersPage(): Promise<React.ReactElement> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Orders & Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to view your purchases and sales history.
          </p>
        </div>
        <EmptyState
          title="Sign in to continue"
          description="You need to sign in before viewing your orders."
          action={{ label: "Login", href: "/login" }}
        />
      </div>
    );
  }

  const { purchases, sales } = await getUserOrders(userId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Orders & Transactions
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review your recent purchases and sales activity.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Purchases
          </h2>
          {purchases.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No purchases yet"
                description="Buy an item to see your purchase history here."
                action={{ label: "Browse Marketplace", href: "/browse" }}
              />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {purchases.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""} • {order.status}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
                          {item.listingImageUrl ? (
                            <Image
                              src={item.listingImageUrl}
                              alt={item.listingTitle}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {item.listingTitle}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            ₹{item.priceAtPurchase.toLocaleString("en-IN")} • Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Sales
          </h2>
          {sales.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No sales yet"
                description="Sell an item to see your sales history here."
                action={{ label: "Sell Item", href: "/sell" }}
              />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {sales.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""} • {order.status}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    <p>
                      Buyer: {order.buyer.displayName || order.buyer.name || order.buyer.username || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
