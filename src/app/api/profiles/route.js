import { put } from "@vercel/blob";
import prisma from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profiles = await prisma.profiles.findMany({
      orderBy: { id: "desc" },
    });

    return Response.json({ data: profiles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return Response.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name");
    const title = formData.get("title");
    const email = formData.get("email");
    const bio = formData.get("bio");
    const imgFile = formData.get("img");

    if (!name || !title || !email || !bio) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    let imageUrl = "";

    if (imgFile && imgFile.size > 0) {
      if (imgFile.size > 1024 * 1024) {
        return Response.json({ error: "Image must be less than 1MB" }, { status: 400 });
      }

      const blob = await put(imgFile.name, imgFile, {
        access: "public",
      });

      imageUrl = blob.url;
    }

    const newProfile = await prisma.profiles.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        bio: bio.trim(),
        image_url: imageUrl,
      },
    });

    return Response.json({ data: newProfile }, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);

    if (error.code === "P2002") {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    return Response.json({ error: "Failed to create profile" }, { status: 500 });
  }
}