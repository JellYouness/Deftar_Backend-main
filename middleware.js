// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // Handle CORS
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200 });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
