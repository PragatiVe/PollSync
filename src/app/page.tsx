"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiRadio } from "react-icons/fi";

export default function Home() {
  const router = useRouter();
  const [pollCode, setPollCode] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    let code = pollCode.trim();
    if (!code) return;
  
    try {
      const url = new URL(code);
      const pathParts = url.pathname.split("/");
      const pollIndex = pathParts.findIndex((part) => part === "poll");
      if (pollIndex !== -1 && pathParts[pollIndex + 1]) {
        code = pathParts[pollIndex + 1];
      }
    } catch (err) {

    }
  
    setJoining(true);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/poll/${code}`);
      if (!res.ok) throw new Error("Poll not found");
  
      router.push(`/poll/${code}`);
    } catch (err) {
      alert("Poll not found. Please check your code or link.");
      setJoining(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        
        {/* Create Poll */}
        <div
          onClick={() => router.push("/create-poll")}
          className="flex-1 flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-indigo-600 hover:shadow-indigo-200 transition-all duration-300 cursor-pointer"
        >
          <FiPlus size={48} className="text-indigo-600 mb-4" />

          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Start a Poll
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Set questions, add options, and share instantly.
          </p>

          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition">
            Create Poll
          </button>
        </div>

        {/* Join Room */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-indigo-600 hover:shadow-indigo-200 transition-all duration-300">
          
          <FiRadio size={48} className="text-indigo-600 mb-4" />

          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Join Room
          </h2>

          <p className="text-gray-600 text-center mb-4">
            Join a poll instantly—just enter the code or link.
          </p>

          <div className="flex gap-2 w-full max-w-xs">
            <input
              type="text"
              placeholder="Enter code or paste poll link"
              value={pollCode}
              onChange={(e) => setPollCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
            />

            <button
              onClick={handleJoin}
              disabled={joining}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              {joining ? "Joining..." : "Join"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
