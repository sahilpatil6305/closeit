import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getConversation } from "@/lib/message/service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { conversationId } = await params;
  const conversation = await getConversation(session.user.id, conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}
