"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import styles from "./AuthForm.module.css";

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+>/g, "");

export default function AuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (callbackUrl !== "/") {
      setStatusMessage("Please sign in to continue");
    }
  }, [callbackUrl]);

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    setErrors("");
    setData({ email: "", password: "" });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setIsSubmitting(true);

    const email = stripTags(data.email);
    const password = stripTags(data.password);

    try {
      if (isLogin) {
        await signIn("credentials", {
          redirect: true,
          callbackUrl,
          email,
          password,
        });
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to register");
        }

        await signIn("credentials", {
          redirect: true,
          callbackUrl,
          email,
          password,
        });
      }
    } catch (error) {
      setErrors(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        {isLogin ? "Sign In" : "Register"}
      </h1>

      {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>

        {errors && <p className={styles.error}>{errors}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !data.email || !data.password}
        >
          {isSubmitting ? "Submitting..." : isLogin ? "Sign In" : "Register"}
        </button>
      </form>

      <div className={styles.oauthDivider}>
        <span>or continue with</span>
      </div>

      <div className={styles.oauthButtons}>
        <button
          type="button"
          className={styles.oauthButton}
          onClick={() => signIn("github", { callbackUrl })}
        >
          Sign in with GitHub
        </button>

        <button
          type="button"
          className={styles.oauthButton}
          onClick={() => signIn("google", { callbackUrl })}
        >
          Sign in with Google
        </button>
      </div>

      <div className={styles.toggle}>
        <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
        <button type="button" onClick={handleToggle}>
          {isLogin ? "Register" : "Sign In"}
        </button>
      </div>
    </>
  );
}