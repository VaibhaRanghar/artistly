"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { Role, ServiceCategory } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const onboardSchema = z.object({
  role: z.enum(["USER", "ARTIST", "HIRER", "ADMIN"]),
  name: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  categories: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  feeRange: z.string().optional(),
  companyName: z.string().optional(),
});

export async function onboardUser(data: z.infer<typeof onboardSchema>) {
  try {
    const validatedData = onboardSchema.parse(data);
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        role: validatedData.role as Role,
        fullName: validatedData.name || user.fullName,
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        fullName: validatedData.name || user.fullName,
        imageUrl: user.imageUrl,
        role: validatedData.role as Role,
      },
    });

    if (validatedData.role === "ARTIST") {
      await prisma.artistProfile.upsert({
        where: { userId: dbUser.id },
        update: {
          bio: validatedData.bio,
          skills: validatedData.categories,
          location: validatedData.location,
          languages: validatedData.languages || [],
        },
        create: {
          userId: dbUser.id,
          bio: validatedData.bio,
          skills: validatedData.categories || [],
          location: validatedData.location,
          languages: validatedData.languages || [],
        },
      });
    } else if (validatedData.role === "HIRER") {
      await prisma.hirerProfile.upsert({
        where: { userId: dbUser.id },
        update: {
          companyName: validatedData.companyName,
        },
        create: {
          userId: dbUser.id,
          companyName: validatedData.companyName,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[onboardUser] Error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/sign-in");
    }
    throw new Error("Failed to onboard user");
  }
}

const createGigSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  price: z.coerce.number().positive(),
  category: z.enum([
    "SINGERS",
    "DANCERS",
    "DJS",
    "SPEAKERS",
    "MUSICIANS",
    "MAGICIANS",
    "OTHERS",
  ]),
  deliveryTime: z.coerce.number().int().min(1).max(365),
});

export async function createGig(formData: z.infer<typeof createGigSchema>) {
  try {
    const validatedData = createGigSchema.parse(formData);
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
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category as ServiceCategory,
        deliveryTime: validatedData.deliveryTime,
      },
    });

    revalidatePath("/dashboard/artist/gigs");
    return { success: true };
  } catch (error) {
    console.error("[createGig] Error:", error);
    throw new Error("Failed to create gig");
  }
}

const createEventSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  date: z.coerce.date(),
  location: z.string().min(2),
  budget: z.coerce.number().positive().optional(),
});

export async function createEvent(formData: z.infer<typeof createEventSchema>) {
  try {
    const validatedData = createEventSchema.parse(formData);
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
        title: validatedData.title,
        description: validatedData.description,
        date: validatedData.date,
        location: validatedData.location,
        budget: validatedData.budget,
      },
    });

    revalidatePath("/dashboard/hirer/events");
    return { success: true };
  } catch (error) {
    console.error("[createEvent] Error:", error);
    throw new Error("Failed to create event");
  }
}

const createOrderSchema = z.object({
  serviceId: z.string().uuid(),
  requirements: z.string().optional(),
});

export async function createOrder(formData: z.infer<typeof createOrderSchema>) {
  try {
    const validatedData = createOrderSchema.parse(formData);
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      throw new Error("User not found");
    }

    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
      include: { artist: true },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    await prisma.order.create({
      data: {
        serviceId: service.id,
        buyerId: dbUser.id,
        sellerId: service.artist.id,
        amount: service.price,
        requirements: validatedData.requirements,
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard/hirer/orders");
    return { success: true };
  } catch (error) {
    console.error("[createOrder] Error:", error);
    throw new Error("Failed to create order");
  }
}

const createReviewSchema = z.object({
  serviceId: z.string().uuid(),
  orderId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function createReview(
  formData: z.infer<typeof createReviewSchema>,
) {
  try {
    const validatedData = createReviewSchema.parse(formData);
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) throw new Error("User not found");

    // Verify the user actually purchased the service via this order
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
    });

    if (
      !order ||
      order.buyerId !== dbUser.id ||
      order.serviceId !== validatedData.serviceId
    ) {
      throw new Error("Invalid order or unauthorized to review this service");
    }

    if (order.status !== "COMPLETED") {
      throw new Error("Can only review completed orders");
    }

    const review = await prisma.review.create({
      data: {
        serviceId: validatedData.serviceId,
        reviewerId: dbUser.id,
        rating: validatedData.rating,
        comment: validatedData.comment,
        isVerifiedPurchase: true,
      },
    });

    // Update Artist average rating (calculated roughly or via aggregate)
    const allReviews = await prisma.review.findMany({
      where: { service: { artistId: order.sellerId } },
      select: { rating: true },
    });

    const newCount = allReviews.length;
    const newRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / newCount;

    await prisma.artistProfile.update({
      where: { id: order.sellerId },
      data: { rating: newRating, reviewCount: newCount },
    });

    revalidatePath("/dashboard/hirer/orders");
    return { success: true };
  } catch (error) {
    console.error("[createReview] Error:", error);
    throw new Error("Failed to create review");
  }
}

const updateProfileSchema = z.object({
  bio: z.string().optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});

export async function updateArtistProfile(
  formData: z.infer<typeof updateProfileSchema>,
) {
  try {
    const validatedData = updateProfileSchema.parse(formData);
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { artistProfile: true },
    });

    if (!dbUser || !dbUser.artistProfile) {
      throw new Error("Artist profile not found");
    }

    await prisma.artistProfile.update({
      where: { id: dbUser.artistProfile.id },
      data: {
        bio: validatedData.bio,
        location: validatedData.location,
        languages: validatedData.languages,
        skills: validatedData.skills,
      },
    });

    revalidatePath("/dashboard/artist/profile");
    return { success: true };
  } catch (error) {
    console.error("[updateArtistProfile] Error:", error);
    throw new Error("Failed to update profile");
  }
}

const expressInterestSchema = z.object({
  eventId: z.string(),
  serviceId: z.string(),
  amount: z.number().positive(),
  requirements: z.string().optional(),
});

export async function expressInterest(
  formData: z.infer<typeof expressInterestSchema>,
) {
  try {
    const validatedData = expressInterestSchema.parse(formData);
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { artistProfile: true },
    });

    if (!dbUser?.artistProfile) throw new Error("Artist profile not found");

    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
      include: { hirer: true },
    });

    if (!event) throw new Error("Event not found");

    const existing = await prisma.order.findFirst({
      where: {
        eventId: validatedData.eventId,
        sellerId: dbUser.artistProfile.id,
      },
    });

    if (existing) {
      throw new Error("You have already expressed interest in this event.");
    }

    await prisma.order.create({
      data: {
        serviceId: validatedData.serviceId,
        buyerId: event.hirer.userId,
        sellerId: dbUser.artistProfile.id,
        eventId: event.id,
        amount: validatedData.amount,
        requirements:
          validatedData.requirements || "Artist expressed interest in event.",
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard/artist/events");
    return { success: true };
  } catch (error) {
    console.error("[expressInterest] Error:", error);
    throw Array.isArray(error) ? error[0] : error;
  }
}

const updateOrderStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum([
    "ACCEPTED",
    "IN_PROGRESS",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
    "REJECTED",
  ]),
});

export async function updateOrderStatus(
  formData: z.infer<typeof updateOrderStatusSchema>,
) {
  try {
    const validatedData = updateOrderStatusSchema.parse(formData);
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { artistProfile: true, hirerProfile: true },
    });

    if (!dbUser) throw new Error("User not found");

    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
    });

    if (!order) throw new Error("Order not found");

    const isSeller =
      dbUser.artistProfile && order.sellerId === dbUser.artistProfile.id;
    const isBuyer = order.buyerId === dbUser.id; // Note: buyerId is referencing User.id

    if (!isSeller && !isBuyer) {
      throw new Error("Unauthorized to update this order");
    }

    let prismaStatus = validatedData.status;
    if (validatedData.status === "REJECTED") prismaStatus = "CANCELLED";
    if (validatedData.status === "ACCEPTED") prismaStatus = "IN_PROGRESS"; // ACCEPTED is not in enum

    let updateData: any = { status: prismaStatus };

    if (
      validatedData.status === "ACCEPTED" ||
      validatedData.status === "IN_PROGRESS"
    ) {
      updateData.acceptedAt = new Date();
    } else if (validatedData.status === "DELIVERED") {
      updateData.deliveredAt = new Date();
    } else if (validatedData.status === "COMPLETED") {
      updateData.completedAt = new Date();
    }

    await prisma.order.update({
      where: { id: order.id },
      data: updateData,
    });

    revalidatePath("/dashboard/artist/orders");
    revalidatePath("/dashboard/hirer/orders");
    return { success: true };
  } catch (error) {
    console.error("[updateOrderStatus] Error:", error);
    throw new Error("Failed to update order status");
  }
}

const editServiceSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  description: z.string().min(20),
  price: z.number().positive(),
  category: z.enum([
    "SINGERS",
    "DANCERS",
    "DJS",
    "SPEAKERS",
    "MUSICIANS",
    "MAGICIANS",
    "OTHERS",
  ]),
  deliveryTime: z.number().positive(),
  revisionCount: z.number().min(0).default(0),
});

export async function editService(formData: z.infer<typeof editServiceSchema>) {
  try {
    const validatedData = editServiceSchema.parse(formData);
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { artistProfile: true },
    });

    if (!dbUser?.artistProfile) throw new Error("Artist profile not found");

    const existingService = await prisma.service.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingService) throw new Error("Service not found");
    if (existingService.artistId !== dbUser.artistProfile.id)
      throw new Error("Unauthorized to edit service");

    await prisma.service.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        deliveryTime: validatedData.deliveryTime,
        revisionCount: validatedData.revisionCount,
      },
    });

    revalidatePath("/dashboard/artist/gigs");
    return { success: true };
  } catch (error) {
    console.error("[editService] Error:", error);
    throw Array.isArray(error) ? error[0] : error;
  }
}

export async function deleteService(serviceId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { artistProfile: true },
    });

    if (!dbUser?.artistProfile) throw new Error("Artist profile not found");

    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existingService) throw new Error("Service not found");
    if (existingService.artistId !== dbUser.artistProfile.id)
      throw new Error("Unauthorized to delete service");

    await prisma.service.delete({
      where: { id: serviceId },
    });

    revalidatePath("/dashboard/artist/gigs");
    return { success: true };
  } catch (error) {
    console.error("[deleteService] Error:", error);
    throw new Error("Failed to delete service");
  }
}

const editEventSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  description: z.string().min(20),
  location: z.string().min(2),
  date: z.string(),
  budget: z.number().positive().optional(),
});

export async function editEvent(formData: z.infer<typeof editEventSchema>) {
  try {
    const validatedData = editEventSchema.parse(formData);
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { hirerProfile: true },
    });

    if (!dbUser?.hirerProfile) throw new Error("Hirer profile not found");

    const existingEvent = await prisma.event.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingEvent) throw new Error("Event not found");
    if (existingEvent.hirerId !== dbUser.hirerProfile.id)
      throw new Error("Unauthorized");

    await prisma.event.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        location: validatedData.location,
        date: new Date(validatedData.date),
        budget: validatedData.budget,
      },
    });

    revalidatePath("/dashboard/hirer/events");
    revalidatePath("/dashboard/artist/events");
    return { success: true };
  } catch (error) {
    console.error("[editEvent] Error:", error);
    throw Array.isArray(error) ? error[0] : error;
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { hirerProfile: true },
    });

    if (!dbUser?.hirerProfile) throw new Error("Hirer profile not found");

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) throw new Error("Event not found");
    if (existingEvent.hirerId !== dbUser.hirerProfile.id)
      throw new Error("Unauthorized");

    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidatePath("/dashboard/hirer/events");
    revalidatePath("/dashboard/artist/events");
    return { success: true };
  } catch (error) {
    console.error("[deleteEvent] Error:", error);
    throw new Error("Failed to delete event");
  }
}
