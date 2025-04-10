"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/auth.module.css";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/chat");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.box}>
      <h1>{t("login")}</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder={t("emailOrPhone")}
          className={styles.input}
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder={t("password")}
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
        />
        <input type="submit" value={t("login")} className={styles.submitButton} />
      </form>
      <div className={styles.link}>
        {t("dontHaveAccount")} <a href="/register" className={styles.authLink}>{t("signUpHere")}</a>
      </div>
    </div>
  );
}
