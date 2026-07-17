"use client";

import { useMemo, useState } from "react";
import { Button, Badge } from "./ui";
import { Icon } from "./icons";
import { problemsKb, symptoms, type Problem } from "@/data/problems";

type Result = { problem: Problem; score: number; matched: number };

const severityTone: Record<Problem["severity"], "leaf" | "ochre" | "neutral"> = {
  Low: "leaf",
  Medium: "ochre",
  High: "neutral",
};

const categoryIcon: Record<Problem["category"], keyof typeof Icon> = {
  Nutrient: "Flask",
  Watering: "Droplet",
  Pest: "Bug",
  Disease: "Shield",
  Environment: "Sun",
};

function CategoryIcon({ category }: { category: Problem["category"] }) {
  const C = Icon[categoryIcon[category]];
  return <C className="h-5 w-5" />;
}

export function PlantDoctor() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => {
    setSubmitted(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const results = useMemo<Result[]>(() => {
    if (selected.size === 0) return [];
    return problemsKb
      .map((problem) => {
        const matched = problem.symptoms.filter((s) => selected.has(s)).length;
        const score = matched === 0 ? 0 : matched / selected.size;
        return { problem, score, matched };
      })
      .filter((r) => r.matched > 0)
      .sort((a, b) => b.matched - a.matched || b.score - a.score)
      .slice(0, 4);
  }, [selected]);

  const reset = () => {
    setSelected(new Set());
    setSubmitted(false);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      {/* Symptom picker */}
      <div>
        <div className="rounded-xl border border-line bg-white p-7">
          <h2 className="font-display text-lg font-semibold text-forest">
            What do you see?
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            Select every symptom that applies to your plant.
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {symptoms.map((s) => {
              const active = selected.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    active
                      ? "border-forest bg-forest text-mint-100"
                      : "border-line text-ink/75 hover:border-forest/30"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      active
                        ? "border-mint bg-mint text-forest"
                        : "border-forest/25"
                    }`}
                  >
                    {active ? <Icon.Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex items-center gap-3">
            <Button
              onClick={() => setSubmitted(true)}
              disabled={selected.size === 0}
              size="lg"
              className="flex-1"
            >
              Diagnose{selected.size > 0 ? ` (${selected.size})` : ""}
            </Button>
            {selected.size > 0 ? (
              <button
                type="button"
                onClick={reset}
                className="rounded-lg px-4 py-2 text-sm font-medium text-ink/55 hover:text-forest"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink/45">
          The Plant Doctor is a learning and testing tool. It points you toward
          likely causes — for serious or commercial crop issues, confirm with a
          local agricultural officer.
        </p>
      </div>

      {/* Results */}
      <div>
        {!submitted ? (
          <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-forest/20 p-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-forest/[0.06] text-forest">
              <Icon.Leaf className="h-6 w-6" />
            </span>
            <p className="font-display mt-5 text-lg font-semibold text-forest">
              Your results will appear here
            </p>
            <p className="mt-1.5 max-w-xs text-sm text-ink/55">
              Pick the symptoms you can see and press Diagnose for likely causes
              and fixes.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-line bg-white p-10 text-center">
            <p className="font-display text-lg font-semibold text-forest">
              No close match found
            </p>
            <p className="mt-2 text-sm text-ink/55">
              Try a different combination of symptoms.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-forest">
                Most likely causes
              </h2>
              <span className="text-sm text-ink/45">
                {results.length} match{results.length > 1 ? "es" : ""}
              </span>
            </div>
            {results.map(({ problem, matched }, i) => (
              <details
                key={problem.id}
                open={i === 0}
                className="group overflow-hidden rounded-xl border border-line bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest/[0.06] text-forest">
                    <CategoryIcon category={problem.category} />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold text-forest">
                        {problem.name}
                      </h3>
                      {i === 0 ? <Badge tone="leaf">Top match</Badge> : null}
                    </div>
                    <p className="mt-0.5 text-xs text-ink/50">
                      {problem.category} · matched {matched} symptom
                      {matched > 1 ? "s" : ""} · {problem.severity} severity
                    </p>
                  </div>
                  <Icon.ChevronDown className="h-4 w-4 text-ink/40 transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-line px-5 pb-5 pt-4">
                  <p className="text-sm leading-relaxed text-ink/70">
                    {problem.summary}
                  </p>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ochre">
                        Likely causes
                      </p>
                      <ul className="mt-2.5 space-y-1.5 text-sm text-ink/70">
                        {problem.causes.map((c) => (
                          <li key={c} className="flex gap-2.5">
                            <span className="mt-2 h-px w-2.5 shrink-0 bg-ochre" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-leaf">
                        What to do
                      </p>
                      <ul className="mt-2.5 space-y-1.5 text-sm text-ink/70">
                        {problem.fixes.map((f) => (
                          <li key={f} className="flex gap-2.5">
                            <Icon.Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-5">
                    <Badge tone={severityTone[problem.severity]}>
                      {problem.severity} severity
                    </Badge>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
