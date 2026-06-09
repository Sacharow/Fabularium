# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-and-navigation.spec.ts >> Authentication Flow >> should navigate to sign up from sign in page
- Location: e2e\auth-and-navigation.spec.ts:35:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a:has-text("Sign up")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a:has-text("Sign up")')

```

```yaml
- complementary:
  - link "FABULARIUM":
    - /url: /
    - heading "FABULARIUM" [level=1]
  - button "CREATE NEW" [disabled]:
    - paragraph: CREATE NEW
  - separator
  - link "CHARACTERS":
    - /url: /characters
    - paragraph: CHARACTERS
  - link "CAMPAIGNS":
    - /url: /campaigns
    - paragraph: CAMPAIGNS
  - link "RESOURCES":
    - /url: /resources
    - paragraph: RESOURCES
  - separator
  - link "SIGN IN":
    - /url: /sign-in
    - paragraph: SIGN IN
- heading "Fabularium" [level=1]
- heading "Tabletop Management App" [level=2]
- text: Username or Email
- textbox "Enter your email"
- text: Password
- textbox "Enter your password"
- button
- link "Forgot your password?":
  - /url: /reset-password
- button "SIGN IN"
- separator
- heading "Don't have an account?" [level=1]
- link "CREATE AN ACCOUNT":
  - /url: /sign-up
  - paragraph: CREATE AN ACCOUNT
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * E2E Tests for Authentication Flow
  5   |  */
  6   | 
  7   | test.describe('Authentication Flow', () => {
  8   |   test.beforeEach(async ({ page }) => {
  9   |     await page.goto('/');
  10  |   });
  11  | 
  12  |   test('user should navigate to sign in page', async ({ page }) => {
  13  |     // Navigate to sign in
  14  |     await page.click('a:has-text("Sign In")');
  15  | 
  16  |     // Check URL
  17  |     await expect(page).toHaveURL('/sign-in');
  18  | 
  19  |     // Check for sign in form
  20  |     await expect(page.locator('form')).toBeVisible();
  21  |   });
  22  | 
  23  |   test('should display sign in form with email and password fields', async ({ page }) => {
  24  |     await page.goto('/sign-in');
  25  | 
  26  |     const emailInput = page.locator('input[type="email"]');
  27  |     const passwordInput = page.locator('input[type="password"]');
  28  |     const submitButton = page.locator('button:has-text("Sign In")');
  29  | 
  30  |     await expect(emailInput).toBeVisible();
  31  |     await expect(passwordInput).toBeVisible();
  32  |     await expect(submitButton).toBeVisible();
  33  |   });
  34  | 
  35  |   test('should navigate to sign up from sign in page', async ({ page }) => {
  36  |     await page.goto('/sign-in');
  37  | 
  38  |     const signupLink = page.locator('a:has-text("Sign up")');
> 39  |     await expect(signupLink).toBeVisible();
      |                              ^ Error: expect(locator).toBeVisible() failed
  40  | 
  41  |     await signupLink.click();
  42  |     await expect(page).toHaveURL('/sign-up');
  43  |   });
  44  | 
  45  |   test('should have password reset link', async ({ page }) => {
  46  |     await page.goto('/sign-in');
  47  | 
  48  |     const resetLink = page.locator('a:has-text("Forgot password")');
  49  |     // Password reset link may not be visible initially
  50  |     // await expect(resetLink).toBeVisible();
  51  |   });
  52  | });
  53  | 
  54  | /**
  55  |  * E2E Tests for Campaign Creation
  56  |  */
  57  | test.describe('Campaign Creation Flow', () => {
  58  |   test.beforeEach(async ({ page }) => {
  59  |     // Simulate logged in user
  60  |     await page.goto('/campaigns');
  61  |   });
  62  | 
  63  |   test('should navigate to campaigns page', async ({ page }) => {
  64  |     await expect(page).toHaveURL('/campaigns');
  65  |   });
  66  | 
  67  |   test('should display campaigns list or empty state', async ({ page }) => {
  68  |     // Should show either campaigns or "Create New Campaign" button
  69  |     const createButton = page.locator('button:has-text("Create"), button:has-text("New")');
  70  |     
  71  |     // Wait for content to load
  72  |     await page.waitForLoadState('networkidle');
  73  |     
  74  |     expect(createButton || page.locator('text=campaigns')).toBeTruthy();
  75  |   });
  76  | 
  77  |   test('should open campaign creation modal', async ({ page }) => {
  78  |     await page.goto('/campaigns');
  79  | 
  80  |     // Look for create button
  81  |     const createButton = page.locator('button:has-text("Create"), button:has-text("New")').first();
  82  |     
  83  |     if (await createButton.isVisible()) {
  84  |       await createButton.click();
  85  |       
  86  |       // Check for form
  87  |       const form = page.locator('form, [role="dialog"]');
  88  |       await expect(form).toBeVisible();
  89  |     }
  90  |   });
  91  | });
  92  | 
  93  | /**
  94  |  * E2E Tests for Character Creation
  95  |  */
  96  | test.describe('Character Creation Flow', () => {
  97  |   test.beforeEach(async ({ page }) => {
  98  |     await page.goto('/characters');
  99  |   });
  100 | 
  101 |   test('should navigate to characters page', async ({ page }) => {
  102 |     await expect(page).toHaveURL('/characters');
  103 |   });
  104 | 
  105 |   test('should display characters list', async ({ page }) => {
  106 |     await page.waitForLoadState('networkidle');
  107 |     
  108 |     const header = page.locator('h1, h2');
  109 |     await expect(header).toBeTruthy();
  110 |   });
  111 | 
  112 |   test('should have button to create new character', async ({ page }) => {
  113 |     const createButton = page.locator('button:has-text("Create"), button:has-text("New"), a:has-text("New")').first();
  114 |     
  115 |     if (await createButton.isVisible()) {
  116 |       await expect(createButton).toBeVisible();
  117 |     }
  118 |   });
  119 | });
  120 | 
  121 | /**
  122 |  * E2E Tests for Navigation
  123 |  */
  124 | test.describe('Navigation', () => {
  125 |   test('should display sidebar on desktop', async ({ page }) => {
  126 |     await page.goto('/');
  127 | 
  128 |     // Check for navigation
  129 |     const nav = page.locator('nav, [role="navigation"]');
  130 |     
  131 |     // Navigation should exist (may be hidden on mobile)
  132 |     expect(nav || page.locator('a')).toBeTruthy();
  133 |   });
  134 | 
  135 |   test('should navigate between main pages', async ({ page }) => {
  136 |     await page.goto('/');
  137 | 
  138 |     // Try to navigate to different pages
  139 |     const links = await page.locator('a[href*="/"]').all();
```