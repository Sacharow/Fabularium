# Fabularium Frontend Tests

## Overview

Kompleksowy system testów frontendowych zawierający:

- **Component Tests** - testy jednostkowe komponentów React
- **Responsiveness Tests** - testy responsywności na różnych breakpointach
- **E2E Tests** - testy end-to-end z Playwright

## Setup

### Instalacja Zależności

```bash
cd frontend
npm install --save-dev \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom \
  @playwright/test
```

Wszystkie zależności są już zainstalowane w `package.json`.

## Struktura Testów

```
frontend/
├── vitest.config.ts                          # Konfiguracja Vitest
├── playwright.config.ts                      # Konfiguracja Playwright
├── src/__tests__/
│   ├── setup.ts                              # Setup dla Vitest
│   ├── fixtures/
│   │   └── mockData.ts                       # Mock data dla testów
│   ├── components/
│   │   ├── Sidebar.test.tsx                  # Testy Sidebar (6 testów)
│   │   └── SignIn.test.tsx                   # Testy SignIn (11 testów)
│   └── responsiveness/
│       └── responsiveness.test.tsx           # Testy responsywności (13 testów)
└── e2e/
    ├── auth-and-navigation.spec.ts           # Auth & Nav E2E (26 testów)
    └── campaigns-and-characters.spec.ts      # Campaign & Character E2E (28 testów)
```

## Uruchamianie Testów

### Unit & Component Tests

```bash
# Wszystkie testy
npm test

# Watch mode
npm run test:watch

# Z UI (Vitest UI)
npm run test:ui

# Tylko komponenty
npm run test:components

# Tylko testy responsywności
npm run test:responsiveness

# Z coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Wszystkie E2E testy
npm run e2e

# Z UI (interactive mode)
npm run e2e:ui

# Debug mode
npm run e2e:debug

# Specific test file
npx playwright test e2e/auth-and-navigation.spec.ts
```

## Test Suites

### 1. Component Tests - Sidebar (6 testów)

**Plik:** `src/__tests__/components/Sidebar.test.tsx`

#### Rendering & Structure

- ✅ Renderowanie nawigacji sidebar
- ✅ Aktywny link styling
- ✅ Dostępność (ARIA labels)
- ✅ Menu użytkownika (jeśli zalogowany)
- ✅ Collapse/expand na mobile

#### Responsiveness

- ✅ Widoczne na desktop (1024px+)
- ✅ Mobile-friendly menu na małych ekranach

---

### 2. Component Tests - SignIn Form (11 testów)

**Plik:** `src/__tests__/components/SignIn.test.tsx`

#### Form Rendering

- ✅ Renderowanie formularza
- ✅ Pola email i password
- ✅ Walidacja wymaganych pól
- ✅ Wprowadzanie danych
- ✅ Link do sign up

#### Accessibility

- ✅ Proper labels
- ✅ Submit button

#### Mobile Responsiveness

- ✅ Pełna funkcjonalność na mobile (375x667)
- ✅ Pełna funkcjonalność na tablet (768x1024)
- ✅ Pełna funkcjonalność na desktop (1920x1080)

---

### 3. Responsiveness Tests (13 testów)

**Plik:** `src/__tests__/responsiveness/responsiveness.test.tsx`

#### Layout Grid Responsiveness

- ✅ Renderowanie responsive layout
- ✅ Grid styling

#### Mobile Breakpoint (320px - 480px)

- ✅ Renderowanie na mobile
- ✅ Stacking cards
- ✅ Readable font sizes

#### Tablet Breakpoint (768px - 1024px)

- ✅ Renderowanie na tablet
- ✅ 2-column layout

#### Desktop Breakpoint (1920px+)

- ✅ Renderowanie na desktop
- ✅ 3-column layout
- ✅ Adequate spacing

#### Font Sizing

- ✅ Responsive fonts z `clamp()`

#### Touch Targets

- ✅ Minimum 44px touch target size
- ✅ Clickable on touch devices

#### Orientation Changes

- ✅ Portrait (375x667)
- ✅ Landscape (667x375)
- ✅ Orientation change events

---

### 4. E2E Tests - Auth & Navigation (26 testów)

**Plik:** `e2e/auth-and-navigation.spec.ts`

#### Authentication Flow (4 testy)

- ✅ Navigacja do sign in
- ✅ Formularz sign in
- ✅ Nawigacja do sign up
- ✅ Password reset link

#### Campaign Creation (3 testy)

- ✅ Navigacja na campaigns page
- ✅ Wyświetlanie listy / empty state
- ✅ Otwieranie modal do tworzenia

#### Character Creation (3 testy)

- ✅ Navigacja do characters page
- ✅ Wyświetlanie listy postaci
- ✅ Button do tworzenia

#### Navigation (3 testy)

- ✅ Sidebar na desktop
- ✅ Nawigacja między stronami
- ✅ Error handling

#### Responsive Design (4 testy)

- ✅ Funkcjonalność na mobile (375x667)
- ✅ Funkcjonalność na tablet (768x1024)
- ✅ Funkcjonalność na desktop (1920x1080)
- ✅ Orientacja portrait i landscape

#### Performance (2 testy)

- ✅ Szybkie ładowanie
- ✅ Brak JavaScript errors

#### Accessibility (5 testów)

- ✅ Heading hierarchy
- ✅ Alt text na obrazach
- ✅ Descriptive link text
- ✅ Form labels
- ✅ Keyboard navigation

#### Error Handling (2 testy)

- ✅ Network errors
- ✅ User-friendly messages

---

### 5. E2E Tests - Campaigns & Characters (28 testów)

**Plik:** `e2e/campaigns-and-characters.spec.ts`

#### Campaign Management (4 testy)

- ✅ Wyświetlanie listy kampanii
- ✅ Otwieranie detali
- ✅ Wyświetlanie sekcji
- ✅ Szczegóły kampanii

#### Character Management (4 testy)

- ✅ Wyświetlanie listy postaci
- ✅ Otwieranie detali
- ✅ Wyświetlanie informacji
- ✅ Sekcje (General, Personal, Stats)

#### Campaign Sub-Resources (2 testy)

- ✅ Wyświetlanie sekcji
- ✅ Przełączanie między sekcjami

#### Content Editing (3 testy)

- ✅ Edytowanie szczegółów
- ✅ Zapisywanie zmian
- ✅ Anulowanie edytów

#### Data Persistence (2 testy)

- ✅ Trwałość danych po reload
- ✅ Stan nawigacji

#### User Feedback (3 testy)

- ✅ Loading states
- ✅ Success messages
- ✅ Error messages

#### Additional Coverage (10 testów)

- ✅ Różne scenariusze na różnych breakpointach
- ✅ Interakcje użytkownika
- ✅ Edge cases

---

## Mock Data (Fixtures)

**Plik:** `src/__tests__/fixtures/mockData.ts`

Zawiera realistyczne dane:

```typescript
mockUser; // Zalogowany użytkownik
mockCampaign; // Kampania z danymi
mockCharacter; // Postać z full stats
mockLocation; // Lokacja
mockMission; // Misja/Quest
mockNPC; // NPC

createMockAuthContext(); // Helper do mocking auth
createMockCampaign(); // Helper do tworzenia kampanii
createMockCharacter(); // Helper do tworzenia postaci
```

## Konfiguracja

### vitest.config.ts

```typescript
{
  environment: 'jsdom',
  setupFiles: ['./src/__tests__/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
  }
}
```

### playwright.config.ts

```typescript
{
  baseURL: 'http://localhost:5173',
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
    { name: 'Mobile Chrome' },
    { name: 'Mobile Safari' }
  ],
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: true
  }
}
```

### src/**tests**/setup.ts

- Setup `@testing-library/jest-dom`
- Mock `localStorage`
- Mock `window.matchMedia` dla responsiveness tests
- Global cleanup po każdym teście

## Testowanie Responsywności

### Breakpoints testowane

| Typ              | Wymiary   | Test             |
| ---------------- | --------- | ---------------- |
| Mobile           | 375x667   | Portrait mobile  |
| Mobile Landscape | 667x375   | Mobile landscape |
| Tablet           | 768x1024  | Portrait tablet  |
| Tablet Landscape | 1024x768  | Landscape tablet |
| Desktop          | 1920x1080 | Full desktop     |
| Ultra-wide       | 2560x1440 | 2K/4K screens    |

### Touch Target Testing

- Minimum 44px (Apple standard)
- Adequate padding
- Touch event handling

### Orientation Change Testing

- Portrait ↔ Landscape transitions
- Event listeners
- Layout recalculation

## Best Practices

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('component interaction', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  const button = screen.getByRole('button');
  await user.click(button);

  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### Responsiveness Testing

```typescript
it('should work on mobile', () => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: query === '(max-width: 768px)',
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  render(<MyComponent />);
  // Assert mobile behavior
});
```

### E2E Testing

```typescript
test("user workflow", async ({ page }) => {
  await page.goto("/");
  await page.click('button:has-text("Create")');
  await page.fill('input[name="name"]', "Test");
  await page.click('button:has-text("Save")');

  await expect(page.locator("text=Test")).toBeVisible();
});
```

## Debugging

### Vitest Debugging

```bash
# Watch mode with debugging
npm run test:watch

# UI mode
npm run test:ui

# Debug specific test
npx vitest src/__tests__/components/SignIn.test.tsx --watch
```

### Playwright Debugging

```bash
# UI mode (interactive)
npm run e2e:ui

# Debug mode
npm run e2e:debug

# Slow motion
npx playwright test --headed --slow-mo 1000
```

### Screenshots & Traces

Playwright automatycznie zbiera:

- Screenshots na failure
- Traces dla debugging
- Video recordings (opcjonalnie)

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run unit tests
  run: npm test -- --coverage

- name: Run E2E tests
  run: npm run e2e
```

### Pre-commit Hook

```bash
npm test -- --bail --coverage
```

## Coverage Goals

**Current:** Unit & Component tests
**Target:** >80% coverage

```bash
npm run test:coverage
```

## Common Issues

### matchMedia not working

```typescript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({...}))
});
```

### Async test timeout

```typescript
{
  timeout: 10000;
} // increase in vitest.config.ts
```

### E2E test flakiness

```typescript
await page.waitForLoadState("networkidle");
await expect(element).toBeVisible(); // instead of isVisible()
```

## Next Steps

- [ ] Add snapshot tests
- [ ] Add visual regression tests
- [ ] Increase coverage to >80%
- [ ] Add performance benchmarks
- [ ] Setup CI/CD pipelines
- [ ] Add accessibility audit (axe)
- [ ] Add visual testing (Percy)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)
