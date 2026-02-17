"use client";

import { useState } from "react";
import { FiCopy } from "react-icons/fi";

interface PollCreatedClientProps {
  poll: {
    id: string;
    question: string;
    options: { id: string; text: string }[];
  };
  showVoteButton?: boolean;
}

export default function PollCreatedClient({
  poll,
  showVoteButton = false,
}: PollCreatedClientProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/poll/${poll.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Poll Question */}
      <p className="text-lg font-semibold text-gray-900">{poll.question}</p>

      {/* Options (no votes) */}
      <div className="space-y-2">
        {poll.options.map((opt) => (
          <div
            key={opt.id}
            className="border border-gray-200 rounded-lg p-3 text-gray-900"
          >
            {opt.text}
          </div>
        ))}
      </div>

      {/* Shareable Link */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={`${window.location.origin}/poll/${poll.id}`}
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

      {/* Action Buttons */}
      {showVoteButton && (
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => (window.location.href = `/poll/${poll.id}`)}
          >
            Vote Now
          </button>
          <button
            className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => (window.location.href = `/poll/${poll.id}/results`)}
          >
            View Analytics
          </button>
        </div>
      )}
    </div>
  );
}
