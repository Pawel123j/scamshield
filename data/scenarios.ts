export type ScenarioAnswer = "safe" | "suspicious" | "dangerous";

export interface ScamScenario {
  id: string;
  title: string;
  message: string;
  correctAnswer: ScenarioAnswer;
  explanation: string;
}

export const scamScenarios: ScamScenario[] = [
  {
    id: "bank-sms",
    title: "Fake bank SMS",
    message: "Twoje konto zostanie zablokowane. Potwierdź dane logowania: http://bank-security-check.example",
    correctAnswer: "dangerous",
    explanation: "This uses a bank threat, urgency and a link asking for login confirmation."
  },
  {
    id: "delivery-payment",
    title: "Delivery payment scam",
    message: "Twoja paczka została wstrzymana. Dopłać 2,99 zł, aby kontynuować dostawę.",
    correctAnswer: "dangerous",
    explanation: "Small delivery fees are commonly used to steal card details."
  },
  {
    id: "blik-request",
    title: "BLIK request",
    message: "Cześć, wyślij mi szybko kod BLIK, oddam wieczorem. Nie dzwoń teraz.",
    correctAnswer: "dangerous",
    explanation: "A BLIK code can move money immediately, and secrecy is a major warning sign."
  },
  {
    id: "investment-ad",
    title: "Investment ad",
    message: "Gwarantowany zysk 300% bez ryzyka. Konsultant pomoże założyć konto.",
    correctAnswer: "dangerous",
    explanation: "Guaranteed high profits and consultant pressure are typical fake investment signals."
  },
  {
    id: "anydesk-call",
    title: "AnyDesk bank call",
    message: "Zainstaluj AnyDesk, żeby konsultant banku mógł zabezpieczyć Twoje konto.",
    correctAnswer: "dangerous",
    explanation: "Remote access tools can give criminals control over the device."
  },
  {
    id: "fake-police",
    title: "Fake police call",
    message: "Tu policja. To tajna akcja, wypłać pieniądze i nikomu nie mów.",
    correctAnswer: "dangerous",
    explanation: "Police do not ask people to secretly hand over money."
  },
  {
    id: "family-safe",
    title: "Normal family message",
    message: "Cześć babciu, będę dziś o 17:00. Kupić chleb?",
    correctAnswer: "safe",
    explanation: "This has no payment request, links, secrecy or pressure."
  },
  {
    id: "appointment",
    title: "Appointment reminder",
    message: "Przypomnienie: wizyta u lekarza jutro o 10:30. Prosimy zabrać dokument.",
    correctAnswer: "safe",
    explanation: "A simple reminder can still be checked, but it has no strong scam indicators."
  },
  {
    id: "marketplace-buyer",
    title: "OLX/Vinted buyer",
    message: "Już opłaciłam zakup. Odbierz pieniądze przez ten link i wpisz dane karty.",
    correctAnswer: "dangerous",
    explanation: "Sellers should not enter card data to receive money from a marketplace buyer."
  },
  {
    id: "fake-invoice",
    title: "Fake invoice",
    message: "W załączniku faktura po terminie. Brak płatności dziś skutkuje windykacją.",
    correctAnswer: "suspicious",
    explanation: "Unexpected invoices and payment pressure should be verified before opening attachments."
  }
];
