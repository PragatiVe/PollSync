// app/api/poll/[id]/vote/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { optionId } = await req.json();

  if (!optionId) {
    return NextResponse.json({ error: "Option ID required" }, { status: 400 });
  }

  const { error } = await supabase.rpc("increment_poll_option_votes", {
    p_option_id: optionId,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
