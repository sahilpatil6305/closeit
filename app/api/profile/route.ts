import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { profileUpdateSchema } from "@/schemas/profile";
import { getProfileOverview, updateProfile } from "@/lib/profile/service";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to view your profile." },
        { status: 401 }
      );
    }

    const profile = await getProfileOverview(session.user.id);
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching profile data." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to update your profile." },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload in request body." },
        { status: 400 }
      );
    }

    const validationResult = profileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: fieldErrors },
        { status: 400 }
      );
    }

    const profile = await updateProfile(session.user.id, validationResult.data);
    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error instanceof Error) {
      if (error.message.includes("already taken")) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An internal server error occurred while updating profile." },
      { status: 500 }
    );
  }
}
