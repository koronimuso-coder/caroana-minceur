import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");

  if (!paymentId || !orderId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Redirect to the UI sandbox page
  const redirectUrl = new URL("/paiement/sandbox", request.url);
  redirectUrl.searchParams.set("paymentId", paymentId);
  redirectUrl.searchParams.set("orderId", orderId);
  
  return NextResponse.redirect(redirectUrl);
}
