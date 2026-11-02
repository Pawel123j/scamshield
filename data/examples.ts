import type { MessageType } from "@/lib/types";

export interface ExampleMessage {
  label: string;
  type: MessageType;
  text: string;
}

export const exampleMessages: ExampleMessage[] = [
  {
    label: "Fałszywy SMS z banku",
    type: "Bank message",
    text: "Twoje konto zostanie zablokowane. Potwierdź dane logowania: http://bank-security-check.example"
  },
  {
    label: "Dopłata do przesyłki",
    type: "Delivery message",
    text: "Twoja paczka została wstrzymana. Dopłać 2,99 zł, aby kontynuować dostawę: http://doplatapaczka.example"
  },
  {
    label: "Prośba o BLIK",
    type: "BLIK request",
    text: "Cześć, to ja. Wyślij mi szybko kod BLIK, oddam wieczorem. Nie dzwoń teraz."
  },
  {
    label: "Oferta inwestycji",
    type: "Investment offer",
    text: "Gwarantowany zysk 300% bez ryzyka. Konsultant pomoże założyć konto i wypłacić crypto profit już dziś."
  },
  {
    label: "Zdalny dostęp",
    type: "Phone call",
    text: "Zainstaluj AnyDesk, żeby konsultant banku mógł zabezpieczyć Twoje konto. Udostępnij ekran i zaloguj się do banku."
  },
  {
    label: "Wiadomość od rodziny",
    type: "SMS",
    text: "Cześć babciu, będę dziś o 17:00. Kupić chleb?"
  }
];
