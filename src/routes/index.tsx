import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { generateQuizQuestions } from "@/lib/ai-quiz.functions";
import { getFeedback, submitFeedback, type Feedback } from "@/lib/feedback.functions";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { getQuizzes, type SavedQuiz } from "@/lib/questions.functions";

const quizzesQueryOptions = queryOptions({
  queryKey: ["quizzes"],
  queryFn: () => getQuizzes(),
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
  loader: ({ context }) => context.queryClient.ensureQueryData(quizzesQueryOptions),
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
  const queryClient = useQueryClient();
  const { data: quizzes } = useSuspenseQuery(quizzesQueryOptions);

  const [screen, setScreen] = useState<"start" | "library" | "quiz" | "end" | "feedback" | "reviews">("start");
  const [activeQuizTitle, setActiveQuizTitle] = useState("");
  const [activeQuestions, setActiveQuestions] = useState<SavedQuiz["questions"]>([]);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [isFeedbackSending, setIsFeedbackSending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) setSession(data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setAuthError(null);
        setAuthMessage(null);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const resetRound = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setLocked(false);
  };

  const startGame = () => {
    resetRound();
    setScreen("quiz");
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthMessage(null);
    setIsAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    if (error) {
      setAuthError(error.message);
      setIsAuthLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setAuthError(null);
    setAuthMessage(null);

    if (!authEmail.trim() || authPassword.length < 6) {
      setAuthError("Введите email и пароль минимум из 6 символов.");
      return;
    }

    setIsAuthLoading(true);
    const credentials = {
      email: authEmail.trim(),
      password: authPassword,
    };

    const { data, error } = authMode === "register"
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials);

    setIsAuthLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (authMode === "register" && !data.session) {
      setAuthMessage("Аккаунт создан. Если Supabase просит подтверждение email, отключите Confirm email в Auth settings.");
      return;
    }

    setAuthMessage(authMode === "register" ? "Аккаунт создан, вы вошли." : "Вы вошли.");
    setAuthPassword("");
  };

  const handleSignOut = async () => {
    setAuthError(null);
    setAuthMessage(null);
    setIsAuthLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsAuthLoading(false);
    if (error) setAuthError(error.message);
  };

  const returnToMenu = () => {
    resetRound();
    setGenerationError(null);
    setScreen("start");
  };

  const returnToLibrary = () => {
    resetRound();
    setGenerationError(null);
    setScreen(quizzes.length > 0 ? "library" : "start");
  };

  const copyGameLink = async () => {
    const link = typeof window !== "undefined" ? window.location.origin : "";

    try {
      if (navigator.clipboard && link) {
        await navigator.clipboard.writeText(link);
      } else if (typeof document !== "undefined") {
        const input = document.createElement("input");
        input.value = link;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }

      setShareMessage("Ссылка скопирована!");
      window.setTimeout(() => setShareMessage(null), 2200);
    } catch {
      setShareMessage("Не удалось скопировать ссылку.");
      window.setTimeout(() => setShareMessage(null), 2200);
    }
  };

  const openFeedbackScreen = () => {
    setFeedbackMessage(null);
    setFeedbackError(null);
    setShowConfetti(false);
    setScreen("feedback");
  };

  const sendFeedback = async () => {
    setFeedbackError(null);
    setFeedbackMessage(null);
    setIsFeedbackSending(true);

    try {
      const savedFeedback = await submitFeedback({
        data: {
          rating: feedbackRating,
          improvement: feedbackText,
        },
      });
      setReviews((existingReviews) => [savedFeedback, ...existingReviews]);
      setFeedbackText("");
      setFeedbackRating(5);
      setFeedbackMessage("Спасибо за отзыв!");
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 2600);
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "Не удалось сохранить отзыв.");
    } finally {
      setIsFeedbackSending(false);
    }
  };

  const openReviewsScreen = async () => {
    setScreen("reviews");
    setReviewsError(null);
    setIsReviewsLoading(true);

    try {
      setReviews(await getFeedback());
    } catch (error) {
      setReviewsError(error instanceof Error ? error.message : "Не удалось загрузить отзывы.");
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const generateTopicQuiz = async () => {
    setGenerationError(null);
    setIsGenerating(true);
    try {
      const generatedQuiz = await generateQuizQuestions({
        data: { topic, count: 5 },
      });
      queryClient.setQueryData<Awaited<ReturnType<typeof getQuizzes>>>(
        quizzesQueryOptions.queryKey,
        (existingQuizzes = []) => [generatedQuiz, ...existingQuizzes],
      );
      setActiveQuizTitle(generatedQuiz.title);
      setActiveQuestions(generatedQuiz.questions);
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

  const openQuizLibrary = () => {
    if (quizzes.length === 0) {
      setGenerationError("В базе пока нет вопросов. Создайте викторину через AI или добавьте вопросы в Supabase.");
      return;
    }
    setScreen("library");
  };

  const playSavedQuiz = (quiz: SavedQuiz) => {
    setActiveQuizTitle(quiz.title);
    setActiveQuestions(quiz.questions);
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
            <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-sm">
              {session ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Вы вошли
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {session.user.email ?? "Google аккаунт"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={copyGameLink}
                      className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      Поделиться
                    </button>
                    <button
                      type="button"
                      onClick={openReviewsScreen}
                      className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      Отзывы
                    </button>
                    <button
                      type="button"
                      disabled={isAuthLoading}
                      onClick={handleSignOut}
                      className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-medium text-card-foreground">
                        Вход и регистрация
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Войдите через Google или создайте аккаунт по email.
                      </p>
                    </div>
                    <div className="flex rounded-md border border-border bg-background p-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode("login")}
                        className={`rounded px-3 py-1 text-xs font-medium transition-colors ${authMode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Вход
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode("register")}
                        className={`rounded px-3 py-1 text-xs font-medium transition-colors ${authMode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Регистрация
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isAuthLoading}
                    onClick={handleGoogleSignIn}
                    className="mt-4 w-full rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Продолжить с Google
                  </button>

                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(event) => setAuthEmail(event.target.value)}
                      placeholder="Email"
                      className="min-h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    />
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(event) => setAuthPassword(event.target.value)}
                      placeholder="Пароль"
                      className="min-h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    />
                    <button
                      type="button"
                      disabled={isAuthLoading}
                      onClick={handleEmailAuth}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {authMode === "register" ? "Создать" : "Войти"}
                    </button>
                  </div>

                  {authError && (
                    <p className="mt-3 text-sm text-destructive">{authError}</p>
                  )}
                  {authMessage && (
                    <p className="mt-3 text-sm text-muted-foreground">{authMessage}</p>
                  )}
                </div>
              )}
            </section>

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
              onClick={openQuizLibrary}
              disabled={quizzes.length === 0}
              className="rounded-md bg-primary px-12 py-5 text-base font-medium tracking-wide text-primary-foreground shadow-sm transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring sm:px-16 sm:py-6 sm:text-lg"
            >
              Играть с вопросами из базы
            </button>
            <button
              type="button"
              onClick={openFeedbackScreen}
              className="rounded-md border border-border bg-card px-8 py-3 text-sm font-medium text-card-foreground shadow-sm transition-colors hover:bg-secondary"
            >
              Оставить отзыв
            </button>
            {quizzes.length === 0 && (
              <p className="max-w-md text-center text-sm text-muted-foreground">
                В базе пока нет вопросов. AI-викторина всё равно может работать.
              </p>
            )}
          </div>

          <footer className="text-sm text-muted-foreground">© Quiz Battle</footer>
        </>
      )}

      {screen === "library" && (
        <div className="flex w-full max-w-4xl flex-1 flex-col">
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={returnToMenu}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary"
            >
              ← Назад
            </button>
            <div className="text-right">
              <h2 className="font-display text-3xl font-normal tracking-tight text-foreground">
                Все викторины
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Выбери тему, чтобы начать игру
              </p>
            </div>
          </div>

          <div className="grid flex-1 content-center gap-4 py-8 sm:grid-cols-2">
            {quizzes.map((quiz) => (
              <button
                key={quiz.id}
                type="button"
                onClick={() => playSavedQuiz(quiz)}
                className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-secondary"
              >
                <div className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  {quiz.questions.length} вопросов
                </div>
                <h3 className="mt-3 font-display text-2xl font-normal text-card-foreground">
                  {quiz.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Нажми, чтобы играть эту викторину.
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === "quiz" && (
        <div className="flex w-full max-w-3xl flex-1 flex-col">
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={returnToLibrary}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary"
            >
              ← Другая викторина
            </button>
            <div className="text-right">
              <div className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {activeQuizTitle}
              </div>
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

      {shareMessage && (
        <div className="fixed left-1/2 top-6 z-20 -translate-x-1/2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-card-foreground shadow-lg">
          {shareMessage}
        </div>
      )}

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-10 flex items-start justify-center overflow-hidden pt-8 text-4xl">
          <div className="animate-bounce">🍬 🎉 🍭 ✨ 🍬 🎊</div>
        </div>
      )}

      {screen === "feedback" && (
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center text-center">
          <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-4xl font-normal tracking-tight text-card-foreground">
              Оставить отзыв
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Оцени игру и напиши, что можно улучшить.
            </p>

            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className={`text-4xl transition-transform hover:scale-110 ${star <= feedbackRating ? "text-primary" : "text-muted-foreground/40"}`}
                  aria-label={`${star} звезд`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              placeholder="Что улучшить?"
              className="mt-6 min-h-32 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />

            {feedbackError && (
              <p className="mt-3 text-sm text-destructive">{feedbackError}</p>
            )}
            {feedbackMessage && (
              <p className="mt-3 text-sm font-medium text-primary">{feedbackMessage}</p>
            )}

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                disabled={isFeedbackSending}
                onClick={sendFeedback}
                className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFeedbackSending ? "Отправляю..." : "Отправить отзыв"}
              </button>
              <button
                type="button"
                onClick={returnToMenu}
                className="rounded-md border border-border bg-background px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                На главный экран
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === "reviews" && (
        <div className="flex w-full max-w-4xl flex-1 flex-col py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={returnToMenu}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary"
            >
              ← Назад
            </button>
            <div className="text-right">
              <h2 className="font-display text-3xl font-normal tracking-tight text-foreground">
                Отзывы
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Все отзывы игроков
              </p>
            </div>
          </div>

          <div className="grid flex-1 content-start gap-4 py-8">
            {isReviewsLoading && (
              <p className="text-center text-sm text-muted-foreground">Загружаю отзывы...</p>
            )}
            {reviewsError && (
              <p className="text-center text-sm text-destructive">{reviewsError}</p>
            )}
            {!isReviewsLoading && !reviewsError && reviews.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">Отзывов пока нет.</p>
            )}
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xl text-primary">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleString("ru-RU")}
                  </time>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-card-foreground">
                  {review.improvement || "Без комментария"}
                </p>
              </article>
            ))}
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
              onClick={copyGameLink}
              className="rounded-md bg-primary px-10 py-4 text-base font-medium text-primary-foreground shadow-sm transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              Поделиться
            </button>
            <button
              type="button"
              onClick={startGame}
              className="rounded-md border border-border bg-card px-10 py-4 text-base font-medium text-card-foreground shadow-sm transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              Играть заново
            </button>
            <button
              type="button"
              onClick={returnToLibrary}
              className="rounded-md border border-border bg-card px-10 py-4 text-base font-medium text-card-foreground shadow-sm transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              Выбрать другую викторину
            </button>
            <button
              type="button"
              onClick={returnToMenu}
              className="rounded-md border border-border bg-background px-10 py-4 text-base font-medium text-foreground shadow-sm transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              На главный экран
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
