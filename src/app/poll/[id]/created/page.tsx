// app/poll/[id]/created/page.tsx
import PollCreatedClient from "./poll-created-client"; 
import { notFound } from "next/navigation";

export default async function PollCreatedPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/poll/${id}`, { cache: "no-store" });
  if (!res.ok) return notFound();

  const poll = await res.json();

  if (!poll || !poll.options) return notFound();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <PollCreatedClient poll={poll} showVoteButton={true} />
      </div>
    </div>
  );
}
