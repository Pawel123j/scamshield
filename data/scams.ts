import type { ScamExample } from "@/lib/types";

export const scamExamples: ScamExample[] = [
  {
    id: "fake-bank-consultant",
    title: "Fałszywy konsultant banku",
    category: "Banking",
    riskLevel: "high",
    howItWorks:
      "Przestępca dzwoni i podaje się za pracownika banku. Mówi, że konto jest zagrożone, a następnie prosi o instalację aplikacji, kod BLIK albo dane logowania.",
    warningSigns: [
      "Rozmówca wywołuje panikę i mówi, że trzeba działać natychmiast.",
      "Prosi o zainstalowanie AnyDesk, TeamViewer lub udostępnienie ekranu.",
      "Chce kod BLIK, hasło, PIN lub autoryzację przelewu."
    ],
    whatToDo: [
      "Rozłącz się i samodzielnie zadzwoń na oficjalny numer banku.",
      "Nie instaluj aplikacji do zdalnego dostępu.",
      "Powiadom rodzinę lub zaufaną osobę."
    ],
    exampleMessage:
      "Dzień dobry, tu dział bezpieczeństwa banku. Ktoś próbuje ukraść pieniądze z Pani konta. Proszę natychmiast zainstalować AnyDesk i podać kod autoryzacji."
  },
  {
    id: "fake-delivery-payment",
    title: "Fałszywa dopłata do przesyłki",
    category: "Delivery",
    riskLevel: "high",
    howItWorks:
      "SMS informuje o małej dopłacie do paczki. Link prowadzi do fałszywej strony płatności, która wyłudza dane karty.",
    warningSigns: [
      "Wiadomość zawiera link skrócony lub dziwną domenę.",
      "Kwota jest mała, aby obniżyć czujność.",
      "Strona prosi o pełne dane karty i kod CVV."
    ],
    whatToDo: [
      "Nie klikaj linku z SMS-a.",
      "Sprawdź przesyłkę w oficjalnej aplikacji przewoźnika.",
      "Zablokuj kartę, jeśli dane zostały wpisane na podejrzanej stronie."
    ],
    exampleMessage:
      "Twoja paczka została wstrzymana. Dopłać 1,49 zł, aby ją odebrać: https://inpost-doplata.top"
  },
  {
    id: "blik-scam",
    title: "Wyłudzenie kodu BLIK",
    category: "BLIK",
    riskLevel: "high",
    howItWorks:
      "Oszust podszywa się pod znajomego lub członka rodziny i prosi o szybki kod BLIK. Po zatwierdzeniu transakcji pieniądze trafiają do przestępcy.",
    warningSigns: [
      "Prośba przychodzi z nowego numeru lub przejętego konta społecznościowego.",
      "Nadawca prosi o natychmiastową pomoc.",
      "Nie chce rozmawiać przez telefon."
    ],
    whatToDo: [
      "Zadzwoń do tej osoby innym kanałem.",
      "Nie podawaj kodu BLIK w wiadomości.",
      "Nie zatwierdzaj transakcji, której nie rozumiesz."
    ],
    exampleMessage:
      "Mamo, mam awarię telefonu i pilnie muszę zapłacić. Wygeneruj proszę kod BLIK, oddam wieczorem."
  },
  {
    id: "fake-police-officer",
    title: "Fałszywy policjant",
    category: "Identity Theft",
    riskLevel: "high",
    howItWorks:
      "Dzwoni osoba podająca się za policjanta i mówi, że pieniądze seniora są częścią tajnej akcji. Prosi o przekazanie gotówki lub wykonanie przelewu.",
    warningSigns: [
      "Rozmówca mówi o tajnej akcji i zakazuje kontaktu z rodziną.",
      "Prosi o wypłatę pieniędzy lub przekazanie ich kurierowi.",
      "Straszy konsekwencjami prawnymi."
    ],
    whatToDo: [
      "Rozłącz się i zadzwoń pod 112 lub do najbliższej komendy.",
      "Nie przekazuj pieniędzy nieznanym osobom.",
      "Powiedz rodzinie, co się stało."
    ],
    exampleMessage:
      "Tu policja. Pani konto jest obserwowane przez przestępców. Proszę wypłacić oszczędności i nikomu o tym nie mówić."
  },
  {
    id: "fake-grandchild",
    title: "Oszustwo na wnuczka",
    category: "Family Emergency",
    riskLevel: "high",
    howItWorks:
      "Przestępca udaje wnuka, córkę lub syna. Opowiada o wypadku, długu lub pilnej potrzebie pieniędzy.",
    warningSigns: [
      "Rozmówca naciska na szybkie przekazanie pieniędzy.",
      "Nie chce, aby senior kontaktował się z innymi członkami rodziny.",
      "Historia jest dramatyczna i trudna do sprawdzenia."
    ],
    whatToDo: [
      "Zadzwoń do tej osoby na znany numer.",
      "Poproś o pomoc innego członka rodziny.",
      "Nie przekazuj gotówki kurierowi."
    ],
    exampleMessage:
      "Babciu, miałem wypadek i muszę pilnie zapłacić kaucję. Nie mów mamie, proszę, wyślę kolegę po pieniądze."
  },
  {
    id: "fake-investment-platform",
    title: "Fałszywa platforma inwestycyjna",
    category: "Investment",
    riskLevel: "high",
    howItWorks:
      "Reklama obiecuje wysokie zyski bez ryzyka. Konsultant prowadzi ofiarę przez rejestrację i zachęca do coraz większych wpłat.",
    warningSigns: [
      "Obietnica gwarantowanego zysku.",
      "Nacisk na szybką wpłatę.",
      "Prośba o zdalny dostęp do urządzenia."
    ],
    whatToDo: [
      "Sprawdź firmę w rejestrach KNF.",
      "Nie wpłacaj pieniędzy pod presją.",
      "Nie instaluj aplikacji wskazanych przez konsultanta."
    ],
    exampleMessage:
      "Zarabiaj 300% miesięcznie dzięki naszej platformie. Konsultant pomoże uruchomić konto już dziś."
  },
  {
    id: "fake-crypto-profit",
    title: "Fałszywy zysk z kryptowalut",
    category: "Crypto",
    riskLevel: "high",
    howItWorks:
      "Ofiara widzi fałszywy panel z rosnącym zyskiem. Aby wypłacić pieniądze, musi opłacić prowizję, podatek albo kolejną inwestycję.",
    warningSigns: [
      "Panel pokazuje zysk, którego nie da się wypłacić.",
      "Wymagana jest dodatkowa opłata.",
      "Konsultant prosi o instalację portfela lub aplikacji z linku."
    ],
    whatToDo: [
      "Nie dopłacaj kolejnych pieniędzy.",
      "Zbierz dowody i zgłoś sprawę bankowi.",
      "Skonsultuj sytuację z rodziną lub prawnikiem."
    ],
    exampleMessage:
      "Na Twoim koncie BTC czeka 18 400 zł zysku. Opłać podatek 799 zł, aby wypłacić środki."
  },
  {
    id: "fake-marketplace-buyer",
    title: "Fałszywy kupujący OLX/Vinted",
    category: "Marketplace",
    riskLevel: "high",
    howItWorks:
      "Kupujący wysyła link do rzekomego odbioru pieniędzy. Strona udaje płatność, ale prosi sprzedawcę o dane karty.",
    warningSigns: [
      "Kupujący nalega na komunikację poza platformą.",
      "Link prowadzi do strony podobnej do OLX, Vinted lub InPost.",
      "Sprzedawca ma podać dane karty, aby otrzymać pieniądze."
    ],
    whatToDo: [
      "Zostań w oficjalnym czacie platformy.",
      "Nie wpisuj danych karty, aby odebrać pieniądze.",
      "Zgłoś profil kupującego w serwisie."
    ],
    exampleMessage:
      "Już opłaciłam zakup. Odbierz pieniądze tutaj: https://olx-payments-safe.click"
  },
  {
    id: "fake-invoice",
    title: "Fałszywa faktura",
    category: "Identity Theft",
    riskLevel: "medium",
    howItWorks:
      "E-mail z załącznikiem udaje fakturę, wezwanie do zapłaty lub korektę. Załącznik może zawierać złośliwe oprogramowanie.",
    warningSigns: [
      "Nadawca jest nieznany lub adres wygląda nietypowo.",
      "Załącznik ma dziwne rozszerzenie.",
      "Wiadomość grozi odsetkami lub windykacją."
    ],
    whatToDo: [
      "Nie otwieraj nieoczekiwanych załączników.",
      "Zweryfikuj fakturę telefonicznie z firmą.",
      "Prześlij wiadomość do działu IT lub zaufanej osoby."
    ],
    exampleMessage:
      "W załączniku faktura po terminie. Brak płatności dziś skutkuje windykacją."
  },
  {
    id: "fake-job-offer",
    title: "Fałszywa oferta pracy",
    category: "Identity Theft",
    riskLevel: "medium",
    howItWorks:
      "Oferta obiecuje łatwy zarobek za proste zadania. Następnie wymaga opłaty aktywacyjnej, danych dokumentu albo instalacji aplikacji.",
    warningSigns: [
      "Wysoka pensja za bardzo mało pracy.",
      "Prośba o zdjęcie dowodu osobistego.",
      "Wpłata startowa lub zakup pakietu szkoleniowego."
    ],
    whatToDo: [
      "Sprawdź firmę i opinie w kilku źródłach.",
      "Nie wysyłaj skanu dowodu przez komunikator.",
      "Nie płać za możliwość rozpoczęcia pracy."
    ],
    exampleMessage:
      "Praca z domu 900 zł dziennie. Wyślij zdjęcie dowodu i wpłać 49 zł za aktywację konta."
  },
  {
    id: "malware-link",
    title: "Link do złośliwego oprogramowania",
    category: "Malware",
    riskLevel: "high",
    howItWorks:
      "Wiadomość zachęca do pobrania pliku, aktualizacji lub aplikacji. Po instalacji program może kraść hasła i SMS-y.",
    warningSigns: [
      "Aplikacja pochodzi spoza oficjalnego sklepu.",
      "Wiadomość prosi o wyłączenie zabezpieczeń.",
      "Link jest skrócony lub ma dziwną domenę."
    ],
    whatToDo: [
      "Pobieraj aplikacje tylko ze sklepu Google Play lub App Store.",
      "Nie instaluj plików APK z SMS-a.",
      "Przeskanuj urządzenie i zmień hasła, jeśli instalacja już nastąpiła."
    ],
    exampleMessage:
      "Twoja poczta wymaga nowej aplikacji bezpieczeństwa. Pobierz plik APK: bit.ly/poczta-update"
  },
  {
    id: "remote-desktop-scam",
    title: "Oszustwo na zdalny pulpit",
    category: "Remote Access",
    riskLevel: "high",
    howItWorks:
      "Przestępca prosi o instalację aplikacji do zdalnego dostępu, aby rzekomo pomóc w bankowości, inwestycji lub zwrocie pieniędzy.",
    warningSigns: [
      "Rozmówca chce widzieć ekran telefonu lub komputera.",
      "Prosi o logowanie do banku podczas udostępniania ekranu.",
      "Naciska, aby działać szybko."
    ],
    whatToDo: [
      "Nie udostępniaj ekranu podczas logowania do banku.",
      "Usuń aplikację zdalnego dostępu, jeśli została zainstalowana.",
      "Skontaktuj się z bankiem i sprawdź ostatnie transakcje."
    ],
    exampleMessage:
      "Aby odzyskać środki, proszę uruchomić TeamViewer i zalogować się do banku. Poprowadzę Panią krok po kroku."
  }
];
