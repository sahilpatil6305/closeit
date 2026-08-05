import { NextResponse } from "next/server";
import { getListingById } from "@/lib/listing/service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const listing = await getListingById(id);

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ listing }, { status: 200 });
  } catch (error) {
    console.error("Error fetching listing by id:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching the listing." },
      { status: 500 }
    );
  }
}
