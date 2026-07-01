"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const alreadySignedUp = localStorage.getItem("adminSignedUp");
    if (alreadySignedUp === "true") {
      router.push("/admin/signin");
    }
  }, []);

  const handleSignup = async () => {
    const res = await fetch("/api/admin/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful!");
      localStorage.setItem("adminSignedUp", "true");
      router.push("/admin/signin");
    } else {
      alert(data.error || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Sign-Up</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-700 bg-gray-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 border border-gray-700 bg-gray-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
          onClick={handleSignup}
        >
          Sign Up
        </button>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a className="text-blue-400" onClick={() => router.push("/admin/signin")}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}