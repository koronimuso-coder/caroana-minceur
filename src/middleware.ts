import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googleapis.com https://*.firebaseapp.com https://www.googletagmanager.com https://connect.facebook.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.googleapis.com https://*.firebasestorage.app https://images.unsplash.com https://connect.facebook.net;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.google-analytics.com;
    frame-src 'self' https://*.firebaseapp.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");

  const path = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("session")?.value;

  if (path.startsWith("/admin")) {
    if (!sessionToken) {
      const url = new URL("/connexion", request.url);
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
    
    try {
      const payloadBase64 = sessionToken.split(".")[1];
      if (payloadBase64) {
        const decodedPayload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
        const role = decodedPayload.role;
        const isStaff = ["support", "content_editor", "inventory_manager", "order_manager", "administrator", "super_admin"].includes(role);
        if (!isStaff) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } else {
        return NextResponse.redirect(new URL("/connexion", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
  }

  if (path.startsWith("/compte")) {
    if (!sessionToken) {
      const url = new URL("/connexion", request.url);
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/|images/|api/health).*)",
  ],
};
