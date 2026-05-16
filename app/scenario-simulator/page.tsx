"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { scamScenarios, type ScenarioAnswer } from "@/data/scenarios";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { storageKeys } from "@/lib/storage";
import { cn } from "@/lib/cn";

const answerOptions: Array<{ value: ScenarioAnswer; label: string }> = [
  { value: "safe", label: "Safe" },
  { value: "suspicious", label: "Suspicious" },
  { value: "dangerous", label: "Dangerous" }
];

export default function ScenarioSimulatorPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<ScenarioAnswer | null>(null);
  const [score, setScore] = useLocalStorage<number>(storageKeys.scenarioScore, 0);
  const scenario = scamScenarios[currentIndex];
  const answered = selected !== null;
  const isCorrect = selected === scenario.correctAnswer;

  const progress = useMemo(() => Math.round(((currentIndex + 1) / scamScenarios.length) * 100), [currentIndex]);

  const chooseAnswer = (answer: ScenarioAnswer) => {
    if (answered) {
      return;
    }

    setSelected(answer);
    if (answer === scenario.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextScenario = () => {
    setSelected(null);
    setCurrentIndex((index) => (index + 1) % scamScenarios.length);
  };

  const resetScore = () => {
    setScore(0);
    setSelected(null);
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">Interactive learning</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Scam scenario simulator</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Practice recognizing safe, suspicious and dangerous messages. Your score is stored locally in this browser.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-tealguard">
                Scenario {currentIndex + 1}/{scamScenarios.length}
              </p>
              <h2 className="mt-2 text-2xl font-black text-ink">{scenario.title}</h2>
            </div>
            <span className="rounded-full bg-teal-50 px-4 py-2 font-black text-tealguard">{progress}%</span>
          </div>

          <blockquote className="mt-6 rounded-3xl border-l-4 border-tealguard bg-slate-50 p-5 text-lg leading-8 text-ink">
            “{scenario.message}”
          </blockquote>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => chooseAnswer(option.value)}
                className={cn(
                  "min-h-14 rounded-2xl border px-5 py-3 font-black transition focus:outline-none focus:ring-4 focus:ring-teal-200",
                  selected === option.value ? "border-tealguard bg-tealguard text-white" : "border-teal-100 bg-white text-ink hover:bg-teal-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {answered && (
            <div className={cn("mt-6 rounded-3xl border p-5", isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50")}>
              <p className={cn("text-xl font-black", isCorrect ? "text-emerald-800" : "text-amber-900")}>
                {isCorrect ? "Correct" : `Correct answer: ${scenario.correctAnswer}`}
              </p>
              <p className="mt-2 leading-7 text-slate-700">{scenario.explanation}</p>
              <button
                type="button"
                onClick={nextScenario}
                className="mt-4 inline-flex min-h-12 items-center rounded-2xl bg-ink px-5 py-3 font-bold text-white hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200"
              >
                Next scenario
              </button>
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
              <Trophy aria-hidden="true" size={24} />
            </span>
            <div>
              <p className="text-sm font-bold text-tealguard">Best local score</p>
              <p className="text-3xl font-black text-ink">{score}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Use this simulator during a portfolio demo to show interactive cybersecurity education.
          </p>
          <button
            type="button"
            onClick={resetScore}
            className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-bold text-ink hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
          >
            <RotateCcw aria-hidden="true" size={19} />
            Reset score
          </button>
        </aside>
      </section>
    </div>
  );
}
