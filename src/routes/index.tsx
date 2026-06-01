import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quiz Battle — Игра-викторина" },
      { name: "description", content: "Quiz Battle — яркая игра-викторина. Сражайся, отвечай на вопросы и побеждай!" },
      { property: "og:title", content: "Quiz Battle" },
      { property: "og:description", content: "Яркая игра-викторина в стиле игрового шоу." },
    ],
  }),
  component: Index,
});

function Index() {
  const questions = [
    {
      q: "Какая планета самая большая в Солнечной системе?",
      options: ["Земля", "Юпитер", "Сатурн", "Нептун"],
      correct: 1,
    },
    {
      q: "Сколько естественных спутников у Земли?",
      options: ["0", "1", "2", "3"],
      correct: 1,
    },
    {
      q: "Как называется галактика, в которой мы живём?",
      options: ["Андромеда", "Сомбреро", "Млечный Путь", "Треугольник"],
      correct: 2,
    },
    {
      q: "Кто первым полетел в космос?",
      options: ["Нил Армстронг", "Юрий Гагарин", "Алексей Леонов", "Джон Гленн"],
      correct: 1,
    },
    {
      q: "Какая звезда ближе всего к Земле?",
      options: ["Сириус", "Полярная", "Альфа Центавра", "Солнце"],
      correct: 3,
    },
  ];

  const [screen, setScreen] = useState<"start" | "quiz" | "end">("start");
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

  const handleAnswer = (idx: number) => {
    if (locked) return;
    setLocked(true);
    setSelected(idx);
    const isCorrect = idx === questions[current].correct;
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setScreen("end");
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setLocked(false);
      }
    }, 1000);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />
      </div>

      {screen === "start" && (
        <>
          <header className="mt-8 text-center">
            <h1 className="text-6xl font-black tracking-tight drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)] sm:text-7xl md:text-8xl">
              <span className="bg-gradient-to-b from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                QUIZ BATTLE
              </span>
            </h1>
            <p className="mt-4 text-lg font-medium text-white/80 sm:text-xl">
              Сражайся за звание чемпиона викторины
            </p>
          </header>

          <div className="flex flex-1 items-center justify-center">
            <button
              type="button"
              onClick={startGame}
              className="rounded-full bg-gradient-to-b from-orange-400 via-pink-500 to-fuchsia-600 px-20 py-8 text-3xl font-black tracking-wider text-white shadow-[0_20px_50px_-10px_rgba(236,72,153,0.7),inset_0_-6px_0_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.4)] ring-4 ring-white/20 transition-all duration-200 hover:scale-105 active:translate-y-1 sm:text-4xl md:px-28 md:py-10 md:text-5xl"
            >
              ИГРАТЬ
            </button>
          </div>

          <footer className="text-sm text-white/50">© Quiz Battle</footer>
        </>
      )}

      {screen === "quiz" && (
        <div className="flex w-full max-w-3xl flex-1 flex-col">
          <div className="mt-4 text-center">
            <div className="text-sm font-semibold uppercase tracking-widest text-white/70">
              Вопрос {current + 1} из {questions.length}
            </div>
            <div className="mx-auto mt-3 h-3 w-full max-w-md overflow-hidden rounded-full bg-white/15 ring-1 ring-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-500 transition-all duration-500"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-white/70">Счёт: {score}</div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8">
            <h2 className="max-w-2xl text-center text-3xl font-bold leading-tight text-white drop-shadow-md sm:text-4xl md:text-5xl">
              {questions[current].q}
            </h2>

            <div className="flex w-full max-w-xl flex-col gap-4">
              {questions[current].options.map((opt, idx) => {
                const isCorrect = idx === questions[current].correct;
                let cls =
                  "bg-white/10 hover:bg-white/20 ring-1 ring-white/25 text-white";
                if (selected !== null) {
                  if (idx === selected) {
                    cls = isCorrect
                      ? "bg-green-500 ring-2 ring-green-300 text-white"
                      : "bg-red-500 ring-2 ring-red-300 text-white";
                  } else if (isCorrect) {
                    cls = "bg-green-500/60 ring-1 ring-green-300 text-white";
                  } else {
                    cls = "bg-white/5 ring-1 ring-white/10 text-white/60";
                  }
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={locked}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full rounded-2xl px-6 py-5 text-left text-lg font-semibold shadow-lg backdrop-blur transition-all duration-200 disabled:cursor-not-allowed sm:text-xl ${cls}`}
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
          <h2 className="text-5xl font-black text-white drop-shadow-lg sm:text-6xl">
            Игра окончена!
          </h2>
          <p className="mt-6 text-2xl text-white/90">
            Твой счёт:{" "}
            <span className="font-black text-yellow-300">
              {score} / {questions.length}
            </span>
          </p>
          <button
            type="button"
            onClick={startGame}
            className="mt-10 rounded-full bg-gradient-to-b from-orange-400 via-pink-500 to-fuchsia-600 px-12 py-5 text-2xl font-black tracking-wider text-white shadow-[0_15px_40px_-10px_rgba(236,72,153,0.7)] ring-4 ring-white/20 transition-all duration-200 hover:scale-105 active:translate-y-1"
          >
            ИГРАТЬ ЕЩЁ
          </button>
        </div>
      )}
    </main>
  );
}
