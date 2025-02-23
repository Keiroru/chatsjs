'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        const res = await fetch("/api/logout", { method: "POST" });
        if (res.ok) {
            router.push("/");
        } else {
            console.error("Logout failed");
            setLoading(false);
        }
    };

    return (
        <button onClick={handleLogout} disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
}