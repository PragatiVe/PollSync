import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, options } = body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: "Question and at least 2 options are required" },
        { status: 400 }
      );
    }

    const cleanedOptions = options.filter((o: string) => o.trim() !== "");

    if (cleanedOptions.length < 2) {
      return NextResponse.json(
        { error: "Options cannot be empty" },
        { status: 400 }
      );
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        options: {
          create: cleanedOptions.map((text: string) => ({
            text,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error("CREATE POLL ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
