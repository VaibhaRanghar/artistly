import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { cache } from "react";

/**
 * Gets the authenticated database user using React's cache.
 * 
 * This uses auth() (fast local JWT) instead of currentUser() (slow API call)
 * to grab the userId, and queries Supabase once per request lifecycle.
 * The Database is the single source of truth for the user's role.
 */
export const getAuthUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      artistProfile: true,
      hirerProfile: true,
    },
  });

  return { userId, dbUser };
});

/**
 * For the rare cases (like the profile page) where we actually need 
 * Clerk-specific data like imageUrl and email that isn't in our DB.
 */
export const getClerkUser = cache(async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return user;
});
