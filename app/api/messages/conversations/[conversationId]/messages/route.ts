import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendMessage } from "@/lib/message/service";
import { sendMessageSchema } from "@/schemas/message";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
): Promise<NextResponse> {
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

  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { conversationId } = await params;
  try {
    const message = await sendMessage(session.user.id, conversationId, parsed.data);
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send message.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
