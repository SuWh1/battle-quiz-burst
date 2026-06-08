import { createServerFn } from "@tanstack/react-start";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type QuizQuestion = {
  q: string;
  options: [string, string, string, string];
  correct: number;
};

export type SavedQuiz = {
  id: string;
  title: string;
  createdAt: string;
  questions: QuizQuestion[];
};

type QuestionRow = {
  quiz_id: string;
  quiz_title: string;
  created_at: string;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  correct_index: number;
  order_index: number;
};

export const getQuizzes = createServerFn({ method: "GET" }).handler(
  async (): Promise<SavedQuiz[]> => {
    const { data, error } = await supabaseAdmin
      .from("questions")
      .select("quiz_id, quiz_title, created_at, question_text, option_1, option_2, option_3, option_4, correct_index, order_index")
      .order("quiz_id", { ascending: false })
      .order("order_index", { ascending: true });

    if (error) throw new Error(error.message);

    const quizzes = new Map<string, SavedQuiz & { rows: QuestionRow[] }>();

    for (const row of (data ?? []) as QuestionRow[]) {
      const existingQuiz = quizzes.get(row.quiz_id);
      const quiz =
        existingQuiz ??
        ({
          id: row.quiz_id,
          title: row.quiz_title,
          createdAt: row.created_at,
          questions: [],
          rows: [],
        } satisfies SavedQuiz & { rows: QuestionRow[] });

      if (row.created_at > quiz.createdAt) quiz.createdAt = row.created_at;
      quiz.rows.push(row);
      quiz.rows.sort((a, b) => a.order_index - b.order_index);
      quiz.questions = quiz.rows.map((questionRow) => ({
        q: questionRow.question_text,
        options: [
          questionRow.option_1,
          questionRow.option_2,
          questionRow.option_3,
          questionRow.option_4,
        ],
        correct: questionRow.correct_index,
      }));


      quizzes.set(row.quiz_id, quiz);
    }

    return Array.from(quizzes.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(({ rows, ...quiz }) => quiz);
  },
);
