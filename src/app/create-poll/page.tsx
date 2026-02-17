"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";

export default function CreatePollPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedQuestion = localStorage.getItem("pollQuestion");
    const savedOptions = localStorage.getItem("pollOptions");
    if (savedQuestion) setQuestion(savedQuestion);
    if (savedOptions) setOptions(JSON.parse(savedOptions));
  }, []);
 
  useEffect(() => {
    localStorage.setItem("pollQuestion", question);
    localStorage.setItem("pollOptions", JSON.stringify(options));
  }, [question, options]);

  const duplicates = submitted
    ? options
        .map((o, idx, arr) => (o && arr.indexOf(o) !== idx ? idx : -1))
        .filter((idx) => idx !== -1)
    : [];

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    if (submitted) setError("");
  };

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    if (submitted) setError("");
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) =>
    setOptions(options.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setSubmitted(true);
    const trimmedQuestion = question.trim();
    const trimmedOptions = options.map((o) => o.trim());

    if (trimmedOptions.length < 2) {
      setError("At least two options are required");
      return;
    }

    if (!trimmedQuestion || trimmedOptions.some((o) => !o)) {
      setError("Question and all options must be filled");
      return;
    }

    const optionSet = new Set(trimmedOptions);
    if (optionSet.size !== trimmedOptions.length) {
      setError("Options must be unique");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/create-poll", {
        method: "POST",
        body: JSON.stringify({ question: trimmedQuestion, options: trimmedOptions }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create poll");

      const data = await res.json();
      router.push(`/poll/${data.id}/created`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-10 border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Create a Poll
        </h1>

        {/* Question */}
        <input
          type="text"
          placeholder="Your Question"
          value={question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
        />

        {/* Options */}
        <div className="space-y-3 mb-2">
          {options.map((opt, idx) => (
            <div key={idx} className="group flex gap-2 items-center">
              <input
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  duplicates.includes(idx)
                    ? "border-red-500 ring-red-300"
                    : "border-gray-300 focus:ring-indigo-500"
                } text-gray-900 placeholder-gray-400`}
              />
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(idx)}
                  className="opacity-0 group-hover:opacity-100 p-3 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
                >
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>
          ))}

          {/* Duplicate error shown directly under options */}
          {error === "Options must be unique" && (
            <p className="text-red-600 mt-1 font-medium">{error}</p>
          )}
        </div>

        {/* Add Option */}
        <button
          onClick={addOption}
          className="px-4 py-2 mb-6 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold transition"
        >
          + Add Option
        </button>

        {/* Other general errors */}
        {error && error !== "Options must be unique" && (
          <p className="text-red-600 mb-4 font-medium">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            !question.trim() ||
            options.length < 2 ||
            options.some((o) => !o.trim())
          }
          title={
            !question.trim()
              ? "Enter a question"
              : options.length < 2
              ? "At least two options required"
              : options.some((o) => !o.trim())
              ? "All options must be filled"
              : ""
          }
          className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-semibold transition"
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </div>
    </div>
  );
}

