import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />
      </div>

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
          className="group relative rounded-full bg-gradient-to-b from-orange-400 via-pink-500 to-fuchsia-600 px-20 py-8 text-3xl font-black tracking-wider text-white shadow-[0_20px_50px_-10px_rgba(236,72,153,0.7),inset_0_-6px_0_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.4)] ring-4 ring-white/20 transition-all duration-200 hover:scale-105 hover:shadow-[0_25px_60px_-10px_rgba(236,72,153,0.9),inset_0_-6px_0_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.4)] active:translate-y-1 active:shadow-[0_10px_25px_-10px_rgba(236,72,153,0.7),inset_0_-2px_0_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.4)] sm:text-4xl md:px-28 md:py-10 md:text-5xl"
        >
          ИГРАТЬ
        </button>
      </div>

      <footer className="text-sm text-white/50">© Quiz Battle</footer>
    </main>
  );
}
