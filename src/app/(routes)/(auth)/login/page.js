"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from '@/app/styles/auth.module.css';

export default function Login() {
  // Define state variables
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Successful login
      router.push("/chat"); // or wherever you want to redirect after login

    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.box}>
      <h1>Login</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email or Phone Number"
          className={styles.input}
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="submit"
          value="Login"
          className={styles.submitButton}
        />
      </form>
      <div className={styles.link}>
        Need an account? <a href="/register" className={styles.authLink}>Register</a>
      </div>
    </div>
  );
}