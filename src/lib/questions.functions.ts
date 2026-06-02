import { createServerFn } from "@tanstack/react-start";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type QuizQuestion = {
  q: string;
  options: [string, string, string, string];
  correct: number;
};

export const getQuestions = createServerFn({ method: "GET" }).handler(
  async (): Promise<QuizQuestion[]> => {
    const { data, error } = await supabaseAdmin
      .from("questions")
      .select("question_text, option_1, option_2, option_3, option_4, correct_index, order_index")
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      q: row.question_text,
      options: [row.option_1, row.option_2, row.option_3, row.option_4],
      correct: row.correct_index,
    }));
  },
);