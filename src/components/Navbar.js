"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.brand}>
          Profile App
        </Link>
      </div>

      <div className={styles.right}>
        {status === "loading" ? (
          <span>Loading...</span>
        ) : session ? (
          <>
            <span className={styles.userEmail}>{session.user.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={styles.signOutBtn}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className={styles.signInLink}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}