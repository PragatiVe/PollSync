"use client";

import { useState, useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  question: string;
  options: PollOption[];
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default function ResultsClient({ poll }: { poll: Poll }) {
  const [pollState, setPollState] = useState<Poll>(poll);
  const [copied, setCopied] = useState(false);

  const totalVotes = pollState.options.reduce((sum, opt) => sum + opt.votes, 0);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVoted = localStorage.getItem(`voted_${poll.id}`);
      if (!hasVoted) {
        // If user hasn't voted, redirect to the voting page
        window.location.href = `/poll/${poll.id}`;
      }
    }
  }, [poll.id]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`${origin}/poll/${poll.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const channel = supabase
      .channel(`poll-${pollState.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "options", filter: `poll_id=eq.${pollState.id}` },
        (payload) => {
          setPollState((prev) => {
            const newOptions = prev.options.map((opt) =>
              opt.id === payload.new.id ? { ...opt, votes: payload.new.votes } : opt
            );
            return { ...prev, options: newOptions };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollState.id]);

  // Sort options by votes
  const sortedOptions = [...pollState.options].sort((a, b) => b.votes - a.votes);
  const leadingVotes = sortedOptions[0]?.votes || 0;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        {/* HEADER */}
        <div className="flex justify-center items-center gap-2 mb-4 relative">
          <h1 className="text-2xl font-bold text-indigo-600 text-center">Poll Results</h1>
          <div className="absolute right-0 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>

        {/* QUESTION */}
        <p className="text-lg font-semibold text-gray-900 mb-6">{pollState.question}</p>

        {/* OPTIONS */}
        <div className="space-y-3 text-gray-900">
          {sortedOptions.map((opt) => {
            const percent = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
            const isLeader = opt.votes === leadingVotes && leadingVotes !== 0;

            return (
              <div
                key={opt.id}
                className={`relative border-2 rounded-lg p-3 ${isLeader ? "border-indigo-600" : "border-gray-200"}`}
              >
                <div
                  className={`absolute left-0 top-0 h-full bg-indigo-100 rounded-l-lg ${percent === 100 ? "rounded-r-lg" : ""}`}
                  style={{ width: `${percent}%` }}
                />
                <div className="relative flex justify-between font-medium">
                  <span>{opt.text}</span>
                  <span>{percent}% ({opt.votes})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* TOTAL VOTES */}
        <p className="text-sm text-gray-500 mt-4">Total votes: {totalVotes}</p>

        {/* SHARE LINK */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={`${process.env.NEXT_PUBLIC_BASE_URL}/poll/${pollState.id}`}
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition"
          >
            <FiCopy /> {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        {/* CREATE POLL BUTTON */}
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          Create Your Own Poll
        </button>
      </div>
    </div>
  );
}
