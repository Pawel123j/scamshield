import type { Lesson } from "@/lib/types";

export const lessons: Lesson[] = [
  {
    id: "what-is-phishing",
    title: "Czym jest phishing?",
    durationMinutes: 6,
    explanation:
      "Phishing to próba wyłudzenia danych przez wiadomość, stronę lub telefon, które udają bank, kuriera, urząd albo bliską osobę.",
    bullets: [
      "Oszuści często używają strachu, pośpiechu albo obietnicy nagrody.",
      "Fałszywa strona może wyglądać bardzo podobnie do prawdziwej.",
      "Najważniejsza zasada: zatrzymaj się i sprawdź nadawcę innym kanałem."
    ],
    quiz: [
      {
        question: "Co jest typowym celem phishingu?",
        options: ["Wyłudzenie danych lub pieniędzy", "Naprawa telefonu", "Legalna aktualizacja banku"],
        correctAnswerIndex: 0,
        explanation: "Phishing ma skłonić ofiarę do podania danych, kliknięcia linku lub wykonania płatności."
      },
      {
        question: "Co zrobić, gdy SMS z banku wzbudza niepokój?",
        options: ["Kliknąć link szybko", "Zadzwonić na oficjalny numer banku", "Odpisać nadawcy hasło"],
        correctAnswerIndex: 1,
        explanation: "Najbezpieczniej użyć oficjalnego numeru z karty, aplikacji lub strony banku."
      },
      {
        question: "Czy fałszywa strona może wyglądać profesjonalnie?",
        options: ["Tak", "Nie", "Tylko na komputerze"],
        correctAnswerIndex: 0,
        explanation: "Oszuści kopiują wygląd znanych serwisów, dlatego sam wygląd nie wystarcza."
      }
    ]
  },
  {
    id: "fake-sms",
    title: "Jak rozpoznać fałszywy SMS?",
    durationMinutes: 7,
    explanation:
      "Fałszywe SMS-y często udają bank, kuriera, pocztę lub urząd. Najczęściej zawierają link i proszą o szybką płatność albo potwierdzenie danych.",
    bullets: [
      "Uważaj na dopłaty do paczek i linki do płatności.",
      "Sprawdź, czy domena strony jest prawdziwa.",
      "Nie wpisuj danych karty po kliknięciu linku z SMS-a.",
      "Zachowaj wiadomość jako dowód, jeśli zgłaszasz sprawę."
    ],
    quiz: [
      {
        question: "SMS prosi o dopłatę 1,49 zł do paczki. Co zrobić?",
        options: ["Kliknąć link", "Sprawdzić paczkę w oficjalnej aplikacji", "Wysłać numer karty SMS-em"],
        correctAnswerIndex: 1,
        explanation: "Status paczki sprawdzamy w oficjalnym kanale, nie przez link z wiadomości."
      },
      {
        question: "Który element jest sygnałem ostrzegawczym?",
        options: ["Krótki link bit.ly", "Imię nadawcy", "Polskie znaki"],
        correctAnswerIndex: 0,
        explanation: "Skrócony link ukrywa prawdziwy adres strony."
      },
      {
        question: "Czy mała kwota oznacza, że SMS jest bezpieczny?",
        options: ["Nie", "Tak", "Zawsze"],
        correctAnswerIndex: 0,
        explanation: "Mała kwota często ma obniżyć czujność przed wyłudzeniem danych karty."
      }
    ]
  },
  {
    id: "online-banking",
    title: "Jak chronić bankowość internetową?",
    durationMinutes: 8,
    explanation:
      "Bezpieczna bankowość opiera się na spokojnej weryfikacji, silnym haśle i unikaniu logowania przez linki z wiadomości.",
    bullets: [
      "Wpisuj adres banku ręcznie lub używaj oficjalnej aplikacji.",
      "Nie podawaj hasła, PIN-u ani kodu autoryzacji rozmówcy.",
      "Czytaj treść powiadomień autoryzacyjnych przed zatwierdzeniem.",
      "Ustaw limity przelewów i płatności kartą."
    ],
    quiz: [
      {
        question: "Kiedy można podać hasło do banku przez telefon?",
        options: ["Nigdy", "Gdy dzwoni konsultant", "Gdy sprawa jest pilna"],
        correctAnswerIndex: 0,
        explanation: "Pracownik banku nie powinien prosić o pełne hasło."
      },
      {
        question: "Co sprawdzić przed zatwierdzeniem przelewu?",
        options: ["Kwotę i odbiorcę", "Kolor przycisku", "Godzinę dnia"],
        correctAnswerIndex: 0,
        explanation: "Powiadomienie autoryzacyjne informuje, co dokładnie zatwierdzasz."
      },
      {
        question: "Najbezpieczniejszy sposób wejścia do banku to:",
        options: ["Link z SMS-a", "Oficjalna aplikacja lub wpisany adres", "Link z reklamy"],
        correctAnswerIndex: 1,
        explanation: "Unikamy logowania przez linki z wiadomości i reklam."
      }
    ]
  },
  {
    id: "blik-scams",
    title: "Jak działają oszustwa BLIK?",
    durationMinutes: 6,
    explanation:
      "Kod BLIK pozwala wypłacić lub przelać pieniądze. Jeśli podasz go oszustowi i zatwierdzisz transakcję, środki mogą zniknąć od razu.",
    bullets: [
      "Kod BLIK podawaj tylko wtedy, gdy samodzielnie płacisz.",
      "Zawsze czytaj ekran potwierdzenia w aplikacji banku.",
      "Jeśli znajomy prosi o BLIK, zadzwoń do niego na znany numer.",
      "Nie działaj pod presją czasu."
    ],
    quiz: [
      {
        question: "Znajomy pisze z nowego numeru i prosi o BLIK. Co zrobić?",
        options: ["Wysłać kod", "Zadzwonić do znajomego", "Zatwierdzić wypłatę"],
        correctAnswerIndex: 1,
        explanation: "Najpierw potwierdź tożsamość innym kanałem."
      },
      {
        question: "Kod BLIK jest podobny do:",
        options: ["Gotówki", "Numeru domu", "Reklamy"],
        correctAnswerIndex: 0,
        explanation: "Kod BLIK może umożliwić wypłatę pieniędzy."
      },
      {
        question: "Czy należy czytać ekran autoryzacji BLIK?",
        options: ["Tak", "Nie", "Tylko przy dużych kwotach"],
        correctAnswerIndex: 0,
        explanation: "Ekran pokazuje kwotę i typ transakcji."
      }
    ]
  },
  {
    id: "fake-investments",
    title: "Jak działają fałszywe inwestycje?",
    durationMinutes: 8,
    explanation:
      "Fałszywe inwestycje kuszą pewnym zyskiem, reklamą znanej osoby lub telefonem konsultanta. Potem proszą o wpłaty i zdalny dostęp.",
    bullets: [
      "Nie ma pewnego, wysokiego zysku bez ryzyka.",
      "Sprawdź firmę w oficjalnych rejestrach.",
      "Nie instaluj aplikacji wskazanych przez konsultanta.",
      "Nie dopłacaj podatku, aby wypłacić rzekomy zysk."
    ],
    quiz: [
      {
        question: "Co jest sygnałem fałszywej inwestycji?",
        options: ["Gwarantowany zysk 300%", "Regulamin", "Numer telefonu firmy"],
        correctAnswerIndex: 0,
        explanation: "Gwarantowany wysoki zysk to klasyczny sygnał oszustwa."
      },
      {
        question: "Konsultant prosi o AnyDesk. Co zrobić?",
        options: ["Zainstalować", "Odmówić i zakończyć rozmowę", "Podać hasło"],
        correctAnswerIndex: 1,
        explanation: "Zdalny dostęp może dać oszustowi kontrolę nad urządzeniem."
      },
      {
        question: "Czy reklama ze znaną osobą zawsze jest prawdziwa?",
        options: ["Nie", "Tak", "Tylko w weekend"],
        correctAnswerIndex: 0,
        explanation: "Oszuści często wykorzystują fałszywe reklamy ze znanymi osobami."
      }
    ]
  },
  {
    id: "never-share",
    title: "Jakich danych nigdy nie udostępniać?",
    durationMinutes: 5,
    explanation:
      "Niektóre dane pozwalają przejąć konto, wziąć pożyczkę albo wykonać płatność. Traktuj je jak klucze do domu.",
    bullets: [
      "Nie udostępniaj hasła, PIN-u ani kodów SMS.",
      "Nie wysyłaj zdjęcia dowodu przypadkowej osobie.",
      "Nie podawaj numeru karty i CVV przez link z wiadomości.",
      "Nie przekazuj kodu BLIK w rozmowie."
    ],
    quiz: [
      {
        question: "Której informacji nie należy podawać przez telefon?",
        options: ["Pełnego hasła do banku", "Godziny spotkania", "Imienia psa"],
        correctAnswerIndex: 0,
        explanation: "Hasło do banku jest poufne."
      },
      {
        question: "Czy numer CVV z karty jest poufny?",
        options: ["Tak", "Nie", "Tylko za granicą"],
        correctAnswerIndex: 0,
        explanation: "CVV służy do autoryzacji płatności kartą."
      },
      {
        question: "Kod SMS z banku można przekazać konsultantowi?",
        options: ["Nie", "Tak", "Jeśli brzmi profesjonalnie"],
        correctAnswerIndex: 0,
        explanation: "Kod autoryzacyjny służy do potwierdzenia operacji przez właściciela konta."
      }
    ]
  },
  {
    id: "after-click",
    title: "Co zrobić po kliknięciu podejrzanego linku?",
    durationMinutes: 7,
    explanation:
      "Samo kliknięcie nie zawsze oznacza stratę, ale trzeba działać spokojnie. Największe ryzyko pojawia się po wpisaniu danych, instalacji pliku lub zatwierdzeniu płatności.",
    bullets: [
      "Nie wpisuj kolejnych danych na podejrzanej stronie.",
      "Jeśli podałeś dane karty, skontaktuj się z bankiem.",
      "Zmień hasło, jeśli wpisałeś login i hasło.",
      "Przeskanuj urządzenie, jeśli pobrałeś plik lub aplikację."
    ],
    quiz: [
      {
        question: "Kliknięto link, ale nic nie wpisano. Co dalej?",
        options: ["Zamknąć stronę i zachować ostrożność", "Wpisać dane dla testu", "Przesłać link znajomym"],
        correctAnswerIndex: 0,
        explanation: "Najpierw zamknij stronę i nie podawaj danych."
      },
      {
        question: "Podano dane karty na podejrzanej stronie. Co zrobić?",
        options: ["Skontaktować się z bankiem", "Czekać tydzień", "Odpisać oszustowi"],
        correctAnswerIndex: 0,
        explanation: "Bank może zablokować kartę i pomóc zabezpieczyć środki."
      },
      {
        question: "Pobrano podejrzaną aplikację. Co jest ważne?",
        options: ["Usunąć ją i sprawdzić urządzenie", "Dać jej wszystkie uprawnienia", "Zalogować się do banku"],
        correctAnswerIndex: 0,
        explanation: "Aplikacja może próbować przejąć dane lub SMS-y."
      }
    ]
  }
];
