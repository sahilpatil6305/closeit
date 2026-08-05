import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addFavorite, removeFavorite } from "@/lib/listing/service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ listingId: string }> }
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = await params;

    try {
      await addFavorite(session.user.id, listingId);
      return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
      console.error("Error adding favorite:", error);
      return NextResponse.json(
        { error: "Unable to save listing to wishlist." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Favorite POST failed:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ listingId: string }> }
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = await params;
    const removed = await removeFavorite(session.user.id, listingId);

    if (!removed) {
      return NextResponse.json(
        { error: "Favorite not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Favorite DELETE failed:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
