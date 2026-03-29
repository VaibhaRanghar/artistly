"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { Role, ServiceCategory } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function onboardUser(data: {
  role: Role;
  name?: string;
  bio?: string;
  location?: string;
  categories?: string[];
  languages?: string[];
  feeRange?: string;
  companyName?: string;
}) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 1. Update Clerk Metadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      role: data.role,
    },
  });

  // 2. Create/Update User in Prisma
  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      role: data.role,
      fullName: data.name || user.fullName,
    },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      fullName: data.name || user.fullName,
      imageUrl: user.imageUrl,
      role: data.role,
    },
  });

  // 3. Create Role-Specific Profile
  if (data.role === "ARTIST") {
    await prisma.artistProfile.upsert({
      where: { userId: dbUser.id },
      update: {
        bio: data.bio,
        skills: data.categories,
      },
      create: {
        userId: dbUser.id,
        bio: data.bio,
        skills: data.categories || [],
      },
    });
  } else if (data.role === "HIRER") {
    await prisma.hirerProfile.upsert({
      where: { userId: dbUser.id },
      update: {
        companyName: data.companyName,
      },
      create: {
        userId: dbUser.id,
        companyName: data.companyName,
      },
    });
  }

  return { success: true };
}

export async function createGig(formData: {
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  deliveryTime: number;
}) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { artistProfile: true },
  });

  if (!dbUser || !dbUser.artistProfile) {
    throw new Error("Artist profile not found");
  }

  await prisma.service.create({
    data: {
      artistId: dbUser.artistProfile.id,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      deliveryTime: formData.deliveryTime,
    },
  });

  revalidatePath("/dashboard/artist/gigs");
  return { success: true };
}

export async function createEvent(formData: {
  title: string;
  description: string;
  date: Date;
  location: string;
  budget?: number;
}) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { hirerProfile: true },
  });

  if (!dbUser || !dbUser.hirerProfile) {
    throw new Error("Hirer profile not found");
  }

  await prisma.event.create({
    data: {
      hirerId: dbUser.hirerProfile.id,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      budget: formData.budget,
    },
  });

  revalidatePath("/dashboard/hirer/events");
  return { success: true };
}
