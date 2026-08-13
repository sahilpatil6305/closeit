import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ConversationChat } from "@/components/messages/ConversationChat";
import { getConversation } from "@/lib/message/service";

export const metadata = {
  title: "Conversation",
  description: "Private Closeit messages.",
};

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}): Promise<React.ReactElement> {
  const session = await auth();
  const userId = session?.user?.id;
  const { conversationId } = await params;

  if (!userId) {
    notFound();
  }

  const conversation = await getConversation(userId, conversationId);
  if (!conversation) {
    notFound();
  }

  return <ConversationChat conversation={conversation} currentUserId={userId} />;
}
