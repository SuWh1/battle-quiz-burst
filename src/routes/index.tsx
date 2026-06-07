import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { generateQuizQuestions } from "@/lib/ai-quiz.functions";
import { getQuestions } from "@/lib/questions.functions";

const questionsQueryOptions = queryOptions({
  queryKey: ["questions"],
  queryFn: () => getQuestions(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quiz Battle — Игра-викторина" },
      { name: "description", content: "Quiz Battle — яркая игра-викторина. Сражайся, отвечай на вопросы и побеждай!" },
      { property: "og:title", content: "Quiz Battle" },
      { property: "og:description", content: "Яркая игра-викторина в стиле игрового шоу." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(questionsQueryOptions),
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground">
      <div>
        <h1 className="text-3xl font-black">Не удалось загрузить вопросы</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
      </div>
    </main>
  ),
  component: Index,
});

function Index() {
  const { data: questions } = useSuspenseQuery(questionsQueryOptions);

  const [screen, setScreen] = useState<"start" | "quiz" | "end">("start");
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const startGame = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setLocked(false);
    setScreen("quiz");
  };

  const returnToMenu = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setLocked(false);
    setGenerationError(null);
    setScreen("start");
  };

  const generateTopicQuiz = async () => {
    setGenerationError(null);
    setIsGenerating(true);
    try {
      const generatedQuestions = await generateQuizQuestions({
        data: { topic, count: 5 },
      });
      setActiveQuestions(generatedQuestions);
      setCurrent(0);
      setScore(0);
      setSelected(null);
      setLocked(false);
      setScreen("quiz");
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Не удалось создать викторину.");
    } finally {
      setIsGenerating(false);
    }
  };

  const useDatabaseQuestions = () => {
    if (questions.length === 0) {
      setGenerationError("В базе пока нет вопросов. Создайте викторину через AI или добавьте вопросы в Supabase.");
      return;
    }
    setActiveQuestions(questions);
    startGame();
  };

  const handleAnswer = (idx: number) => {
    if (locked) return;
    setLocked(true);
    setSelected(idx);
    const isCorrect = idx === activeQuestions[current].correct;
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= activeQuestions.length) {
        setScreen("end");
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setLocked(false);
      }
    }, 1000);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-background px-6 py-12 text-foreground">

      {screen === "start" && (
        <>
          <header className="mt-8 text-center">
            <h1 className="font-display text-6xl font-normal tracking-tight text-foreground sm:text-7xl md:text-8xl">
              Quiz Battle
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              Сражайся за звание чемпиона викторины
            </p>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-sm">
              <label htmlFor="topic" className="text-sm font-medium text-card-foreground">
                Создать викторину с AI
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="topic"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="Например: космос, футбол, JavaScript"
                  className="min-h-12 flex-1 rounded-md border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                />
                <button
                  type="button"
                  disabled={isGenerating || topic.trim().length < 2}
                  onClick={generateTopicQuiz}
                  className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? "Создаю..." : "Создать"}
                </button>
              </div>
              {generationError && (
                <p className="mt-3 text-sm text-destructive">{generationError}</p>
              )}
            </div>
            <button
              type="button"
              onClick={useDatabaseQuestions}
              disabled={questions.length === 0}
              className="rounded-md bg-primary px-12 py-5 text-base font-medium tracking-wide text-primary-foreground shadow-sm transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring sm:px-16 sm:py-6 sm:text-lg"
            >
              Играть с вопросами из базы
            </button>
            {questions.length === 0 && (
              <p className="max-w-md text-center text-sm text-muted-foreground">
                В базе пока нет вопросов. AI-викторина всё равно может работать.
              </p>
            )}
          </div>

          <footer className="text-sm text-muted-foreground">© Quiz Battle</footer>
        </>
      )}

      {screen === "quiz" && (
        <div className="flex w-full max-w-3xl flex-1 flex-col">
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={returnToMenu}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary"
            >
              ← Другая викторина
            </button>
            <div className="text-right">
            <div className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Вопрос {current + 1} из {activeQuestions.length}
            </div>
              <div className="mt-2 text-sm text-muted-foreground">Счёт: <span className="font-medium text-foreground">{score}</span></div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="mx-auto mt-3 h-2 w-full max-w-md overflow-hidden rounded-full bg-secondary ring-1 ring-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${((current + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8">
            <h2 className="font-display max-w-2xl text-center text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {activeQuestions[current].q}
            </h2>

            <div className="flex w-full max-w-xl flex-col gap-4">
              {activeQuestions[current].options.map((opt, idx) => {
                const isCorrect = idx === activeQuestions[current].correct;
                let cls =
                  "bg-card text-card-foreground border border-border hover:border-primary/40 hover:bg-secondary";
                if (selected !== null) {
                  if (idx === selected) {
                    cls = isCorrect
                      ? "bg-accent text-accent-foreground border border-accent"
                      : "bg-destructive text-destructive-foreground border border-destructive";
                  } else if (isCorrect) {
                    cls = "bg-accent/40 text-accent-foreground border border-accent/60";
                  } else {
                    cls = "bg-card/50 text-muted-foreground border border-border";
                  }
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={locked}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full rounded-lg px-6 py-4 text-left text-base font-medium transition-colors duration-150 disabled:cursor-not-allowed sm:text-lg ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {screen === "end" && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h2 className="font-display text-5xl font-normal tracking-tight text-foreground sm:text-6xl">
            Игра окончена!
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            Твой счёт:{" "}
            <span className="font-medium text-primary">
              {score} / {activeQuestions.length}
            </span>
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={startGame}
              className="rounded-md bg-primary px-10 py-4 text-base font-medium text-primary-foreground shadow-sm transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              Играть ещё
            </button>
            <button
              type="button"
              onClick={returnToMenu}
              className="rounded-md border border-border bg-card px-10 py-4 text-base font-medium text-card-foreground shadow-sm transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              Выбрать другую тему
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
