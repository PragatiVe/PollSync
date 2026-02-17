import { notFound } from "next/navigation";
import ResultsClient from "./results-client";

async function getPoll(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/poll/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

// Server Component
export default async function PollResultsPage({ params }: { params: { id: string } }) {
  const {id}  = await params; 
  const poll = await getPoll(id);

  if (!poll) return notFound();

  return <ResultsClient poll={poll} />;
}
