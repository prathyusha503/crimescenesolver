"use client";

import { useState, useEffect } from "react";
import TypingText from "./components/TypingText"; // Adjust path if needed
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <Page1 />
  );
}

function Page1() {
  return (
    <div className="flex flex-col h-screen w-screen bg-black justify-center items-center relative overflow-hidden">

      <div className="absolute left-[25rem] bottom-[4rem] z-10">
        <img
          src="/videos/walking.gif"
          alt="Detective"
          className=""
        />
      </div>

      <div>
        <TypingText text="Hello from the detective" speed={50} />
        <button className="fixed bottom-30 right-140 bg-gray-500 text-white px-4 py-2 rounded">
          <a href="/page2">Next</a>
        </button>
      </div>
    </div>
  );
}
