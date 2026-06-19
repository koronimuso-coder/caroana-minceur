import { NextResponse } from "next/server";
import { cartCalculationInputSchema } from "@/schemas";
import { CartService } from "@/server/services/cart.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request
    const parsed = cartCalculationInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.format() }, { status: 400 });
    }

    const cartService = new CartService();
    const result = await cartService.calculateCart(parsed.data);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Cart calculation failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
