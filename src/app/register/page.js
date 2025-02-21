"use client";

import { useState } from "react";
import LoginOrRegister from "../Components/LoginOrRegister";
import "../Components/this.css";

function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  async function handleRegister(e) {
    e.preventDefault();

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Failed to register:", error);
    }
  }

  return (
    <>
      <LoginOrRegister>
        <h1>Sign Up</h1>
        <form onSubmit={handleRegister}>
          <div className="inputContainer">
            <i className="fa fa-user"></i>
            <input
              type="text"
              id="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputContainer">
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
          <div className="inputContainer">
            <i className="fa fa-envelope"></i>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputContainer">
            <i className="fa fa-lock"></i>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputContainer">
            <i className="fa fa-lock"></i>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login Here</a>
        </p>
      </LoginOrRegister>
    </>
  );
}

export default Register;
