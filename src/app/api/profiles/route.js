import prisma from "@/app/lib/prisma";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get("title") || "";
    const search = searchParams.get("search") || "";

    const profiles = await prisma.profiles.findMany({
      where: {
        ...(title && {
          title: { contains: title, mode: "insensitive" },
        }),
        ...(search && {
          name: { contains: search, mode: "insensitive" },
        }),
      },
      orderBy: {
        id: "desc",
      },
    });

    return Response.json({ data: profiles }, { status: 200 });
  } catch (error) {
    console.error("GET /api/profiles error:", error);
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

    if (!name || String(name).trim() === "") {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    if (!title || String(title).trim() === "") {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    if (!email || String(email).trim() === "") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    if (!bio || String(bio).trim() === "") {
      return Response.json({ error: "Bio is required" }, { status: 400 });
    }

    if (!imgFile || typeof imgFile === "string" || imgFile.size === 0) {
      return Response.json({ error: "Image is required" }, { status: 400 });
    }

    if (imgFile.size > 1024 * 1024) {
      return Response.json(
        { error: "Image must be less than 1MB" },
        { status: 400 }
      );
    }

    const blob = await put(imgFile.name, imgFile, {
      access: "public",
      allowOverwrite: true,
    });

    const created = await prisma.profiles.create({
      data: {
        name: String(name).trim(),
        title: String(title).trim(),
        email: String(email).trim(),
        bio: String(bio).trim(),
        image_url: blob.url,
      },
    });

    return Response.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/profiles error:", error);

    if (error.code === "P2002") {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    return Response.json({ error: "Failed to create profile" }, { status: 500 });
  }
}