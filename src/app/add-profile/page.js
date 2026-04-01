"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./AddProfile.module.css";

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s) =>
  String(s ?? "")
    .trim()
    .replace(/\s+/g, " ");

export default function AddProfile() {
  const router = useRouter();
  const nameRef = useRef(null);

  const [values, setValues] = useState({
    name: "",
    title: "",
    email: "",
    bio: "",
    img: null,
  });

  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, title, email, bio, img } = values;

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "img") {
      const file = files?.[0];

      if (!file) {
        setValues((prev) => ({ ...prev, img: null }));
        return;
      }

      if (file.size <= 1024 * 1024) {
        setValues((prev) => ({ ...prev, img: file }));
        setErrors("");
      } else {
        setErrors("Image size should be less than 1MB");
      }
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", stripTags(trimCollapse(name)));
      formData.append("title", stripTags(trimCollapse(title)));
      formData.append("email", stripTags(trimCollapse(email)));
      formData.append("bio", stripTags(bio).trim());

      if (img) {
        formData.append("img", img);
      }

      const response = await fetch("/api/profiles", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      setSuccess("Profile added successfully!");
      setValues({
        name: "",
        title: "",
        email: "",
        bio: "",
        img: null,
      });

      const fileInput = document.getElementById("img");
      if (fileInput) fileInput.value = "";

      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      setErrors(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="section">
        <div className="container">
          <h1>Add Profile</h1>

          <div className={styles.addProfile}>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name:</label>
              <input
                ref={nameRef}
                type="text"
                name="name"
                id="name"
                required
                value={name}
                onChange={onChange}
              />

              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={title}
                onChange={onChange}
              />

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={onChange}
              />

              <label htmlFor="bio">Bio:</label>
              <textarea
                name="bio"
                id="bio"
                placeholder="Add bio..."
                required
                value={bio}
                onChange={onChange}
              />

              <label htmlFor="img">Image:</label>
              <input
                type="file"
                name="img"
                id="img"
                required
                accept="image/png, image/jpeg, image/jpg, image/gif"
                onChange={onChange}
              />

              {errors && <p className={styles.errorMessage}>{errors}</p>}
              {success && <p className={styles.successMessage}>{success}</p>}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !stripTags(trimCollapse(name)) ||
                  !stripTags(trimCollapse(title)) ||
                  !stripTags(trimCollapse(email)) ||
                  !stripTags(bio).trim() ||
                  !img
                }
              >
                {isSubmitting ? "Submitting..." : "Add Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}