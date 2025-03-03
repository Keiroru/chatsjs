"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginOrRegister from "../Components/LoginOrRegister";
import "../Components/this.css";

function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      userName: formData.userName,
      displayName: formData.displayName,
      email: formData.email,
      password: formData.password,
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
        <h1>Sign Up</h1>
        <form onSubmit={handleRegister}>
          <div className="input-container">
            <i className="fa fa-user"></i>
            <input
              type="text"
              id="userName"
              placeholder="Username"
              autoComplete="username"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          {errorMap.userName && (
            <p className="errorMessage">{errorMap.userName}</p>
          )}
          <div className="input-container">
            <i className="fa fa-id-card"></i>
            <input
              type="text"
              id="displayName"
              placeholder="Display Name"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>
          {errorMap.displayName && (
            <p className="errorMessage">{errorMap.displayName}</p>
          )}
          <div className="input-container">
            <i className="fa fa-envelope"></i>
            <input
              type="email"
              id="email"
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {errorMap.email && <p className="errorMessage">{errorMap.email}</p>}
          <div className="input-container">
            <i className="fa fa-lock"></i>
            <input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {errorMap.password && (
            <p className="errorMessage">{errorMap.password}</p>
          )}
          <div className="input-container">
            <i className="fa fa-lock"></i>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {errorMap.confirmPassword && (
            <p className="errorMessage">{errorMap.confirmPassword}</p>
          )}
          <button type="submit">Register</button>
        </form>
        <p className="link">
          Already have an account? <a href="/login">Login Here</a>
        </p>
      </LoginOrRegister>
    </>
  );
}

export default Register;
