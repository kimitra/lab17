'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ profileId }){
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this profile?")) {
            return;
        }

        setIsDeleting(true);
        setError("");

        try {
            const response = await fetch(`/api/profiles/${profileId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete profile");
            }
            router.push("/");
            router.refresh();
        } catch (err) {
            setError(err.message || "Failed to delete profile");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
            <button 
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ backgroundColor: "red", color: "white", padding: "10px", border: "none", cursor: "pointer" }}>
                {isDeleting ? "Deleting..." : "Delete Profile"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}