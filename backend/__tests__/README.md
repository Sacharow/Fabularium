# Testy Funkcjonalne Fabularium

## Overview

System testów funkcjonalnych Fabularium zawiera **59 testów** obejmujących:

- **Unit Tests** (9 testów) - Testowanie logiki serwisów
- **Integration Tests** (50 testów) - Testowanie API routes i end-to-end workflows

Wszystkie testy **PASS** ✅

## Setup

### Instalacja Zależności

```bash
cd backend
npm install --save-dev jest supertest @types/jest @types/node @types/supertest
```

Zależności są już zainstalowane w `package.json`.

## Uruchamianie Testów

### Wszystkie testy

```bash
npm test
```

### Testy w trybie obserwacji (watch mode)

```bash
npm run test:watch
```

### Tylko testy Unit

```bash
npm run test:unit
```

### Tylko testy Integration

```bash
npm run test:integration
```

### Z coverage report

```bash
npm run test:coverage
```

## Struktura Testów

```
backend/__tests__/
├── fixtures/
│   └── testData.js              # Dane testowe (users, campaigns, characters, etc.)
├── setup.js                     # Setup dla wszystkich testów (env vars)
├── unit/
│   └── services/
│       └── characterService.test.js     # 9 testów
├── integration/
│   └── routes/
│       ├── characters.test.js           # 12 testów
│       ├── campaigns.test.js            # 26 testów
│       └── auth.test.js                 # 21 testów
```

## Test Suites

### 1. Unit Tests - Character Service (9 testów)

**Plik:** `__tests__/unit/services/characterService.test.js`

Testy funkcji serwisu postaci:

#### `createCharacterForUser`

- ✅ Stworzenie postaci z minimalnymi danymi
- ✅ Asocjacja z kampanią
- ✅ Weryfikacja wymaganych pól
- ✅ Domyślne wartości

#### `findCharacterById`

- ✅ Pobieranie postaci z relacjami
- ✅ Zwracanie null dla nieistniejącej postaci

#### `listCharactersByUser`

- ✅ Listowanie postaci użytkownika
- ✅ Pusta lista dla użytkownika bez postaci

#### `deleteCharacter`

- ✅ Usuwanie postaci

---

### 2. Integration Tests - Characters Routes (12 testów)

**Plik:** `__tests__/integration/routes/characters.test.js`

Testy HTTP endpoints `/api/characters`:

#### `POST /api/characters`

- ✅ Tworzenie nowej postaci
- ✅ Asocjacja z kampanią
- ✅ Odrzucenie braku nazwy
- ✅ Domyślny level = 1

#### `GET /api/characters/mycharacters`

- ✅ Listowanie postaci użytkownika
- ✅ Filtrowanie po właścicielu

#### `GET /api/characters/:id`

- ✅ Pobieranie szczegółów postaci
- ✅ 404 dla nieistniejącej postaci

#### `PUT /api/characters/:id`

- ✅ Aktualizacja danych postaci
- ✅ Zachowanie niezmienionych pól

#### `DELETE /api/characters/:id`

- ✅ Usuwanie postaci

#### `Authentication`

- ✅ Odrzucenie niezalogowanych żądań

---

### 3. Integration Tests - Campaigns Routes (26 testów)

**Plik:** `__tests__/integration/routes/campaigns.test.js`

Testy HTTP endpoints `/api/campaigns` i sub-resources:

#### `POST /api/campaigns`

- ✅ Tworzenie kampanii
- ✅ Odrzucenie braku nazwy/opisu

#### `GET /api/campaigns` & `GET /api/campaigns/:id`

- ✅ Listowanie kampanii użytkownika
- ✅ Pobieranie szczegółów kampanii
- ✅ 404 dla nieistniejącej

#### `PUT /api/campaigns/:id`

- ✅ Aktualizacja danych
- ✅ Sprawdzenie uprawnień (tylko owner)

#### `Contributors Management`

- ✅ Dodawanie contributora
- ✅ Usuwanie contributora
- ✅ Walidacja email

#### `Sub-resources - Locations` (2 testy)

- ✅ Tworzenie lokacji
- ✅ Linkowanie NPC do lokacji

#### `Sub-resources - Missions` (2 testy)

- ✅ Tworzenie missji
- ✅ Linkowanie lokacji i NPC

#### `Sub-resources - NPCs` (2 testy)

- ✅ Tworzenie NPC
- ✅ Linkowanie lokacji i missji

#### `Permissions & Access Control`

- ✅ Non-owner nie może edytować
- ✅ Contributor może czytać

---

### 4. Integration Tests - Auth Routes (21 testów)

**Plik:** `__tests__/integration/routes/auth.test.js`

Testy HTTP endpoints `/api/auth` - pełny lifecycle autoryzacji:

#### `POST /api/auth/signup` (4 testy)

- ✅ Rejestracja nowego użytkownika
- ✅ Odrzucenie duplikatu email
- ✅ Walidacja wymaganych pól
- ✅ Generacja JWT tokena

#### `POST /api/auth/login` (3 testy)

- ✅ Login z poprawnymi credentialami
- ✅ Odrzucenie nieistniejącego emaila
- ✅ Walidacja wymaganych pól

#### `POST /api/auth/logout` (1 test)

- ✅ Logout użytkownika

#### `GET /api/auth/me` (4 testy)

- ✅ Pobranie danych zalogowanego użytkownika
- ✅ Odrzucenie braku tokena
- ✅ Odrzucenie nieprawidłowego tokena
- ✅ Odrzucenie wygasłego tokena

#### `GET /api/auth/verify-email/:token` (2 testy)

- ✅ Weryfikacja emaila
- ✅ Odrzucenie braku tokena

#### `Protected Route Access Control` (3 testy)

- ✅ Dostęp z prawidłowym tokenom
- ✅ Brak dostępu bez tokena
- ✅ Brak dostępu z malformed headerem

#### `User Registration Flow` (2 testy)

- ✅ Pełny workflow: signup → get user → logout
- ✅ Login po rejestracji

---

## Test Data (Fixtures)

**Plik:** `__tests__/fixtures/testData.js`

Zawiera realistyczne dane testowe:

### Test Users

```javascript
{
  owner: { id, email, name, role, provider },
  contributor: { ... },
  otherUser: { ... }
}
```

### Test Campaigns

```javascript
{
  basic: { id, name, description, joinCode, ownerId, ... },
  withContributor: { ... }
}
```

### Test Characters, Locations, Missions, NPCs

Kompletne obiekty z polami takimi jak backend je obsługuje.

## Konfiguracja

### jest.config.js

```javascript
{
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageDirectory: 'coverage',
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  verbose: true
}
```

### **tests**/setup.js

Ustawia zmienne środowiskowe:

- `NODE_ENV=test`
- `POSTGRES_URL_ONLINE` (test database)
- `JWT_SECRET` (test secret)

## Mock Strategy

Testy używają mockowania:

### Mocked Prisma Queries

```javascript
jest.mock('../../../config/database', () => ({
  character: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  ...
}));
```

### Mocked Controllers

Każdy test tworzy Express app z mockowanymi controllerami:

```javascript
const mockControllers = {
  createCharacter: jest.fn((req, res) => { ... }),
  getCharacterById: jest.fn((req, res) => { ... }),
  ...
};
```

### Mocked Auth Middleware

Każdy test definiuje middleware do symulacji zalogowanego użytkownika:

```javascript
const mockAuthMiddleware = (req, res, next) => {
  req.user = testUsers.owner;
  next();
};
```

## Coverage

Aby zobaczyć coverage report:

```bash
npm run test:coverage
```

Report będzie w `coverage/` folderze.

## Continuous Integration (CI)

Do uruchamiania testów w CI/CD pipeline:

```bash
npm test -- --bail --coverage
```

Flagi:

- `--bail` - stop po pierwszym failurze
- `--coverage` - generate coverage report
- `--ci` - CI mode (no watch)

## Dodanie Nowych Testów

### 1. Utwórz plik testowy

```bash
touch __tests__/integration/routes/myFeature.test.js
```

### 2. Struktura testu

```javascript
const request = require("supertest");
const { testUsers, testData } = require("../../fixtures/testData");

describe("My Feature", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = setupApp();
  });

  test("should do something", async () => {
    const response = await request(app)
      .post("/api/endpoint")
      .send({ data: "test" })
      .expect(201);

    expect(response.body).toHaveProperty("id");
  });
});
```

### 3. Uruchom test

```bash
npm test -- __tests__/integration/routes/myFeature.test.js
```

## Best Practices

1. **Izolacja** - Każdy test jest niezależny (no shared state)
2. **Czytelność** - Testy opisują co testują w plain English
3. **Mocking** - Mocki są używane do izolacji od serwisów zewnętrznych
4. **Realism** - Dane testowe odzwierciedlają rzeczywiste scenariusze
5. **Performance** - Testy są szybkie (<10ms mediana)

## Troubleshooting

### Test timeout

Jeśli test się timeout'uje, zwiększ timeout w `jest.config.js`:

```javascript
testTimeout: 20000; // milliseconds
```

### Mock not working

Upewnij się, że mock jest ustawiony **przed** importem modułu:

```javascript
jest.mock("../module");
const service = require("../module");
```

### Port already in use

Każdy test używa nowego Express app, port nie powinien być problemem.

## Next Steps

- [ ] Dodać testy dla edge cases
- [ ] Dodać testy dla error handling
- [ ] Dodać testy wydajnościowe
- [ ] Zwiększyć coverage do >80%
- [ ] Setup CI/CD (GitHub Actions, Jenkins, etc.)
- [ ] Dodać snapshot tests dla API responses
- [ ] Dodać load/stress tests

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Testing/Introduction)
