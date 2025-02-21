import Link from "next/link";
import "./page.module.css";

export default function Home() {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link href="/login">
        <button>Go To Login</button>
      </Link>
      <Link href="/register">
        <button>Go To Register</button>
        <button>asd</button>
      </Link>
    </div>
  );
}

