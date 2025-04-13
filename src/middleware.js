import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // If token is missing and trying to access protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next(); // allow navigation
}

export const config = {
  matcher: ["/", "/task/:path*"], // Protects '/' and all routes under '/task'
};
