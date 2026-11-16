import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { analyzeMessage } from "@/lib/scamAnalyzer";
import type { MessageType } from "@/lib/types";
import cases from "./evaluation-cases.json";

const results = cases.map((item) => {
  const result = analyzeMessage(item.type as MessageType, item.text);
  return { ...item, actual: result.level, score: result.score, matches: result.level === item.expected };
});

// Explicit opt-in produces an auditable before/after report, including failures.
// This small development corpus is synthetic, public, and not a held-out benchmark.
if (process.env.SCAM_EVALUATION_OUTPUT) {
  const report = {
    source: "30 hand-written synthetic development examples; not real-world accuracy",
    total: results.length,
    expectedBandMatches: results.filter((item) => item.matches).length,
    confusion: ["low", "high"].map((expected) => ({
      expected,
      ...Object.fromEntries(["low", "medium", "high"].map((actual) => [
        actual, results.filter((item) => item.expected === expected && item.actual === actual).length
      ]))
    })),
    results
  };
  writeFileSync(process.env.SCAM_EVALUATION_OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
}

describe("synthetic calibration regressions", () => {
  it.each(results.filter((item) => item.regression))("$id → $expected", (item) => {
    expect(item.actual, `${item.text} (${item.score} points)`).toBe(item.expected);
  });
});
