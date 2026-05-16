import { BookOpen, CheckCircle2 } from "lucide-react";
import type { Lesson } from "@/lib/types";

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
  onOpen: () => void;
}

export function LessonCard({ lesson, completed, onOpen }: LessonCardProps) {
  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
          {completed ? <CheckCircle2 aria-hidden="true" size={24} /> : <BookOpen aria-hidden="true" size={24} />}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-tealguard">{lesson.durationMinutes} min</p>
          <h2 className="mt-1 text-xl font-black text-ink">{lesson.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">{lesson.explanation}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-ink px-5 py-3 font-bold text-white transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200"
      >
        {completed ? "Powtórz lekcję" : "Rozpocznij lekcję"}
      </button>
    </article>
  );
}
