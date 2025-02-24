"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginOrRegister from "../Components/LoginOrRegister";
import "../Components/this.css";

function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }
      router.push("/chat");
    } catch (err) {
      setError("bocs nincs szero");
    }
  };

  return (
    <LoginOrRegister>
      <h1>Login</h1>
      {error && <p className="errorMessage">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="inputContainer">
          <i className="fa fa-user"></i>
          <input type="text" name="username" placeholder="Username" required />
        </div>
        <div className="inputContainer">
          <i className="fa fa-lock"></i>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        dont have an account? <a href="/register">Register Here</a>
      </p>
    </LoginOrRegister>
  );
}

export default Login;
