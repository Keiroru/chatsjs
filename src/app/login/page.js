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
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
      <div className="wave-holder">
        <div className="wave">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="box">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {error && <p className="errorMessage">{error}</p>}
          <input
            type="text"
            name="email"
            placeholder="Email or Phone Number"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <p className="forgot-password">
            <a href="/recoverPass">Forgot your password?</a>
          </p>
          <input type="submit" value="Login" />
        </form>

        <p className="register">
          Don't have an account yet? <a href="/register">Sign up here</a>
        </p>
      </div>
    </LoginOrRegister>
  );
}

export default Login;
