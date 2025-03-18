"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginOrRegister from "../Components/LoginOrRegister";
import "../Components/this.css";

function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  async function handleRegister(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors([{ msg: "Passwords do not match", path: "confirmPassword" }]);
      return;
    }

    const data = {
      displayName: formData.displayName,
      email: formData.email,
      password: formData.password,
      telephone: formData.telephone,
    };

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors(result.errors || [{ msg: "Registration failed" }]);
      } else {
        router.push("/login");
        setErrors([]);
      }
    } catch (error) {
      console.error("Failed to register:", error);
      setErrors([{ msg: "An unexpected error occurred", path: "general" }]);
    }
  }

  const filteredErrors = errors.reduce(
    (acc, err) => {
      if (typeof err === "object" && err.path) {
        if (!acc.fields.has(err.path)) {
          acc.fields.add(err.path);
          acc.list.push(err);
        }
      } else {
        acc.list.push(err);
      }
      return acc;
    },
    { fields: new Set(), list: [] }
  ).list;

  const errorMap = {};
  filteredErrors.forEach((err) => {
    if (typeof err === "object" && err.path && !errorMap[err.path]) {
      errorMap[err.path] = err.msg;
    }
  });

  return (
    <>
      <LoginOrRegister>
        <div className="box">
          <h1>Sign Up</h1>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              id="displayName"
              placeholder="Display Name*"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
            {errorMap.displayName && (
              <p className="errorMessage">{errorMap.displayName}</p>
            )}
            <input
              type="email"
              id="email"
              placeholder="Email*"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errorMap.email && <p className="errorMessage">{errorMap.email}</p>}
            <input
              type="text"
              id="telephone"
              placeholder="Phone Number"
              autoComplete="tel"
              value={formData.telephone}
              onChange={handleChange}
            />
            <input
              type="password"
              id="password"
              placeholder="Password*"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errorMap.password && (
              <p className="errorMessage">{errorMap.password}</p>
            )}
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password*"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errorMap.confirmPassword && (
              <p className="errorMessage">{errorMap.confirmPassword}</p>
            )}
            <p className="required">
              * fields are required
            </p>
            <input type="submit" value="Sign Up" />
          </form>
          <p className="link">
            Already have an account? <a href="/login">Login Here</a>
          </p>
        </div>
      </LoginOrRegister>
    </>
  );
}

export default Register;
