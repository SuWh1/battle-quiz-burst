import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { QuizQuestion } from "@/lib/questions.functions";

const generatedQuizSchema = z.object({
  questions: z
    .array(
      z.object({
        q: z.string().min(1),
        options: z.tuple([
          z.string().min(1),
          z.string().min(1),
          z.string().min(1),
          z.string().min(1),
        ]),
        correct: z.number().int().min(0).max(3),
      }),
    )
    .min(1)
    .max(10),
});

export const generateQuizQuestions = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().trim().min(2).max(120),
      count: z.number().int().min(3).max(10).default(5),
    }),
  )
  .handler(async ({ data }): Promise<QuizQuestion[]> => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY. Add it locally and in Vercel Environment Variables.");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: [
                    `Create ${data.count} multiple-choice quiz questions about: ${data.topic}.`,
                    "Use Russian language.",
                    "Each question must have exactly 4 options.",
                    "Only one option must be correct.",
                    "Return only valid JSON with this shape:",
                    '{"questions":[{"q":"question","options":["a","b","c","d"],"correct":0}]}',
                  ].join("\n"),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText.slice(0, 300)}`);
    }

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof text !== "string") {
      throw new Error("Gemini API returned no quiz text.");
    }

    const parsed = generatedQuizSchema.parse(JSON.parse(text));

    return parsed.questions;
  });
