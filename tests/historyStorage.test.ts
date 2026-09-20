/**
 * Testy odczytu historii z localStorage.
 *
 * `readAnalysisHistory` czyta dane, których aplikacja nie kontroluje: zapisy
 * ze starszych wersji (inne nazwy pól) oraz dowolną treść, którą ktoś wpisze
 * ręcznie w narzędziach deweloperskich. To, co stamtąd wyjdzie, trafia wprost
 * do tabel na /history i /dashboard oraz do eksportu PDF.
 */

import { beforeEach, describe, expect, it } from "vitest";

import { readAnalysisHistory, saveAnalysisHistory, storageKeys } from "@/lib/localStorage";

/** Minimalny localStorage — testy chodzą w środowisku node, bez przeglądarki. */
function installFakeStorage() {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear()
  };

  (globalThis as unknown as { window: unknown }).window = { localStorage: storage };
  return data;
}

let store: Map<string, string>;

function seed(raw: unknown) {
  store.set(storageKeys.analysisHistory, JSON.stringify(raw));
}

beforeEach(() => {
  store = installFakeStorage();
});

describe("readAnalysisHistory — zapisy ze starszych wersji", () => {
  it("maskuje numer karty w podglądzie odtworzonym z originalText", () => {
    // REGRESJA: starsze zapisy miały tylko `originalText`. Fallback brał ten
    // tekst surowy i podawał go dalej jako `maskedPreview` — pole, którego
    // nazwa obiecuje coś przeciwnego. Numer karty lądował w tabeli na ekranie
    // i w wyeksportowanym PDF-ie.
    seed([
      {
        id: "legacy-1",
        createdAt: "2026-01-01T10:00:00.000Z",
        messageType: "SMS",
        score: 55,
        originalText: "Potwierdź kartę 4111 1111 1111 1234 pod adresem banku"
      }
    ]);

    const [item] = readAnalysisHistory();

    expect(item.maskedPreview).not.toContain("4111 1111 1111");
    expect(item.preview).not.toContain("4111 1111 1111");
    expect(item.maskedPreview).toContain("1234");
  });

  it("przenosi stare nazwy pól na obecne", () => {
    seed([
      {
        id: "legacy-2",
        createdAt: "2026-01-01T10:00:00.000Z",
        messageType: "Email",
        score: 72,
        summary: "Zapisana analiza",
        detectedIndicators: [{ title: "Podejrzany link", weight: 18 }],
        recommendedActions: ["Nie klikaj w link"]
      }
    ]);

    const [item] = readAnalysisHistory();

    expect(item.indicators).toHaveLength(1);
    expect(item.indicators[0].label).toBe("Podejrzany link");
    expect(item.indicators[0].points).toBe(18);
    expect(item.recommendations).toEqual(["Nie klikaj w link"]);
    // Brak nextSteps w starym zapisie — spadają na rekomendacje, a nie na
    // pustą listę, bo widok zakłada, że coś tam jest.
    expect(item.nextSteps).toEqual(["Nie klikaj w link"]);
  });

  it("odrzuca zapisy bez identyfikatora, daty albo z wynikiem nie-liczbą", () => {
    seed([
      { createdAt: "2026-01-01T10:00:00.000Z", messageType: "SMS", score: 10 },
      { id: "a", messageType: "SMS", score: 10 },
      { id: "b", createdAt: "2026-01-01T10:00:00.000Z", messageType: "SMS", score: "bardzo dużo" },
      { id: "ok", createdAt: "2026-01-01T10:00:00.000Z", messageType: "SMS", score: 10 }
    ]);

    const history = readAnalysisHistory();

    expect(history).toHaveLength(1);
    expect(history[0].id).toBe("ok");
  });

  it("przeżywa dane, które w ogóle nie są listą", () => {
    seed({ nie: "lista" });
    expect(readAnalysisHistory()).toEqual([]);

    store.set(storageKeys.analysisHistory, "to nie jest JSON");
    expect(readAnalysisHistory()).toEqual([]);
  });
});

describe("readAnalysisHistory — scoringBreakdown z niezaufanego źródła", () => {
  const base = {
    id: "x",
    createdAt: "2026-01-01T10:00:00.000Z",
    messageType: "SMS",
    score: 42
  };

  it("odrzuca pozycje bez liczbowej wartości punktów", () => {
    seed([
      {
        ...base,
        scoringBreakdown: [
          { label: "Prawidłowa pozycja", points: 20 },
          { label: "Zepsuta pozycja", points: "dużo" },
          { label: "Też zepsuta", points: null },
          "nawet nie obiekt"
        ]
      }
    ]);

    const [item] = readAnalysisHistory();

    // Zostaje tylko pozycja, którą da się zsumować. Wcześniej całość
    // przechodziła przez rzutowanie typu i NaN trafiał do widoku.
    expect(item.scoringBreakdown).toEqual([{ label: "Prawidłowa pozycja", points: 20 }]);
    expect(item.scoringBreakdown.every((entry) => Number.isFinite(entry.points))).toBe(true);
  });

  it("podstawia pozycję zastępczą, gdy nie zostanie nic sensownego", () => {
    seed([{ ...base, scoringBreakdown: [{ label: "Zepsuta", points: "dużo" }] }]);

    const [item] = readAnalysisHistory();

    expect(item.scoringBreakdown).toEqual([{ label: "Legacy saved score", points: 42 }]);
  });

  it("podstawia pozycję zastępczą, gdy tabeli w ogóle nie było", () => {
    seed([base]);

    const [item] = readAnalysisHistory();

    expect(item.scoringBreakdown).toHaveLength(1);
    expect(item.scoringBreakdown[0].points).toBe(42);
  });
});

describe("saveAnalysisHistory", () => {
  it("przycina historię do 75 pozycji", () => {
    const entries = Array.from({ length: 120 }, (_, index) => ({
      id: `id-${index}`,
      createdAt: "2026-01-01T10:00:00.000Z",
      messageType: "SMS",
      score: 10
    }));

    saveAnalysisHistory(entries as never);

    expect(JSON.parse(store.get(storageKeys.analysisHistory)!)).toHaveLength(75);
  });
});
