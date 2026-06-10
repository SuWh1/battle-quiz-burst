import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type Feedback = {
  id: string;
  rating: number;
  improvement: string;
  createdAt: string;
};

type FeedbackRow = {
  id: string;
  rating: number;
  improvement: string | null;
  created_at: string;
};

const feedbackTable = supabaseAdmin as unknown as {
  from: (table: string) => {
    insert: (values: unknown) => { select: (columns: string) => { single: () => Promise<{ data: FeedbackRow | null; error: { message: string } | null }> } };
    select: (columns: string) => { order: (column: string, options: { ascending: boolean }) => Promise<{ data: FeedbackRow[] | null; error: { message: string } | null }> };
  };
};

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  improvement: z.string().trim().max(1000).default(""),
});

const mapFeedback = (row: FeedbackRow): Feedback => ({
  id: row.id,
  rating: row.rating,
  improvement: row.improvement ?? "",
  createdAt: row.created_at,
});

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator(feedbackSchema)
  .handler(async ({ data }): Promise<Feedback> => {
    const { data: row, error } = await feedbackTable
      .from("отзывы")
      .insert({
        rating: data.rating,
        improvement: data.improvement,
      })
      .select("id, rating, improvement, created_at")
      .single();

    if (error) throw new Error(error.message);
    if (!row) throw new Error("Отзыв не был сохранён.");

    return mapFeedback(row);
  });

export const getFeedback = createServerFn({ method: "GET" }).handler(
  async (): Promise<Feedback[]> => {
    const { data, error } = await feedbackTable
      .from("отзывы")
      .select("id, rating, improvement, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map(mapFeedback);
  },
);
