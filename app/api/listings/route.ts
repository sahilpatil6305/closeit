import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createListingSchema } from "@/schemas/listing";
import type { GetListingsQueryOptions } from "@/schemas/listing";
import { createListing, getMarketplaceListings } from "@/lib/listing/service";

function normalizeParam(value: string | null): string | undefined {
  if (!value) return undefined;
  return value;
}

function parseIntParam(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to create a listing." },
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

    const validationResult = createListingSchema.safeParse(body);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          error: "Validation failed",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const listing = await createListing(session.user.id, validationResult.data);

    return NextResponse.json(
      {
        message: "Listing created successfully.",
        listing,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while creating the listing." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const page = parseIntParam(searchParams.get("page"), 1);
    const pageSize = parseIntParam(searchParams.get("pageSize"), 12);
    const search = normalizeParam(searchParams.get("search"));
    const category = normalizeParam(searchParams.get("category"));
    const brand = normalizeParam(searchParams.get("brand"));
    const condition = normalizeParam(searchParams.get("condition"));
    const sort = normalizeParam(searchParams.get("sort")) as
      | GetListingsQueryOptions["sort"]
      | undefined;

    const response = await getMarketplaceListings({
      page,
      pageSize,
      search: search || undefined,
      category: category || undefined,
      brand: brand || undefined,
      condition: condition || undefined,
      sort,
    });

    return NextResponse.json(
      {
        items: response.listings,
        totalCount: response.total,
        currentPage: response.page,
        totalPages: response.totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching marketplace listings:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching listings." },
      { status: 500 }
    );
  }
}
