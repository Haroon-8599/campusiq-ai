import { NextRequest, NextResponse } from "next/server";
import { runAdmissionPredictor } from "@/lib/predictor";
import { z } from "zod";

const predictorSchema = z.object({
  exam: z.string().min(1),
  rank: z.number().positive(),
  category: z.string().default("General"),
  homeState: z.string().default("Delhi"),
  gender: z.string().default("All"),
  budget: z.number().optional(),
  preferredBranch: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = predictorSchema.parse(body);

    const results = await runAdmissionPredictor(validated);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Predictor API error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to evaluate predictor" }, { status: 500 });
  }
}
