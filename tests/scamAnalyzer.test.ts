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


describe("protective wording cannot hide exceptions or pronoun-based requests", () => {
  it.each([
    "Nie podawaj kodu BLIK przez telefon, wyślij go SMS-em na ten numer.",
    "Nie podawaj kodu BLIK. Wyślij go SMS-em na ten numer."
  ])("retains the BLIK warning for %s", (text) => {
    const result = analyzeMessage("SMS", text);
    expect(result.indicators.some(item => item.id === "blik-request")).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(34);
  });

  it("retains password signals for an exception to a warning", () => {
    const result = analyzeMessage("Email", "Do not share your password with anyone except me.");
    expect(result.indicators.some(item => item.id === "personal-data-request")).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(26);
  });

  it.each([
    "Bank nigdy nie poprosi o PIN ani kod BLIK, ale wyślij go SMS-em na ten numer.",
    "Bank nigdy nie poprosi o PIN ani kod BLIK. Wyślij go SMS-em na ten numer.",
    "Bank: nie podawaj PIN ani kodu BLIK nikomu poza nami. Prześlij je w odpowiedzi."
  ])("does not lower existing high risk for %s", (text) => {
    expect(analyzeMessage("SMS", text).level).toBe("high");
  });
});
