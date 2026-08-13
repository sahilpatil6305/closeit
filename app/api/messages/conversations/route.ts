import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createConversation, getInbox } from "@/lib/message/service";
import { createConversationSchema } from "@/schemas/message";

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const conversations = await getInbox(session.user.id);
  return NextResponse.json({ conversations });
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = createConversationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const conversationId = await createConversation(session.user.id, parsed.data);
    return NextResponse.json({ conversationId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create conversation.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
