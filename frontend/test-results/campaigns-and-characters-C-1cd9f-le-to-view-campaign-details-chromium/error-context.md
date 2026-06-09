# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: campaigns-and-characters.spec.ts >> Campaign Management >> should be able to view campaign details
- Location: e2e\campaigns-and-characters.spec.ts:57:3

# Error details

```
Error: locator.isVisible: Error: strict mode violation: locator('h1, h2, .campaign-title') resolved to 5 elements:
    1) <h1>FABULARIUM</h1> aka getByRole('link', { name: 'FABULARIUM' })
    2) <h1>FABULARIUM</h1> aka getByText('FABULARIUM').nth(1)
    3) <h1 class="text-4xl font-bold text-gold-neutral text-center tracking-wider">Fabularium</h1> aka getByRole('heading', { name: 'Fabularium', exact: true })
    4) <h2 class="text-xl text-center font-bold text-gray-light tracking-wide">Tabletop Management App</h2> aka getByRole('heading', { name: 'Tabletop Management App' })
    5) <h1 class="text-md text-gold-light">Don't have an account?</h1> aka getByRole('heading', { name: 'Don\'t have an account?' })

Call log:
    - checking visibility of locator('h1, h2, .campaign-title')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - complementary [ref=e3]:
    - generic [ref=e4]:
      - link "FABULARIUM" [ref=e6] [cursor=pointer]:
        - /url: /
        - heading "FABULARIUM" [level=1] [ref=e7]
      - button "CREATE NEW" [disabled] [ref=e9]:
        - paragraph [ref=e10]: CREATE NEW
      - separator [ref=e11]
      - generic [ref=e12]:
        - link "CHARACTERS" [ref=e13] [cursor=pointer]:
          - /url: /characters
          - img [ref=e14]
          - paragraph [ref=e17]: CHARACTERS
        - link "CAMPAIGNS" [ref=e18] [cursor=pointer]:
          - /url: /campaigns
          - img [ref=e19]
          - paragraph [ref=e23]: CAMPAIGNS
        - link "RESOURCES" [ref=e24] [cursor=pointer]:
          - /url: /resources
          - img [ref=e25]
          - paragraph [ref=e30]: RESOURCES
    - generic [ref=e31]:
      - separator [ref=e32]
      - link "SIGN IN" [ref=e33] [cursor=pointer]:
        - /url: /sign-in
        - img [ref=e34]
        - paragraph [ref=e38]: SIGN IN
  - generic [ref=e40]:
    - heading "Fabularium" [level=1] [ref=e41]
    - heading "Tabletop Management App" [level=2] [ref=e42]
    - generic [ref=e43]:
      - generic [ref=e44]:
        - generic [ref=e45]:
          - generic [ref=e46]: Username or Email
          - generic [ref=e47]:
            - textbox "Enter your email" [ref=e48]
            - img [ref=e49]
        - generic [ref=e52]:
          - generic [ref=e53]: Password
          - generic [ref=e54]:
            - textbox "Enter your password" [ref=e55]
            - button [ref=e56] [cursor=pointer]:
              - img [ref=e57]
          - link "Forgot your password?" [ref=e60] [cursor=pointer]:
            - /url: /reset-password
        - button "SIGN IN" [ref=e61] [cursor=pointer]
        - separator [ref=e62]
      - generic [ref=e63]:
        - heading "Don't have an account?" [level=1] [ref=e64]
        - link "CREATE AN ACCOUNT" [ref=e65] [cursor=pointer]:
          - /url: /sign-up
          - paragraph [ref=e66]: CREATE AN ACCOUNT
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * E2E Tests for Campaign Management
  5   |  */
  6   | 
  7   | test.describe('Campaign Management', () => {
  8   |   test.beforeEach(async ({ page }) => {
  9   |     // Assume user is logged in
  10  |     await page.goto('/campaigns');
  11  |   });
  12  | 
  13  |   test('should display campaign list or create prompt', async ({ page }) => {
  14  |     await page.waitForLoadState('networkidle');
  15  | 
  16  |     // Check for campaigns or create button
  17  |     const campaigns = page.locator('[data-testid="campaign-card"], .campaign-item');
  18  |     const createButton = page.locator('button:has-text("Create"), button:has-text("New")');
  19  | 
  20  |     const hasCampaigns = await campaigns.count() > 0;
  21  |     const hasCreateButton = await createButton.isVisible();
  22  | 
  23  |     expect(hasCampaigns || hasCreateButton).toBeTruthy();
  24  |   });
  25  | 
  26  |   test('should open campaign details on click', async ({ page }) => {
  27  |     await page.waitForLoadState('networkidle');
  28  | 
  29  |     const campaignLink = page.locator('[data-testid="campaign-card"], a[href*="/campaign"]').first();
  30  | 
  31  |     if (await campaignLink.isVisible()) {
  32  |       await campaignLink.click();
  33  |       await page.waitForLoadState('networkidle');
  34  | 
  35  |       // Should be on campaign detail page
  36  |       expect(page.url()).toContain('/campaign') || expect(page.url()).toContain('/preview');
  37  |     }
  38  |   });
  39  | 
  40  |   test('should display campaign sections', async ({ page }) => {
  41  |     await page.goto('/campaigns');
  42  |     await page.waitForLoadState('networkidle');
  43  | 
  44  |     const campaignLink = page.locator('[data-testid="campaign-card"], a[href*="/campaign"]').first();
  45  | 
  46  |     if (await campaignLink.isVisible()) {
  47  |       await campaignLink.click();
  48  | 
  49  |       // Should have campaign content
  50  |       const sections = page.locator('section, [data-testid="campaign-section"]');
  51  |       const sectionCount = await sections.count();
  52  | 
  53  |       expect(sectionCount).toBeGreaterThanOrEqual(0);
  54  |     }
  55  |   });
  56  | 
  57  |   test('should be able to view campaign details', async ({ page }) => {
  58  |     await page.goto('/campaigns');
  59  |     await page.waitForLoadState('networkidle');
  60  | 
  61  |     // Look for campaign name or details
  62  |     const campaignTitle = page.locator('h1, h2, .campaign-title');
  63  | 
> 64  |     if (await campaignTitle.isVisible()) {
      |                             ^ Error: locator.isVisible: Error: strict mode violation: locator('h1, h2, .campaign-title') resolved to 5 elements:
  65  |       const text = await campaignTitle.textContent();
  66  |       expect(text).toBeTruthy();
  67  |     }
  68  |   });
  69  | });
  70  | 
  71  | /**
  72  |  * E2E Tests for Character Management
  73  |  */
  74  | 
  75  | test.describe('Character Management', () => {
  76  |   test.beforeEach(async ({ page }) => {
  77  |     await page.goto('/characters');
  78  |   });
  79  | 
  80  |   test('should display character list', async ({ page }) => {
  81  |     await page.waitForLoadState('networkidle');
  82  | 
  83  |     // Check for characters or empty state
  84  |     const characters = page.locator('[data-testid="character-card"], .character-item');
  85  |     const emptyState = page.locator('text=No characters');
  86  | 
  87  |     const hasCharacters = await characters.count() > 0;
  88  |     const hasEmptyState = await emptyState.isVisible();
  89  | 
  90  |     expect(hasCharacters || hasEmptyState).toBeTruthy();
  91  |   });
  92  | 
  93  |   test('should open character details on click', async ({ page }) => {
  94  |     await page.waitForLoadState('networkidle');
  95  | 
  96  |     const characterLink = page.locator('[data-testid="character-card"], a[href*="/character"]').first();
  97  | 
  98  |     if (await characterLink.isVisible()) {
  99  |       await characterLink.click();
  100 |       await page.waitForLoadState('networkidle');
  101 | 
  102 |       // Should navigate to character page
  103 |       expect(page.url()).toContain('/character') || expect(page.url()).toContain('/preview');
  104 |     }
  105 |   });
  106 | 
  107 |   test('should display character details on preview page', async ({ page }) => {
  108 |     await page.goto('/characters');
  109 |     await page.waitForLoadState('networkidle');
  110 | 
  111 |     const characterLink = page.locator('[data-testid="character-card"], a[href*="/character"]').first();
  112 | 
  113 |     if (await characterLink.isVisible()) {
  114 |       await characterLink.click();
  115 | 
  116 |       // Should show character information
  117 |       const characterName = page.locator('h1, .character-name');
  118 |       const characterClass = page.locator('text=Class, .character-class');
  119 | 
  120 |       // At least name should be visible
  121 |       expect(characterName || characterClass).toBeTruthy();
  122 |     }
  123 |   });
  124 | 
  125 |   test('should display character sections', async ({ page }) => {
  126 |     await page.goto('/characters');
  127 |     await page.waitForLoadState('networkidle');
  128 | 
  129 |     const characterLink = page.locator('a[href*="/character"]').first();
  130 | 
  131 |     if (await characterLink.isVisible()) {
  132 |       await characterLink.click();
  133 | 
  134 |       // Look for character sections (General, Personal, Stats, etc.)
  135 |       const sections = page.locator(
  136 |         'button:has-text("General"), button:has-text("Personal"), button:has-text("Stats"), section'
  137 |       );
  138 | 
  139 |       const sectionCount = await sections.count();
  140 |       expect(sectionCount).toBeGreaterThanOrEqual(0);
  141 |     }
  142 |   });
  143 | });
  144 | 
  145 | /**
  146 |  * E2E Tests for Campaign Sections (Locations, Missions, NPCs)
  147 |  */
  148 | 
  149 | test.describe('Campaign Sub-Resources', () => {
  150 |   test('should display campaign sections with content', async ({ page }) => {
  151 |     await page.goto('/campaigns');
  152 |     await page.waitForLoadState('networkidle');
  153 | 
  154 |     const campaignLink = page.locator('a[href*="/campaign"]').first();
  155 | 
  156 |     if (await campaignLink.isVisible()) {
  157 |       await campaignLink.click();
  158 | 
  159 |       // Look for section tabs or headings
  160 |       const sectionButtons = page.locator(
  161 |         'button:has-text("Locations"), button:has-text("Missions"), button:has-text("NPCs"), [role="tab"]'
  162 |       );
  163 | 
  164 |       const count = await sectionButtons.count();
```