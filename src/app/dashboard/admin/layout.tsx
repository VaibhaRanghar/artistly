import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  let role = user.publicMetadata?.role as string;
  if (!role) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    });
    role = dbUser?.role as string;
  }

  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
