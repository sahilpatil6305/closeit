import { NextResponse } from "next/server";
import { getPublicSellerProfile } from "@/lib/profile/service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse> {
  try {
    const { username } = await params;
    const profile = await getPublicSellerProfile(username);

    if (!profile) {
      return NextResponse.json({ error: "Seller not found." }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching seller profile." },
      { status: 500 }
    );
  }
}
