'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import "./logout.css";

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
        <button
            onClick={handleLogout}
            disabled={loading}
            className="icon-button logout-button"
            aria-label={loading ? "Logging out..." : "Logout"}
            title="Logout"
        >
            {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
                <FontAwesomeIcon icon={faSignOutAlt} />
            )}
        </button>
    );
}