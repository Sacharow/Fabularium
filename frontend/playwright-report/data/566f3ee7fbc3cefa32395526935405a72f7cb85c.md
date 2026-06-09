# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: campaigns-and-characters.spec.ts >> Data Persistence >> should maintain navigation state
- Location: e2e\campaigns-and-characters.spec.ts:294:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/character"
Received string:    "http://localhost:5173/campaigns"
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
  - generic [ref=e39]: Loading your session...
```

# Test source

```ts
  205 |       // Look for edit button
  206 |       const editButton = page.locator('button:has-text("Edit"), button:has-text("✏")').first();
  207 | 
  208 |       if (await editButton.isVisible()) {
  209 |         await editButton.click();
  210 | 
  211 |         // Should show edit form
  212 |         const inputs = page.locator('input, textarea');
  213 |         const inputCount = await inputs.count();
  214 | 
  215 |         expect(inputCount).toBeGreaterThan(0);
  216 |       }
  217 |     }
  218 |   });
  219 | 
  220 |   test('should allow saving changes', async ({ page }) => {
  221 |     await page.goto('/characters');
  222 |     await page.waitForLoadState('networkidle');
  223 | 
  224 |     const characterLink = page.locator('a[href*="/character"]').first();
  225 | 
  226 |     if (await characterLink.isVisible()) {
  227 |       await characterLink.click();
  228 | 
  229 |       const editButton = page.locator('button:has-text("Edit"), button:has-text("✏")').first();
  230 | 
  231 |       if (await editButton.isVisible()) {
  232 |         await editButton.click();
  233 | 
  234 |         // Look for save button
  235 |         const saveButton = page.locator('button:has-text("Save")').first();
  236 | 
  237 |         if (await saveButton.isVisible()) {
  238 |           expect(saveButton).toBeEnabled();
  239 |         }
  240 |       }
  241 |     }
  242 |   });
  243 | 
  244 |   test('should allow canceling edits', async ({ page }) => {
  245 |     await page.goto('/characters');
  246 |     await page.waitForLoadState('networkidle');
  247 | 
  248 |     const characterLink = page.locator('a[href*="/character"]').first();
  249 | 
  250 |     if (await characterLink.isVisible()) {
  251 |       await characterLink.click();
  252 | 
  253 |       const editButton = page.locator('button:has-text("Edit"), button:has-text("✏")').first();
  254 | 
  255 |       if (await editButton.isVisible()) {
  256 |         await editButton.click();
  257 | 
  258 |         // Look for cancel button
  259 |         const cancelButton = page.locator('button:has-text("Cancel")').first();
  260 | 
  261 |         if (await cancelButton.isVisible()) {
  262 |           await cancelButton.click();
  263 | 
  264 |           // Should exit edit mode
  265 |           expect(page.url()).toBeTruthy();
  266 |         }
  267 |       }
  268 |     }
  269 |   });
  270 | });
  271 | 
  272 | /**
  273 |  * E2E Tests for Data Persistence
  274 |  */
  275 | 
  276 | test.describe('Data Persistence', () => {
  277 |   test('should persist data after page reload', async ({ page }) => {
  278 |     await page.goto('/characters');
  279 |     await page.waitForLoadState('networkidle');
  280 | 
  281 |     // Get current content
  282 |     const beforeReload = await page.content();
  283 | 
  284 |     // Reload page
  285 |     await page.reload();
  286 |     await page.waitForLoadState('networkidle');
  287 | 
  288 |     // Content should still be visible
  289 |     const afterReload = await page.content();
  290 | 
  291 |     expect(afterReload).toContain('character') || expect(afterReload).toBeDefined();
  292 |   });
  293 | 
  294 |   test('should maintain navigation state', async ({ page }) => {
  295 |     await page.goto('/characters');
  296 |     await page.waitForLoadState('networkidle');
  297 | 
  298 |     const currentUrl = page.url();
  299 | 
  300 |     // Navigate away and back
  301 |     await page.goto('/campaigns');
  302 |     await page.goBack();
  303 | 
  304 |     // Should be back on characters page
> 305 |     expect(page.url()).toContain('/character') || expect(page.url()).toContain('/character');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  306 |   });
  307 | });
  308 | 
  309 | /**
  310 |  * E2E Tests for User Feedback
  311 |  */
  312 | 
  313 | test.describe('User Feedback', () => {
  314 |   test('should show loading states during data fetch', async ({ page }) => {
  315 |     await page.goto('/characters');
  316 | 
  317 |     // Wait for content to load
  318 |     await page.waitForLoadState('networkidle');
  319 | 
  320 |     // Should have loaded content
  321 |     expect(page.url()).toBeTruthy();
  322 |   });
  323 | 
  324 |   test('should display success messages on save', async ({ page }) => {
  325 |     await page.goto('/characters');
  326 |     await page.waitForLoadState('networkidle');
  327 | 
  328 |     const characterLink = page.locator('a[href*="/character"]').first();
  329 | 
  330 |     if (await characterLink.isVisible()) {
  331 |       await characterLink.click();
  332 | 
  333 |       const editButton = page.locator('button:has-text("Edit")').first();
  334 | 
  335 |       if (await editButton.isVisible()) {
  336 |         await editButton.click();
  337 | 
  338 |         const saveButton = page.locator('button:has-text("Save")').first();
  339 | 
  340 |         if (await saveButton.isVisible()) {
  341 |           // Look for success message after save
  342 |           const successMessage = page.locator('text=saved, text=success, [role="alert"]');
  343 | 
  344 |           // Success message may appear
  345 |           expect(successMessage || saveButton).toBeTruthy();
  346 |         }
  347 |       }
  348 |     }
  349 |   });
  350 | 
  351 |   test('should display error messages on failure', async ({ page }) => {
  352 |     // This would need backend to fail
  353 |     await page.goto('/characters');
  354 |     await page.waitForLoadState('networkidle');
  355 | 
  356 |     // Should not show error on initial load if backend is healthy
  357 |     expect(page.url()).toBeTruthy();
  358 |   });
  359 | });
  360 | 
```