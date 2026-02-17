import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { optionId } = await req.json();

  if (!optionId) {
    return NextResponse.json({ error: "Option ID required" }, { status: 400 });
  }

  const { error } = await supabase.rpc("increment_poll_option_votes", {
    p_option_id: optionId,
  });

  if (error) {
    console.error("Vote failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
