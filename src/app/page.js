import styles from "./page.module.css";
import Link from "next/link";
import Filters from "@/components/Filters";
import prisma from "@/app/lib/prisma";

export const runtime = "nodejs";

async function fetchTitles() {
  const data = await prisma.profiles.findMany({
    distinct: ["title"],
    select: { title: true },
    orderBy: { title: "asc" },
  });

  return data ? data.map((t) => t.title) : [];
}

async function getData({ title, search }) {
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

  return profiles;
}

export default async function Home({ searchParams }) {
  const selectedTitle = searchParams?.title || "";
  const search = searchParams?.search || "";

  const [titles, profiles] = await Promise.all([
    fetchTitles(),
    getData({ title: selectedTitle, search }),
  ]);

  return (
    <main className={styles.main}>
      <div className="section">
        <div className="container">
          <div className={styles.topBar}>
            <h1>Profile App</h1>
            <Link className={styles.addButton} href="/add-profile">
              Add Profile
            </Link>
          </div>

          <Filters titles={titles} title={selectedTitle} search={search} />

          {profiles.length === 0 ? (
            <p>No profiles found.</p>
          ) : (
            <div className={styles.grid}>
              {profiles.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/profile/${profile.id}`}
                  className={styles.cardLink}
                >
                  <div className={styles.profileCard}>
                    <div className={styles.profileCardImage}>
                      <img
                        src={profile.image_url || "/vercel.svg"}
                        alt={profile.name}
                      />
                    </div>

                    <div className={styles.profileCardContent}>
                      <p>{profile.name}</p>
                      <p>{profile.title}</p>
                      <p>{profile.email}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}