import { describe, expect, it } from "vitest";
import { analyzeMessage } from "@/lib/scamAnalyzer";

describe("scam analysis engine", () => {
  it("marks a fake bank SMS as high risk", () => {
    const result = analyzeMessage(
      "Bank message",
      "Twoje konto zostanie zablokowane. Potwierdź dane logowania: http://bank-security-check.example"
    );

    expect(result.level).toBe("high");
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.scoringBreakdown.length).toBeGreaterThan(1);
  });

  it("marks a normal family message as low risk", () => {
    const result = analyzeMessage("SMS", "Cześć mamo, będę dziś o 17:00. Kupić coś po drodze?");

    expect(result.level).toBe("low");
    expect(result.score).toBeLessThanOrEqual(30);
  });

  it("marks a BLIK request as high risk", () => {
    const result = analyzeMessage(
      "BLIK request",
      "Mam nowy numer i pilnie potrzebuję pieniędzy. Podaj kod BLIK, oddam wieczorem i nie mów nikomu."
    );

    expect(result.level).toBe("high");
  });

  it("marks fake delivery payment as high risk", () => {
    const result = analyzeMessage(
      "Delivery message",
      "Paczka wstrzymana. Dopłać 2,99 zł, aby kontynuować dostawę: bit.ly/doplata-kurier"
    );

    expect(result.level).toBe("high");
  });

  it("marks investment scams as high risk", () => {
    const result = analyzeMessage(
      "Investment offer",
      "Gwarantowany zysk 300% bez ryzyka. Konsultant pomoże zarobić na crypto profit już dziś."
    );

    expect(result.level).toBe("high");
  });

  it("marks AnyDesk remote access scams as high risk", () => {
    const result = analyzeMessage(
      "Phone call",
      "Zainstaluj AnyDesk, żeby konsultant banku mógł zabezpieczyć konto. Udostępnij ekran."
    );

    expect(result.level).toBe("high");
    expect(result.indicators.some((indicator) => indicator.id === "remote-access")).toBe(true);
  });

  it("returns low risk validation result for an empty message", () => {
    const result = analyzeMessage("SMS", "   ");

    expect(result.level).toBe("low");
    expect(result.score).toBe(0);
    expect(result.indicators).toHaveLength(0);
  });
});
