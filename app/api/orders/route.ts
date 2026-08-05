import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createOrderSchema } from "@/schemas/order";
import { createOrder } from "@/lib/order/service";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to place an order." },
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

    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: fieldErrors },
        { status: 400 }
      );
    }

    const order = await createOrder(session.user.id, validationResult.data);
    return NextResponse.json(
      { message: "Order created successfully.", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      if (error.message.includes("own listing")) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An internal server error occurred while creating the order." },
      { status: 500 }
    );
  }
}
