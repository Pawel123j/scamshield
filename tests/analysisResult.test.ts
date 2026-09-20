/**
 * Testy kontraktu AnalysisResult.
 *
 * Istniejące testy sprawdzają WERDYKTY silnika (czy fałszywy SMS z banku
 * dostanie wysokie ryzyko). Te sprawdzają coś innego: KSZTAŁT wyniku.
 *
 * AnalysisResult jest zapisywany do localStorage, renderowany w dwóch
 * tabelach i eksportowany do PDF-a. Każde z tych miejsc zakłada, że pola
 * istnieją i mają sens — a żadne tego nie weryfikuje. Poniżej są niezmienniki,
 * na których te miejsca stoją.
 */

import { describe, expect, it } from "vitest";

import { analyzeMessage, messageTypes } from "@/lib/scamAnalyzer";
import { getRiskLevel } from "@/lib/risk";
import type { AnalysisResult, ScamCategory } from "@/lib/types";

const RISK_LEVELS = ["low", "medium", "high"];
const CONFIDENCE_LEVELS = ["low", "medium", "high"];
const CATEGORIES: ScamCategory[] = [
  "phishing",
  "banking_fraud",
  "blik_fraud",
  "delivery_scam",
  "investment_scam",
  "crypto_scam",
  "remote_access_scam",
  "identity_theft",
  "social_engineering",
  "safe_message"
];

/** Wiadomości dobrane tak, żeby przejść przez całą skalę ryzyka. */
const SAMPLES: Array<{ name: string; text: string }> = [
  { name: "pusta", text: "   " },
  { name: "neutralna", text: "Cześć, widzimy się jutro o 12:00 pod apteką." },
  { name: "sam link", text: "Zobacz zdjęcia z wakacji: https://przyklad.example/album" },
  {
    name: "bank",
    text: "Twoje konto zostanie zablokowane. Potwierdź dane logowania: http://bank-check.example"
  },
  {
    name: "wszystko naraz",
    text:
      "Konto zablokowane. Kliknij bit.ly/bank i podaj PESEL, hasło, kod BLIK. " +
      "Zainstaluj AnyDesk i NIE MÓW NIKOMU!!!"
  }
];

function assertShape(result: AnalysisResult) {
  expect(typeof result.id).toBe("string");
  expect(result.id.length).toBeGreaterThan(0);
  expect(Number.isNaN(Date.parse(result.createdAt))).toBe(false);

  expect(Number.isInteger(result.score)).toBe(true);
  expect(result.score).toBeGreaterThanOrEqual(0);
  expect(result.score).toBeLessThanOrEqual(100);

  expect(RISK_LEVELS).toContain(result.level);
  expect(CONFIDENCE_LEVELS).toContain(result.confidence);
  expect(CATEGORIES).toContain(result.dominantCategory);

  // Pola tekstowe idą wprost do interfejsu i do PDF-a — puste zostawiłyby
  // użytkownika z pustym ekranem zamiast wyjaśnienia.
  for (const field of ["shortSummary", "detailedExplanation", "summary"] as const) {
    expect(typeof result[field]).toBe("string");
    expect(result[field].trim().length).toBeGreaterThan(0);
  }

  expect(Array.isArray(result.recommendations)).toBe(true);
  expect(result.recommendations.length).toBeGreaterThan(0);
  expect(Array.isArray(result.nextSteps)).toBe(true);
  expect(result.nextSteps.length).toBeGreaterThan(0);

  expect(typeof result.wasTruncated).toBe("boolean");
  expect(result.originalText.length).toBeLessThanOrEqual(5000);
}

describe("AnalysisResult — kontrakt wyniku", () => {
  it.each(SAMPLES)("$name ma komplet pól o właściwych typach", ({ text }) => {
    assertShape(analyzeMessage("SMS", text));
  });

  it("poziom ryzyka zawsze zgadza się z progami z lib/risk", () => {
    // Dwa niezależne miejsca liczą to samo: silnik i komponenty czytające
    // getRiskLevel. Jeżeli progi się rozjadą, interfejs pokaże inny kolor
    // niż etykietę.
    for (const { text } of SAMPLES) {
      const result = analyzeMessage("Bank message", text);
      expect(result.level).toBe(getRiskLevel(result.score));
    }
  });

  it("działa dla każdego typu wiadomości z listy w interfejsie", () => {
    // messageTypes zasila selektor na stronie /analyze. Każda pozycja musi
    // dać poprawny wynik, także te, które nie mają własnego wzmocnienia.
    for (const messageType of messageTypes) {
      assertShape(analyzeMessage(messageType, "Dopłać 1,99 zł: bit.ly/paczka"));
    }
  });

  it("wskaźniki mają komplet pól i dodatnią liczbę punktów", () => {
    const result = analyzeMessage("Bank message", SAMPLES[4].text);

    expect(result.indicators.length).toBeGreaterThan(0);
    for (const indicator of result.indicators) {
      expect(indicator.id.length).toBeGreaterThan(0);
      expect(indicator.label.length).toBeGreaterThan(0);
      expect(indicator.description.length).toBeGreaterThan(0);
      expect(Number.isFinite(indicator.points)).toBe(true);
      expect(indicator.points).toBeGreaterThan(0);
      expect(RISK_LEVELS).toContain(indicator.severity);
      expect(CATEGORIES).toContain(indicator.category);
    }
  });

  it("identyfikatory wskaźników nie powtarzają się w jednym wyniku", () => {
    const result = analyzeMessage("Bank message", SAMPLES[4].text);
    const ids = result.indicators.map((indicator) => indicator.id);

    // Powtórzony identyfikator oznaczałby podwójnie naliczone punkty
    // i zdublowany wiersz w tabeli punktacji.
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("rekomendacje nie powtarzają się", () => {
    const result = analyzeMessage("Bank message", SAMPLES[4].text);
    expect(new Set(result.recommendations).size).toBe(result.recommendations.length);
  });

  it("podgląd nigdy nie pokazuje pełnego numeru karty", () => {
    const result = analyzeMessage("SMS", "Potwierdź kartę 4111 1111 1111 1234 na stronie banku");

    expect(result.preview).not.toContain("4111 1111 1111");
    expect(result.maskedPreview).not.toContain("4111 1111 1111");
    expect(result.maskedPreview).toContain("1234");
  });

  it("podgląd jest przycinany do 160 znaków", () => {
    const result = analyzeMessage("SMS", "słowo ".repeat(200));

    expect(result.preview.length).toBeLessThanOrEqual(160);
    expect(result.maskedPreview.length).toBeLessThanOrEqual(160);
  });
});

describe("scoringBreakdown — tabela punktacji", () => {
  it("sumuje się dokładnie do wyniku, dopóki nie wejdzie limit 100", () => {
    // To jest cała obietnica tej tabeli: użytkownik ma zobaczyć, SKĄD
    // wzięła się liczba. Jeżeli suma pozycji nie daje wyniku, tabela kłamie.
    const result = analyzeMessage("SMS", SAMPLES[2].text);
    const sum = result.scoringBreakdown.reduce((total, item) => total + item.points, 0);

    expect(result.scoringBreakdown.length).toBeGreaterThan(0);
    expect(sum).toBeLessThan(100);
    expect(result.score).toBe(Math.round(sum));
  });

  it("po przekroczeniu 100 wynik jest przycięty, a nie suma", () => {
    const result = analyzeMessage("Bank message", SAMPLES[4].text);
    const sum = result.scoringBreakdown.reduce((total, item) => total + item.points, 0);

    expect(result.score).toBe(100);
    expect(sum).toBeGreaterThan(100);
  });

  it("każda pozycja ma etykietę i skończoną liczbę punktów", () => {
    for (const { text } of SAMPLES) {
      for (const item of analyzeMessage("Bank message", text).scoringBreakdown) {
        expect(typeof item.label).toBe("string");
        expect(item.label.trim().length).toBeGreaterThan(0);
        expect(Number.isFinite(item.points)).toBe(true);
      }
    }
  });

  it("nigdy nie jest pusta — także dla wiadomości bez sygnałów", () => {
    // Pusta tabela wyglądałaby jak błąd aplikacji, a nie jak "nic nie
    // znaleziono".
    const neutral = analyzeMessage("SMS", SAMPLES[1].text);
    expect(neutral.indicators).toHaveLength(0);
    expect(neutral.scoringBreakdown.length).toBeGreaterThan(0);

    const empty = analyzeMessage("SMS", "   ");
    expect(empty.scoringBreakdown.length).toBeGreaterThan(0);
  });

  it("każdy wskaźnik ma odpowiadającą pozycję w tabeli", () => {
    const result = analyzeMessage("SMS", SAMPLES[2].text);
    const labels = result.scoringBreakdown.map((item) => item.label);

    for (const indicator of result.indicators) {
      expect(labels).toContain(indicator.label);
    }
  });

  it("pewność rośnie razem z wynikiem", () => {
    const low = analyzeMessage("SMS", SAMPLES[1].text);
    const high = analyzeMessage("Bank message", SAMPLES[4].text);

    expect(low.confidence).toBe("low");
    expect(high.confidence).toBe("high");
  });
});
