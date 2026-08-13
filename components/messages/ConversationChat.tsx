"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ConversationDTO } from "@/schemas/message";

interface ConversationChatProps {
  conversation: ConversationDTO;
  currentUserId: string;
}

function formatMessageTime(value: string): string {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ConversationChat({
  conversation,
  currentUserId,
}: ConversationChatProps): React.ReactElement {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages.length]);

  useEffect(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const intervalId = window.setInterval(() => router.refresh(), 15_000);
    return () => window.clearInterval(intervalId);
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Message content cannot be empty.");
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        const response = await fetch(
          `/api/messages/conversations/${conversation.id}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: trimmedContent }),
          }
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setError(payload?.error ?? "Unable to send message.");
          return;
        }

        setContent("");
        router.refresh();
      } catch {
        setError("Unable to send message.");
      }
    });
  };

  return (
    <div className="flex min-h-[65vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Conversation with
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {conversation.participant.displayName ??
            conversation.participant.username ??
            "Closeit member"}
        </h1>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-5 dark:bg-slate-950/40">
        {conversation.messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            Start the conversation with a message.
          </p>
        ) : (
          conversation.messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                    isOwnMessage
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p
                    className={`mt-1 text-[11px] ${
                      isOwnMessage ? "text-indigo-100" : "text-slate-400"
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-100 p-4 dark:border-slate-700">
        <div className="flex gap-3">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={2000}
            rows={2}
            placeholder="Write a message..."
            disabled={isPending}
            className="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <button
            type="submit"
            disabled={isPending}
            className="self-end rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Sending..." : "Send"}
          </button>
        </div>
        {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
      </form>
    </div>
  );
}
