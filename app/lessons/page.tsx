"use client";

import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { LessonCard } from "@/components/LessonCard";
import { lessons } from "@/data/lessons";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { storageKeys } from "@/lib/storage";
import { cn } from "@/lib/cn";

export default function LessonsPage() {
  const [progress, setProgress] = useLocalStorage<Record<string, boolean>>(storageKeys.lessons, {});
  const [selectedId, setSelectedId] = useState(lessons[0]?.id ?? "");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedId) ?? lessons[0];
  const score = useMemo(() => {
    if (!selectedLesson) {
      return 0;
    }

    return selectedLesson.quiz.reduce((total, question, index) => {
      return answers[index] === question.correctAnswerIndex ? total + 1 : total;
    }, 0);
  }, [answers, selectedLesson]);

  const openLesson = (lessonId: string) => {
    setSelectedId(lessonId);
    setAnswers({});
    setSubmitted(false);
  };

  const submitQuiz = () => {
    if (!selectedLesson || Object.keys(answers).length < selectedLesson.quiz.length) {
      return;
    }

    setSubmitted(true);
    setProgress({ ...progress, [selectedLesson.id]: true });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">Cyber lessons</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Learn scam prevention step by step</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Short lessons in simple Polish, each with a mini quiz. Progress is saved locally in this browser.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={Boolean(progress[lesson.id])}
              onOpen={() => openLesson(lesson.id)}
            />
          ))}
        </section>

        {selectedLesson && (
          <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold text-tealguard">{selectedLesson.durationMinutes} min lesson</p>
                <h2 className="mt-2 text-3xl font-black text-ink">{selectedLesson.title}</h2>
              </div>
              {progress[selectedLesson.id] && (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
                  <CheckCircle2 aria-hidden="true" size={18} />
                  Completed
                </span>
              )}
            </div>

            <p className="mt-5 text-lg leading-8 text-slate-700">{selectedLesson.explanation}</p>
            <ul className="mt-5 space-y-3">
              {selectedLesson.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-slate-700">
                  <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-tealguard" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="flex items-center gap-2 text-2xl font-black text-ink">
                <BookOpen aria-hidden="true" size={24} />
                Mini quiz
              </h3>
              <div className="mt-5 space-y-5">
                {selectedLesson.quiz.map((question, questionIndex) => (
                  <fieldset key={question.question} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <legend className="px-1 font-black text-ink">{question.question}</legend>
                    <div className="mt-4 grid gap-3">
                      {question.options.map((option, optionIndex) => {
                        const checked = answers[questionIndex] === optionIndex;
                        const isCorrect = submitted && optionIndex === question.correctAnswerIndex;
                        const isWrong = submitted && checked && optionIndex !== question.correctAnswerIndex;

                        return (
                          <label
                            key={option}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 transition",
                              checked ? "border-tealguard" : "border-slate-200",
                              isCorrect && "border-emerald-300 bg-emerald-50",
                              isWrong && "border-red-300 bg-red-50"
                            )}
                          >
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              checked={checked}
                              onChange={() => setAnswers({ ...answers, [questionIndex]: optionIndex })}
                              className="h-5 w-5 accent-tealguard"
                            />
                            <span className="font-semibold text-ink">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                    {submitted && <p className="mt-4 text-sm leading-6 text-slate-600">{question.explanation}</p>}
                  </fieldset>
                ))}
              </div>

              <button
                type="button"
                onClick={submitQuiz}
                disabled={Object.keys(answers).length < selectedLesson.quiz.length}
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-tealguard px-6 py-3 font-black text-white shadow-soft transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Check answers
              </button>

              {submitted && (
                <p className="mt-4 rounded-2xl bg-teal-50 p-4 font-bold text-tealguard">
                  Wynik: {score}/{selectedLesson.quiz.length}. Lekcja została zapisana jako ukończona.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
