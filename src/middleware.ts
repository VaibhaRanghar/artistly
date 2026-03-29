import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/webhooks(.*)', // Keep webhooks protected or handle signature verification inside
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  let role = (sessionClaims?.metadata as any)?.role;
  const isProtected = isProtectedRoute(req);
  const isOnboarding = req.nextUrl.pathname === "/onboarding";

  // Fallback: If userId is present but role is missing from sessionClaims, 
  // fetch the full user object to check publicMetadata.
  if (userId && !role) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    role = user.publicMetadata?.role;
  }

  // If the user is logged in and doesn't have a role,
  // and they are trying to access a protected route, redirect them to onboarding.
  if (userId && isProtected && !role && !isOnboarding) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return Response.redirect(onboardingUrl);
  }

  if (isProtected) await auth.protect();
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
