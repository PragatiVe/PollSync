import { notFound } from "next/navigation";
import VoteClient from "./vote-client";

async function getPoll(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/poll/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const poll = await getPoll(id);

  if (!poll) return notFound();

  return <VoteClient poll={poll} />;
}
