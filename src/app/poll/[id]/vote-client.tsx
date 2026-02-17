"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VoteClient({ poll }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleVote = async () => {
    if (!selected) return;

    setSubmitting(true);
    try {
      console.log("Voting for option:", selected);
      await fetch(`/api/poll/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selected }),
      });

      router.push(`/poll/${poll.id}/results`);
    } catch (err) {
      console.error("Vote submission failed:", err);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Vote on this Poll
        </h1>

        {/* QUESTION */}
        <p className="text-lg md:text-xl font-semibold text-gray-900 leading-snug mb-4">
          {poll.question}
        </p>

        {/* OPTIONS */}
        <div className="space-y-3">
          {poll.options.map((opt: any) => {
            const active = selected === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition
                ${
                  active
                    ? "border-indigo-600"
                    : "border-gray-200 hover:border-indigo-400"
                }`}
              >
                <span className="text-gray-800 font-medium">{opt.text}</span>

                {/* RADIO */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${active ? "border-indigo-600" : "border-gray-300"}`}
                >
                  {active && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* NOTE */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Results are hidden until you vote.
        </p>

        {/* SUBMIT BUTTON */}
        <button
          disabled={!selected || submitting}
          onClick={handleVote}
          className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition"
        >
          {submitting ? "Submitting..." : "Submit Your Vote"}
        </button>
      </div>
    </div>
  );
}
