import { describe, expect, it } from "vitest";
import { analyzeMessage, maskSensitiveNumbers, MAX_ANALYSIS_INPUT_LENGTH } from "@/lib/scamAnalyzer";

describe("scam analysis engine", () => {
  it("marks a fake bank SMS as high risk", () => {
    const result = analyzeMessage(
      "Bank message",
      "Twoje konto zostanie zablokowane. Potwierdź dane logowania: http://bank-security-check.example"
    );

    expect(result.level).toBe("high");
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.dominantCategory).toBe("banking_fraud");
    expect(result.confidence).toBe("high");
    expect(result.scoringBreakdown.length).toBeGreaterThan(1);
  });

  it("marks a normal family message as low risk", () => {
    const result = analyzeMessage("SMS", "Cześć mamo, będę dziś o 17:00. Kupić coś po drodze?");

    expect(result.level).toBe("low");
    expect(result.score).toBeLessThanOrEqual(30);
    expect(result.dominantCategory).toBe("safe_message");
  });

  it("marks a BLIK request as high risk", () => {
    const result = analyzeMessage(
      "BLIK request",
      "Mam nowy numer i pilnie potrzebuję pieniędzy. Podaj kod BLIK, oddam wieczorem i nie mów nikomu."
    );

    expect(result.level).toBe("high");
    expect(result.dominantCategory).toBe("blik_fraud");
  });

  it("marks fake delivery payment as high risk", () => {
    const result = analyzeMessage(
      "Delivery message",
      "Paczka wstrzymana. Dopłać 2,99 zł, aby kontynuować dostawę: bit.ly/doplata-kurier"
    );

    expect(result.level).toBe("high");
    expect(result.dominantCategory).toBe("delivery_scam");
  });

  it("marks investment scams as high risk", () => {
    const result = analyzeMessage(
      "Investment offer",
      "Gwarantowany zysk 300% bez ryzyka. Konsultant pomoże zarobić na crypto profit już dziś."
    );

    expect(result.level).toBe("high");
    expect(["investment_scam", "crypto_scam"]).toContain(result.dominantCategory);
  });

  it("marks cryptocurrency scams as high risk", () => {
    const result = analyzeMessage(
      "Investment offer",
      "Investment opportunity with guaranteed profit 300%. Send USDT to unlock your crypto wallet."
    );

    expect(result.level).toBe("high");
    expect(result.indicators.some((indicator) => indicator.id === "crypto-scam")).toBe(true);
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

  it("caps scoring at 100 for very risky messages", () => {
    const result = analyzeMessage(
      "Bank message",
      "Konto zostanie zablokowane. Kliknij link bit.ly/bank i podaj PESEL, login, hasło, dane karty, kod BLIK. Zainstaluj AnyDesk i nie mów nikomu."
    );

    expect(result.score).toBe(100);
  });

  it("truncates long messages for analysis", () => {
    const result = analyzeMessage("SMS", "A".repeat(MAX_ANALYSIS_INPUT_LENGTH + 200));

    expect(result.wasTruncated).toBe(true);
    expect(result.originalText.length).toBe(MAX_ANALYSIS_INPUT_LENGTH);
  });

  it("masks sensitive-looking numbers in previews", () => {
    const masked = maskSensitiveNumbers("Moja karta 1234 5678 9012 3456");

    expect(masked).toContain("**** **** **** 3456");
  });
});
