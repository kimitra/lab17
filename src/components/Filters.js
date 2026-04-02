"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Filters({ titles = [], title = "", search = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value.trim() !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <select
        value={title}
        onChange={(e) => updateParams("title", e.target.value)}
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">All Titles</option>
        {titles.map((t, i) => (
          <option key={i} value={t}>
            {t}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => updateParams("search", e.target.value)}
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          minWidth: "220px",
        }}
      />

      <button
        type="button"
        onClick={() => router.push("/")}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#6c6cff",
          color: "white",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Reset
      </button>
    </div>
  );
}