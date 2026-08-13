import Link from "next/link";
import { auth } from "@/auth";
import { EmptyState } from "@/components/EmptyState";
import { getInbox } from "@/lib/message/service";

export const metadata = {
  title: "Messages",
  description: "Your Closeit conversations.",
};

function formatConversationTime(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

export default async function MessagesPage(): Promise<React.ReactElement> {
  const session = await auth();
  const userId = session?.user?.id;
  const conversations = userId ? await getInbox(userId) : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Messages
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Chat privately with buyers and sellers.
        </p>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Open a listing and message its seller to start a conversation."
          action={{ label: "Browse marketplace", href: "/browse" }}
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 last:border-b-0 dark:border-slate-700 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {(conversation.participant.displayName ?? conversation.participant.username ?? "U")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {conversation.participant.displayName ??
                      conversation.participant.username ??
                      "Closeit member"}
                  </p>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatConversationTime(conversation.lastMessageAt)}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {conversation.latestMessage?.content ?? "No messages yet"}
                </p>
              </div>
              {conversation.unreadCount > 0 ? (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white">
                  {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
