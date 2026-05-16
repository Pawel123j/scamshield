import { describe, expect, it } from "vitest";
import { analyzeMessage } from "@/lib/scamAnalyzer";

describe("scam analysis engine", () => {
  it("marks a fake bank SMS as high risk", () => {
    const result = analyzeMessage(
      "Bank message",
      "Twoje konto zostanie zablokowane w ciągu 24h. Kliknij link i potwierdź dane: https://bank-secure-login.top"
    );

    expect(result.level).toBe("High");
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it("marks a normal family message as low risk", () => {
    const result = analyzeMessage("SMS", "Cześć mamo, będę dziś o 17:00. Kupić coś po drodze?");

    expect(result.level).toBe("Low");
    expect(result.score).toBeLessThanOrEqual(30);
  });

  it("marks a BLIK request as high risk", () => {
    const result = analyzeMessage(
      "BLIK request",
      "Mam nowy numer i pilnie potrzebuję pieniędzy. Podaj kod BLIK, oddam wieczorem i nie mów nikomu."
    );

    expect(result.level).toBe("High");
  });

  it("marks fake delivery payment as high risk", () => {
    const result = analyzeMessage("Delivery message", "Paczka wstrzymana. Dopłać 1,49 zł: bit.ly/doplata-kurier");

    expect(result.level).toBe("High");
  });

  it("marks investment scams as high risk", () => {
    const result = analyzeMessage(
      "Investment offer",
      "Gwarantowany zysk 300% bez ryzyka. Nasz konsultant pomoże zarobić na crypto już dziś."
    );

    expect(result.level).toBe("High");
  });
});
