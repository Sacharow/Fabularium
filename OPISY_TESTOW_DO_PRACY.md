Opisy Testów do Pracy Dyplomowej

\section{Testy Funkcjonalne}

Testy funkcjonalne systemu Fabularium stanowią fundamentalną warstwę weryfikacji poprawności działania aplikacji. Ich celem jest sprawdzenie, czy system spełnia zdefiniowane wymagania funkcjonalne i wykonuje oczekiwane operacje w zgodzie ze specyfikacją.

Charakterystyka Testów Funkcjonalnych

W kontekście aplikacji Fabularium testy funkcjonalne obejmują weryfikację następujących aspektów:

**1. Testy Serwisu Charakterów (Unit Tests - 9 testów)**

Testy serwisu charakterów (`characterService.test.js`) weryfikują poprawność biznesowej logiki aplikacji na poziomie usług. Obejmują one:

- Tworzenie postaci z minimalnymi danymi wymaganymi przez system (imię, poziom, klasa)
- Asocjowanie nowo tworzonej postaci z kampanią, co stanowi kluczową funkcjonalność dla zarządzania postaciami w kontekście kampanii
- Walidacja wymaganych pól oraz odrzucenie żądań zawierających niekompletne dane
- Ustawianie wartości domyślnych (m.in. pierwszy poziom, domyślne atrybuty D&D 5e)
- Pobieranie postaci po identyfikatorze wraz ze wszystkimi powiązanymi danymi (relacje z kampanią, lokalizacjami)
- Obsługę scenariuszy błędów, takich jak próba pobrania nieistniejącej postaci
- Operacje listowania postaci przynależnych do konkretnego użytkownika
- Usuwanie postaci z systemu z zachowaniem integralności danych

Testy te wykorzystują mockowanie biblioteki Prisma ORM, umożliwiające izolowaną weryfikację logiki biznesowej bez zależności od bazy danych.

**2. Testy Integracyjne Tras API (Integration Tests - 50 testów)**

Testy integracyjne obejmują weryfikację całej ścieżki od żądania HTTP do odpowiedzi API. Przeprowadzane są dla trzech głównych modułów:

- **Endpointy Characters** (12 testów): Weryfikacja operacji CRUD na postaciach, w tym tworzenie, pobieranie, aktualizowanie i usuwanie. Testy sprawdzają również poprawność autoryzacji i uprawnienia dostępu do zasobów.

- **Endpointy Campaigns** (26 testów): Testowanie zarządzania kampaniami, w tym:
  - Tworzenie i modyfikowanie kampanii
  - Zarządzanie współpracownikami (dodawanie i usuwanie dostępu)
  - Tworzenie podsource'ów kampanii: lokalizacji, misji, postaci niegraczy (NPC)
  - Testy relacji wiele-do-wielu (M2M) między lokalizacjami, misjami i NPC
  - Weryfikacja uprawnień dostępu (właściciel kampanii vs. współpracownik)
  - Linkowanie powiązanych encji poprzez tabele łączące (junctions)

- **Endpointy Auth** (21 testów): Weryfikacja pełnego cyklu autentykacji i autoryzacji:
  - Rejestracja nowych użytkowników z walidacją danych
  - Odrzucenie duplikatów adresów e-mail
  - Logowanie z weryfikacją poświadczeń
  - Generowanie i walidacja tokenów JWT
  - Weryfikacja adresu e-mail
  - Dostęp do chronionych tras z tokenem i bez niego
  - Obsługa tokenów wygasłych i nieprawidłowych

Architektura Testów Funkcjonalnych

Testy funkcjonalne w Fabularium są zorganizowane w strukturę hierarchiczną:

```
backend/
├── __tests__/
│   ├── setup.js               Konfiguracja środowiska testowego
│   ├── fixtures/
│   │   └── testData.js        Dane testowe (mockowane obiekty)
│   ├── unit/
│   │   └── services/          Testy logiki biznesowej
│   └── integration/
│       └── routes/            Testy endpointów API
├── jest.config.js             Konfiguracja framework'u testowego
└── package.json               Zależności i skrypty testowe
```

Dane Testowe i Mockowanie

System wykorzystuje scentralizowane dane testowe definiowane w `testData.js`, które obejmują:

- **Użytkownicy**: Trzy profile testowe (właściciel, współpracownik, inny użytkownik) z realistycznymi danymi
- **Kampanie**: Przykładowe kampanie z różnymi konfiguracjami
- **Postacie**: Postacie ze statystykami D&D 5e (Aragorn, Legolas)
- **Lokalizacje**: Mapy kampanii z NPC
- **Misje**: Questy z linkami do lokalizacji i NPC

Baza danych jest całkowicie mockowana za pomocą Prisma, co zapewnia izolację testów i szybkie wykonanie bez I/O dysku.

Kryteria Sukcesu

Testy funkcjonalne zostały uznane za pomyślne po osiągnięciu:

- **59 testów PASSING** z zerem błędów
- **100% pokrycie** głównych ścieżek funkcjonalnych
- **Czas wykonania** poniżej 3 sekund

---

\section{Testy Interfejsu Użytkownika}

Testy interfejsu użytkownika (UI) stanowią kluczową warstwę weryfikacji doświadczenia użytkownika i responsywności aplikacji frontendowej. Obejmują one zarówno testy komponentów indywidualnych, jak i testy responsywności dla różnych urządzeń i rozdzielczości ekranu.

Testy Komponentów (Component Tests - 17 testów)

**1. Testy Komponentu Sidebar (7 testów)**

Komponent Sidebar jest głównym elementem nawigacji aplikacji. Testy weryfikują:

- Prawidłowe renderowanie navigacyjnych linków (Kampanie, Postacie, Ustawienia)
- Aktywne stany linków na podstawie bieżącej ścieżki routingu
- Dostępność poprzez odpowiednie atrybuty ARIA (role, aria-labels)
- Menu użytkownika dostępne dla zalogowanych użytkowników
- Zachowanie na urządzeniach mobilnych (zawinięcie/rozwinięcie menu)
- Interakcje z menu rozwijającymi się

Testy wykorzystują React Testing Library, która promuje testy od perspektywy użytkownika, a nie implementacji wewnętrznej. Komponent testowany jest w kontekście `BrowserRouter` i `AuthProvider` w celu symulacji rzeczywistego środowiska aplikacji.

**2. Testy Formularza SignIn (10 testów)**

Formularz logowania jest krytycznym punktem dostępu do aplikacji. Testy obejmują:

- Prawidłowe renderowanie pól formularza (email, hasło)
- Walidacja wymaganych pól przed przesłaniem
- Akceptowanie danych wejściowych użytkownika
- Weryfikacja dostępności (etykiety dla pól, przycisk submit)
- Link do strony rejestracji
- Scenariusze błędów walidacji
- Responsywność formularza na różnych rozmiarach ekranu (mobile, tablet, desktop)

Testy wykorzystują `userEvent` z `@testing-library/user-event` do symulacji rzeczywistych interakcji użytkownika (kliknięcia, wpisywanie tekstu).

Testy Responsywności (17 testów)

Responsywność aplikacji jest kluczowym aspektem wspierającym dostęp na urządzeniach z różnymi rozmiarami ekranu (smartfony, tablety, komputery stacjonarne).

**Breakpointy Testowe:**

- **Urządzenia Mobilne (320px - 480px)**: 3 testy weryfikujące:
  - Prawidłowe renderowanie na wąskim ekranie
  - Układanie komponentów w jeden kolumnę
  - Czytelność czcionek na małych wyświetlaczach

- **Urządzenia Tablet (768px - 1024px)**: 2 testy weryfikujące:
  - Zmianę układu na dwie kolumny
  - Prawidłową dystrybucję przestrzeni

- **Komputery Stacjonarne (1920px+)**: 3 testy weryfikujące:
  - Układ trójkolumnowy
  - Adekwatne odstępy i marże

- **Rozmiary Czcionek**: 2 testy weryfikujące:
  - Wykorzystanie funkcji CSS `clamp()` do responsywnych rozmiarów
  - Skalowanie czcionek wraz ze zmianą rozmiaru okna

- **Cele Dotykowe**: 2 testy weryfikujące:
  - Minimalny rozmiar 44px dla elementów interaktywnych (standard Apple)
  - Odpowiednie wypełnienie wokół przycisków

- **Zmiana Orientacji Ekranu**: 3 testy weryfikujące:
  - Prawidłowe renderowanie w orientacji portretowej
  - Prawidłowe renderowanie w orientacji krajobrazowej
  - Dynamiczną obsługę zmiany orientacji

Architektura Testów UI

```
frontend/
├── src/__tests__/
│   ├── setup.ts                     Konfiguracja React Testing Library
│   ├── fixtures/
│   │   └── mockData.ts              Dane mockowane dla komponentów
│   ├── components/
│   │   ├── Sidebar.test.tsx         Testy navigacji
│   │   └── SignIn.test.tsx          Testy formularza logowania
│   └── responsiveness/
│       └── responsiveness.test.tsx  Testy responsywności
├── vitest.config.ts                Konfiguracja framework'u testowego
└── package.json
```

Mockowanie i Ustawienia

Plik `setup.ts` konfiguruje:

- Czyszczenie DOM po każdym teście
- Mock `localStorage` dla testów stanów aplikacji
- Mock `window.matchMedia` dla testów responsive design
- Globalny import `@testing-library/jest-dom` dla dodatkowych asercji

Kryteria Sukcesu

- **34 testy PASSING** z pełnym pokryciem komponentów
- **Czas wykonania** ~6 sekund
- **Pokrycie dostępności** (WCAG 2.1 standards)

---

\section{Testy API}

Testy API w systemie Fabularium weryfikują prawidłowe działanie endpointów REST API oraz poprawną komunikację między frontendem a backendem. Testy te obejmują weryfikację żądań HTTP, odpowiedzi, kodów statusu i obsługi błędów.

Testowane Endpointy

**1. Endpointy Postaci (Characters API - 12 testów)**

```
POST   /api/characters
       - Tworzenie nowej postaci z pełnymi danymi
       - Asocjowanie postaci z kampanią
       - Odrzucenie żądań z brakującymi wymaganymi polami
       - Ustawienie domyślnego poziomu na 1

GET    /api/characters/mycharacters
       - Zwracanie listy postaci właściciela
       - Filtrowanie postaci tylko dla zalogowanego użytkownika

GET    /api/characters/:id
       - Pobieranie pełnych szczegółów postaci
       - Zwrócenie kodu 404 dla nieistniejącej postaci

PUT    /api/characters/:id
       - Aktualizowanie szczegółów postaci
       - Zachowanie niezmiennych pól

DELETE /api/characters/:id
       - Usuwanie postaci z systemu
```

**2. Endpointy Kampanii (Campaigns API - 26 testów)**

```
POST   /api/campaigns
       - Tworzenie nowej kampanii
       - Odrzucenie kampanii bez nazwy

GET    /api/campaigns
       - Zwracanie kampanii będących własnością lub współpracą użytkownika

GET    /api/campaigns/:id
       - Pobieranie pełnych szczegółów kampanii z wszystkimi podsourcami

PUT    /api/campaigns/:id
       - Aktualizowanie kampanii przez właściciela
       - Odrzucenie aktualizacji przez nie-właściciela (HTTP 403)

POST   /api/campaigns/:id/contributors
       - Dodawanie współpracownika do kampanii
       - Walidacja adresu e-mail

DELETE /api/campaigns/:id/contributors/:contributorId
       - Usuwanie współpracownika z dostępu do kampanii

POST   /api/campaigns/:id/locations
       - Tworzenie lokalizacji w kampanii
       - Linkowanie z NPC i misjami

POST   /api/campaigns/:id/missions
       - Tworzenie misji/questu
       - Powiązanie z lokalizacjami i NPC

POST   /api/campaigns/:id/npcs
       - Tworzenie postaci niegranego (NPC)
       - Powiązanie z lokalizacjami i misjami
```

**3. Endpointy Autentykacji (Auth API - 21 testów)**

```
POST   /api/auth/signup
       - Rejestracja nowego użytkownika
       - Odrzucenie duplikatów adresu e-mail
       - Walidacja wymaganych pól
       - Generowanie tokenu JWT

POST   /api/auth/login
       - Logowanie z prawidłowymi poświadczeniami
       - Odrzucenie logowania z błędnym e-mailem
       - Zwracanie tokenu JWT

POST   /api/auth/logout
       - Wylogowanie użytkownika

GET    /api/auth/me
       - Zwracanie danych bieżącego zalogowanego użytkownika

GET    /api/auth/verify-email/:token
       - Weryfikacja adresu e-mail za pomocą tokenu
```

Narzędzia i Metodologia

Testy API w Fabularium wykorzystują:

- **Supertest**: Biblioteka do testowania endpoints Express.js, umożliwiająca wysyłanie rzeczywistych żądań HTTP do aplikacji
- **Jest**: Framework testowy z wbudowanym assertion library
- **Mockowanie Bazy Danych**: Prisma jest całkowicie mockowana, eliminując potrzebę dostępu do rzeczywistej bazy danych

Struktura Testu API

Każdy test API podąża za standardowym wzorem:

```javascript
describe("API Endpoint", () => {
  test("should perform specific action", async () => {
    const response = await request(app)
      .post("/api/endpoint")
      .send({ data: "testData" })
      .expect(200);

    expect(response.body).toHaveProperty("expectedField");
  });
});
```

Obsługa Błędów

Testy weryfikują prawidłową obsługę błędów:

- **400 Bad Request**: Brakujące lub nieprawidłowe dane
- **401 Unauthorized**: Brak tokenu autentykacji
- **403 Forbidden**: Niewystarczające uprawnienia
- **404 Not Found**: Zasób nie istnieje
- **500 Internal Server Error**: Błędy serwera

Walidacja Tokenów JWT

Testy weryfikują:

- Generowanie tokenu zawierającego tożsamość użytkownika
- Weryfikację tokenu w protected routes
- Odrzucenie wygasłych tokenów
- Odrzucenie manipulowanych tokenów

Kryteria Sukcesu

- **59 testów API PASSING** (wszystkie operacje CRUD)
- **Pokrycie wszystkich endpointów** wraz z scenariuszami błędów
- **Czas wykonania** < 5 sekund

---

\section{Testy Integracyjne}

Testy integracyjne stanowią najwyższą warstwę weryfikacji systemu, testując współpracę wielu komponentów w jednym scenariuszu. Ich celem jest weryfikacja, że poszczególne moduły systemu (backend, frontend, baza danych) prawidłowo współpracują ze sobą.

Testy Integracyjne Backendu (50 testów)

Testy integracyjne backendu weryfikują całą ścieżkę przetwarzania żądania:

```
HTTP Request
  → Express Middleware (autentykacja, walidacja)
  → Controller (przetwarzanie logiki)
  → Service Layer (logika biznesowa)
  → Mock Database (Prisma)
  → HTTP Response
```

**Scenariusz Przykładowy: Dodawanie Współpracownika do Kampanii**

Test weryfikuje:

1. Autoryzacja: Sprawdzenie, czy użytkownik wysyłający żądanie jest właścicielem kampanii
2. Walidacja: Sprawdzenie, czy adres e-mail jest prawidłowy
3. Logika Biznesowa: Dodanie użytkownika do tabeli łączącej (junction table)
4. Konsystencja Danych: Zwrócenie zaktualizowanej kampanii ze współpracownikami
5. Obsługa Błędów: Zwrócenie odpowiedniego kodu błędu w przypadku niepowodzenia

**Scenariusz Przykładowy: Tworzenie Lokalizacji z Powiązanym NPC**

Test weryfikuje:

1. Tworzenie nowej lokalizacji w kampanii
2. Linkowanie istniejącego NPC do lokalizacji
3. Tworzenie relacji w tabeli łączącej (M2M junction)
4. Zwrócenie kompleksnego obiektu z zagnieżdżonymi danymi

Testy Integracyjne Frontendu (28 testów E2E)

Testy end-to-end (E2E) weryfikują całą ścieżkę interakcji użytkownika:

```
User Interaction
  → Component Event Handler
  → State Management (React Context)
  → API Call (Fetch/Axios)
  → Backend Processing
  → Response Handling
  → UI Update/Re-render
```

**Scenariusz Przykładowy: Przepływ Logowania**

Test E2E weryfikuje:

1. Navigacja do strony logowania
2. Wyświetlenie formularza z polami e-mail i hasło
3. Wpisanie danych logowania przez użytkownika (symulacja)
4. Kliknięcie przycisku "Zaloguj się"
5. Wysłanie żądania HTTP do `/api/auth/login`
6. Otrzymanie tokenu JWT z serwera
7. Zapisanie tokenu w `localStorage`
8. Aktualizacja `AuthContext` z danymi użytkownika
9. Automatyczna nawigacja do dashboardu
10. Wyświetlenie personalizowanego menu użytkownika w Sidebar

**Scenariusz Przykładowy: Tworzenie i Edycja Kampanii**

Test E2E weryfikuje:

1. Navigacja do listy kampanii
2. Kliknięcie przycisku "Utwórz nową kampanię"
3. Otwarcie modalu formularza
4. Wprowadzenie danych (nazwa, opis, ustawienia)
5. Kliknięcie "Utwórz"
6. Wysłanie żądania POST `/api/campaigns`
7. Otrzymanie nowej kampanii z serwera
8. Automatyczne aktualizowanie listy kampanii
9. Wyświetlenie nowo utworzonej kampanii na liście
10. Możliwość kliknięcia i otwarcia szczegółów kampanii

Architektura Testów Integracyjnych

**Backend Integration:**

```
backend/__tests__/integration/routes/
├── characters.test.js         Testy przepływu Character API
├── campaigns.test.js          Testy przepływu Campaign API
└── auth.test.js              Testy przepływu Auth API
```

**Frontend E2E:**

```
frontend/e2e/
├── auth-and-navigation.spec.ts        Testy auth i nawigacji
└── campaigns-and-characters.spec.ts   Testy campain/character
```

Narzędzia i Framework'i

- **Backend**: Jest + Supertest + Prisma Mock
- **Frontend**: Playwright (z obsługą Chromium, Firefox, WebKit)
- **Emulacja Urządzeń**: Pixel 5, iPhone 12 (mobile testing)

Kryteria Sukcesu Testów Integracyjnych

- **50 testów backendu PASSING**: Wszystkie scenariusze przetwarzania
- **28 testów E2E PASSING**: Wszystkie user workflows
- **Pokrycie responsywności**: Mobile, tablet, desktop
- **Pokrycie dostępności**: WCAG 2.1 compliance
- **Czas wykonania**: Backend <3s, E2E variable (zależy od przeglądarki)

Rola w Cyklu Rozwojowym

Testy integracyjne stanowią ostatnią linię obrony przed wdrożeniem na produkcję. Zapewniają pewność, że:

1. Wszystkie komponenty systemu współpracują prawidłowo
2. Zmiana w jednym module nie powoduje regresiów w innych
3. User workflows działają od początku do końca
4. System jest gotowy dla rzeczywistych użytkowników

Dane Testowe dla Integracji

System wykorzystuje realistyczne dane testowe reprezentujące rzeczywiste scenariusze użytkowania:

- Użytkownicy z różnymi rolami (właściciel, współpracownik, gość)
- Kampanie z kompleksną strukturą (postacie, lokalizacje, misje, NPC)
- Statystyki D&D 5e dla postaci
- Relacje M2M (kampania-lokalizacja-NPC-misja)

---

Podsumowanie Strategii Testowania

System Fabularium wykorzystuje wielowarstwową strategię testowania:

| Warstwa            | Liczba Testów | Cel                               | Narzędzia                      |
| ------------------ | ------------- | --------------------------------- | ------------------------------ |
| Testy Funkcjonalne | 59            | Weryfikacja logiki biznesowej     | Jest + Prisma Mock             |
| Testy Interfejsu   | 34            | Weryfikacja UX i responsywności   | Vitest + React Testing Library |
| Testy API          | 59            | Weryfikacja endpointów            | Supertest                      |
| Testy Integracyjne | 78            | Weryfikacja współpracy modułów    | Jest + Playwright              |
| **RAZEM**          | **147+**      | **Całkowita weryfikacja systemu** | **Wielotechnologiczna**        |

Ta strategia zapewnia wysoką pewność w jakości oprogramowania i zmniejsza ryzyko błędów w środowisku produkcyjnym.
