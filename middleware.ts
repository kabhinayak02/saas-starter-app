import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(
  [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhook/register"
  ]
)

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();
    
    // handle non-authenticated users 
    if (!userId && !isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // for authenticated users 
    if (userId) {
      const client = await clerkClient()
      const user = client.users.getUser(userId);
      const role = (await user).publicMetadata.role as string | undefined

      // const user = await clerkClient.users.getUser(userId);
      // const role = user.publicMetadata.role as string | undefined;

      // admin role check and redirection 
      if (role == "admin" && req.nextUrl.pathname === '/dashboard') {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      // prevent non admin user to access the admin routes
      if (role !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (isPublicRoute(req)) {
        return NextResponse.redirect(new URL(
          role === "admin" ? "/admin/dashboard" : "/dashboard",
          req.url
        ))
      }

    }

    return NextResponse.next();

  } catch (error: any) {
    console.error(error);
    return NextResponse.redirect(new URL("/error"));
  }
})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}