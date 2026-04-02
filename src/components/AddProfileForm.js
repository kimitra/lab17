"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/add-profile/AddProfile.module.css";

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s) =>
  String(s ?? "")
    .trim()
    .replace(/\s+/g, " ");

export default function AddProfileForm({ existingProfile = {} }) {
  const router = useRouter();
  const nameRef = useRef(null);
  const isEditMode = Boolean(existingProfile && existingProfile.id);

  const [values, setValues] = useState({
    name: existingProfile?.name || "",
    title: existingProfile?.title || "",
    email: existingProfile?.email || "",
    bio: existingProfile?.bio || "",
    img: null,
    imgPreview: existingProfile?.image_url || "",
  });

  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { name, title, email, bio, img, imgPreview } = values;

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "img") {
      const file = files[0];

      if (file && file.size < 1024 * 1024) {
        setValues((prev) => ({
          ...prev,
          img: file,
          imgPreview: URL.createObjectURL(file),
        }));
        setErrors("");
      } else if (file) {
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
    } else if (imgPreview) {
      formData.append("image_url", imgPreview);
    }

    const endpoint = isEditMode
      ? `/api/profiles/${existingProfile.id}`
      : "/api/profiles";

    const method = isEditMode ? "PUT" : "POST";

    console.log("Submitting to:", endpoint, method);

    const response = await fetch(endpoint, {
      method,
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Server returned non-JSON response: ${text.slice(0, 120)}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit form");
    }

    setSuccess(isEditMode ? "Profile updated successfully!" : "Profile added successfully!");

    if (!isEditMode) {
      setValues({
        name: "",
        title: "",
        email: "",
        bio: "",
        img: null,
        imgPreview: "",
      });
    }

    const fileInput = document.getElementById("img");
    if (fileInput) fileInput.value = "";

    setTimeout(() => {
      setSuccess("");
      router.push("/");
      router.refresh();
    }, 1500);
  } catch (error) {
    setErrors(error.message || "Failed to submit form");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className={styles["add-profile"]}>
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
        placeholder="Add Bio..."
        required
        value={bio}
        onChange={onChange}
      ></textarea>

      <label htmlFor="img">Image:</label>
      <input
        type="file"
        name="img"
        id="img"
        required={!isEditMode}
        accept="image/png, image/jpeg, image/jpg, image/gif"
        onChange={onChange}
      />

      {imgPreview && (
        <figure style={{ display: "flex", justifyContent: "center" }}>
          <img src={imgPreview} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
        </figure>
      )}

      {errors && <p className={styles.errorMessage}>{errors}</p>}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          !stripTags(trimCollapse(name)) ||
          !stripTags(trimCollapse(title)) ||
          !stripTags(trimCollapse(email)) ||
          !stripTags(bio).trim() ||
          (!img && !imgPreview)
        }
      >
        {isEditMode ? "Update Profile" : "Add Profile"}
      </button>

      {success && <p className={styles.successMessage}>{success}</p>}
    </form>
  );
}