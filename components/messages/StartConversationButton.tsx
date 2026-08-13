"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface StartConversationButtonProps {
  participantId: string;
  disabled?: boolean;
}

export function StartConversationButton({
  participantId,
  disabled = false,
}: StartConversationButtonProps): React.ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      setError(null);
      try {
        const response = await fetch("/api/messages/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantId }),
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.conversationId) {
          setError(payload?.error ?? "Unable to start a conversation.");
          return;
        }

        router.push(`/messages/${payload.conversationId}`);
      } catch {
        setError("Unable to start a conversation.");
      }
    });
  };

  return (
    <div className="flex-1">
      <button
        type="button"
        disabled={disabled || isPending}
        onClick={handleClick}
        className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
      >
        {isPending ? "Opening..." : "Message seller"}
      </button>
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
