import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // 1. Check Clerk Metadata (fastest)
  let role = user.publicMetadata?.role as string;

  // 2. Fallback to Prisma if Clerk metadata is missing/delayed
  if (!role) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    });
    role = dbUser?.role as string;
  }

  if (role === "ARTIST") {
    redirect("/dashboard/artist");
  } else if (role === "HIRER") {
    redirect("/dashboard/hirer");
  } else if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    // If somehow a user with no role reaches here after database check
    redirect("/onboarding");
  }

  return null;
}
