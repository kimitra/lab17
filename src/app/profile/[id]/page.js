import prisma from "@/app/lib/prisma";
import Link from "next/link";

export const runtime = "nodejs";

export default async function ProfileDetail({ params }) {
  const id = Number(params.id);

  const profile = await prisma.profiles.findUnique({
    where: { id },
  });

  if (!profile) {
    return (
      <main style={{ padding: "40px 20px" }}>
        <h1>Profile not found</h1>
        <Link href="/">Go Back</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px" }}>
      <Link href="/">← Go Back</Link>

      <div
        style={{
          maxWidth: "700px",
          margin: "20px auto",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "24px",
          background: "#fff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={profile.image_url}
            alt={profile.name}
            style={{
              width: "140px",
              height: "140px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>

        <h1>{profile.name}</h1>
        <p><strong>Title:</strong> {profile.title}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Bio:</strong> {profile.bio}</p>
      </div>
    </main>
  );
}