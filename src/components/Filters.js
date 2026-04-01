"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Filters({ titles = [], title = "", search = "" }) {
  const router = useRouter();
  const params = useSearchParams();

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const query = new URLSearchParams(params.toString());

    if (newTitle) {
      query.set("title", newTitle);
    } else {
      query.delete("title");
    }

    router.push(`/?${query.toString()}`);
  };

  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    const query = new URLSearchParams(params.toString());

    if (newSearch) {
      query.set("search", newSearch);
    } else {
      query.delete("search");
    }

    router.push(`/?${query.toString()}`);
  };

  const handleReset = () => {
    router.push("/");
  };

  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <select value={title} onChange={handleTitleChange}>
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
        onChange={handleSearchChange}
      />

      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}