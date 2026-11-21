import { redirect } from "next/navigation";
import { getAuthUser } from "@/src/lib/auth";

export default async function DashboardPage() {
  const { dbUser } = await getAuthUser();
  
  if (!dbUser) {
    redirect("/onboarding");
  }

  const role = dbUser.role;

  if (role === "ARTIST") {
    redirect("/dashboard/artist");
  } else if (role === "HIRER") {
    redirect("/dashboard/hirer");
  } else if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/onboarding");
  }

  return null;
}
