import Link from "next/link";
import prisma from "@/app/lib/prisma";
import styles from "./page.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProfileDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const profile = await prisma.profiles.findUnique({
    where: { id: parseInt(id) },
  });

  if (!profile) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p className={styles.notFound}>Profile not found.</p>
          <Link href="/" className={styles.backLink}>
            ← Go Back
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Go Back
        </Link>

        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <img
              src={profile.image_url || "/vercel.svg"}
              alt={profile.name}
              className={styles.image}
            />
          </div>

          <h1 className={styles.name}>{profile.name}</h1>

          <div className={styles.info}>
            <p>
              <span className={styles.label}>Title:</span> {profile.title}
            </p>
            <p>
              <span className={styles.label}>Email:</span> {profile.email}
            </p>
          </div>

          <div className={styles.bioSection}>
            <h2 className={styles.bioHeading}>Bio</h2>
            <p className={styles.bio}>{profile.bio}</p>
          </div>

          <div className={styles.buttonRow}>
            <Link href={`/profile/${profile.id}/edit`} className={styles.editButton}>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}