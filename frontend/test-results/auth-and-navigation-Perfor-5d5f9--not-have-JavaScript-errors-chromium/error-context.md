# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-and-navigation.spec.ts >> Performance >> should not have JavaScript errors
- Location: e2e\auth-and-navigation.spec.ts:216:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
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
  - main [ref=e40]:
    - generic [ref=e42]:
      - generic [ref=e43]:
        - img [ref=e44]
        - heading "FABULARIUM" [level=1] [ref=e46]
        - img [ref=e47]
      - paragraph [ref=e49]: A campaign manager for tabletop role-playing games, designed to keep your worldbuilding and session notes organized in one calm, readable space.
      - generic [ref=e50]:
        - link "Sign In" [ref=e51] [cursor=pointer]:
          - /url: /sign-in
        - link "Sign Up" [ref=e52] [cursor=pointer]:
          - /url: /sign-up
    - generic [ref=e53]:
      - article [ref=e54]:
        - img [ref=e56]
        - heading "About" [level=3] [ref=e58]
        - paragraph [ref=e59]: A lightweight, intuitive, and visually calm campaign manager for tabletop role-playing games.
      - article [ref=e60]:
        - img [ref=e62]
        - heading "How it works" [level=3] [ref=e64]
        - paragraph [ref=e65]: Create camapigns or join them as a player, organize your worldbuilding notes and session recaps in one place, and share them with your players to keep everyone on the same page.
      - article [ref=e66]:
        - img [ref=e68]
        - heading "Mission" [level=3] [ref=e70]
        - paragraph [ref=e71]: Make campaign prep and session management feel lighter, cleaner, and easier to revisit later.
    - generic [ref=e72]:
      - generic [ref=e74]:
        - heading "Features" [level=2] [ref=e75]
        - paragraph [ref=e76]: Everything you need to keep your campaign organized and your players informed, without the need to juggle multiple apps or tabs during prep and sessions.
      - generic [ref=e77]:
        - generic [ref=e78]: Character creation
        - generic [ref=e79]: Campaign management
        - generic [ref=e80]: Material browser
    - generic [ref=e81]:
      - heading "Built by" [level=2] [ref=e83]
      - generic [ref=e84]:
        - link "Szymon Lato Szymon Lato" [ref=e85] [cursor=pointer]:
          - /url: https://github.com/LatoSzymon
          - img "Szymon Lato" [ref=e86]
          - paragraph [ref=e88]: Szymon Lato
        - link "Szymon Ligenza Szymon Ligenza" [ref=e89] [cursor=pointer]:
          - /url: https://github.com/Logenz0202
          - img "Szymon Ligenza" [ref=e90]
          - paragraph [ref=e92]: Szymon Ligenza
        - link "Bartosz Stromski Bartosz Stromski" [ref=e93] [cursor=pointer]:
          - /url: https://github.com/Sacharow
          - img "Bartosz Stromski" [ref=e94]
          - paragraph [ref=e96]: Bartosz Stromski
      - paragraph [ref=e97]:
        - text: "Repository:"
        - link "github.com/Sacharow/Fabularium" [ref=e98] [cursor=pointer]:
          - /url: https://github.com/Sacharow/Fabularium
    - generic [ref=e99]:
      - generic [ref=e100]:
        - link "Contact" [ref=e101] [cursor=pointer]:
          - /url: /contact
        - link "Privacy Policy" [ref=e102] [cursor=pointer]:
          - /url: /privacy
        - link "Terms of Service" [ref=e103] [cursor=pointer]:
          - /url: /terms
      - paragraph [ref=e104]: "@2026 Fabularium. All Rights reserved."
```

# Test source

```ts
  131 |     // Navigation should exist (may be hidden on mobile)
  132 |     expect(nav || page.locator('a')).toBeTruthy();
  133 |   });
  134 | 
  135 |   test('should navigate between main pages', async ({ page }) => {
  136 |     await page.goto('/');
  137 | 
  138 |     // Try to navigate to different pages
  139 |     const links = await page.locator('a[href*="/"]').all();
  140 |     
  141 |     if (links.length > 0) {
  142 |       // Page should have navigation
  143 |       expect(links.length).toBeGreaterThan(0);
  144 |     }
  145 |   });
  146 | 
  147 |   test('should handle navigation errors gracefully', async ({ page }) => {
  148 |     await page.goto('/non-existent-page');
  149 | 
  150 |     // Page should either show 404 or redirect
  151 |     const url = page.url();
  152 |     expect(url).toBeDefined();
  153 |   });
  154 | });
  155 | 
  156 | /**
  157 |  * E2E Tests for Responsive Design
  158 |  */
  159 | test.describe('Responsive Design', () => {
  160 |   test('should be functional on mobile viewport', async ({ page }) => {
  161 |     await page.setViewportSize({ width: 375, height: 667 });
  162 |     await page.goto('/');
  163 | 
  164 |     // Page should load and be interactive
  165 |     await page.waitForLoadState('networkidle');
  166 |     expect(page.url()).toBeTruthy();
  167 |   });
  168 | 
  169 |   test('should be functional on tablet viewport', async ({ page }) => {
  170 |     await page.setViewportSize({ width: 768, height: 1024 });
  171 |     await page.goto('/');
  172 | 
  173 |     await page.waitForLoadState('networkidle');
  174 |     expect(page.url()).toBeTruthy();
  175 |   });
  176 | 
  177 |   test('should be functional on desktop viewport', async ({ page }) => {
  178 |     await page.setViewportSize({ width: 1920, height: 1080 });
  179 |     await page.goto('/');
  180 | 
  181 |     await page.waitForLoadState('networkidle');
  182 |     expect(page.url()).toBeTruthy();
  183 |   });
  184 | 
  185 |   test('should be accessible on different orientations', async ({ page }) => {
  186 |     // Portrait
  187 |     await page.setViewportSize({ width: 375, height: 667 });
  188 |     await page.goto('/');
  189 | 
  190 |     let content = page.locator('main, [role="main"], body > div');
  191 |     await expect(content).toBeTruthy();
  192 | 
  193 |     // Landscape
  194 |     await page.setViewportSize({ width: 667, height: 375 });
  195 |     content = page.locator('main, [role="main"], body > div');
  196 |     await expect(content).toBeTruthy();
  197 |   });
  198 | });
  199 | 
  200 | /**
  201 |  * E2E Tests for Performance
  202 |  */
  203 | test.describe('Performance', () => {
  204 |   test('homepage should load quickly', async ({ page }) => {
  205 |     const startTime = Date.now();
  206 | 
  207 |     await page.goto('/');
  208 |     await page.waitForLoadState('networkidle');
  209 | 
  210 |     const loadTime = Date.now() - startTime;
  211 | 
  212 |     // Page should load in under 5 seconds
  213 |     expect(loadTime).toBeLessThan(5000);
  214 |   });
  215 | 
  216 |   test('should not have JavaScript errors', async ({ page }) => {
  217 |     const errors: string[] = [];
  218 | 
  219 |     page.on('console', msg => {
  220 |       if (msg.type() === 'error') {
  221 |         errors.push(msg.text());
  222 |       }
  223 |     });
  224 | 
  225 |     await page.goto('/');
  226 |     await page.waitForLoadState('networkidle');
  227 | 
  228 |     // Should have no critical errors
  229 |     // Some warnings are acceptable
  230 |     const criticalErrors = errors.filter(e => !e.includes('Warning'));
> 231 |     expect(criticalErrors.length).toBe(0);
      |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  232 |   });
  233 | });
  234 | 
  235 | /**
  236 |  * E2E Tests for Accessibility
  237 |  */
  238 | test.describe('Accessibility', () => {
  239 |   test('should have proper heading hierarchy', async ({ page }) => {
  240 |     await page.goto('/');
  241 | 
  242 |     const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  243 |     
  244 |     // Should have at least one heading
  245 |     expect(headings.length).toBeGreaterThan(0);
  246 |   });
  247 | 
  248 |   test('should have alt text for images', async ({ page }) => {
  249 |     await page.goto('/');
  250 | 
  251 |     const images = await page.locator('img').all();
  252 | 
  253 |     for (const img of images) {
  254 |       const alt = await img.getAttribute('alt');
  255 |       // Alt text should exist or be intentionally empty for decorative images
  256 |       expect(alt !== null).toBe(true);
  257 |     }
  258 |   });
  259 | 
  260 |   test('should have proper link text', async ({ page }) => {
  261 |     await page.goto('/');
  262 | 
  263 |     const links = await page.locator('a').all();
  264 | 
  265 |     for (const link of links) {
  266 |       const text = await link.textContent();
  267 |       // Links should have descriptive text
  268 |       expect(text && text.trim().length > 0).toBe(true);
  269 |     }
  270 |   });
  271 | 
  272 |   test('should have proper form labels', async ({ page }) => {
  273 |     await page.goto('/sign-in');
  274 | 
  275 |     const labels = await page.locator('label').all();
  276 | 
  277 |     // Sign in form should have labels
  278 |     expect(labels.length).toBeGreaterThan(0);
  279 |   });
  280 | 
  281 |   test('should be keyboard navigable', async ({ page }) => {
  282 |     await page.goto('/');
  283 | 
  284 |     // Press Tab to navigate
  285 |     await page.keyboard.press('Tab');
  286 | 
  287 |     // Get currently focused element
  288 |     const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
  289 | 
  290 |     // Some element should be focused
  291 |     expect(focusedElement).toBeTruthy();
  292 |   });
  293 | });
  294 | 
  295 | /**
  296 |  * E2E Tests for Error Handling
  297 |  */
  298 | test.describe('Error Handling', () => {
  299 |   test('should handle network errors gracefully', async ({ page }) => {
  300 |     await page.goto('/');
  301 | 
  302 |     // Simulate offline
  303 |     await page.context().setOffline(true);
  304 | 
  305 |     // Try to perform action
  306 |     const button = page.locator('button').first();
  307 |     
  308 |     if (await button.isVisible()) {
  309 |       await button.click();
  310 |       // Page should not crash
  311 |       expect(page.url()).toBeTruthy();
  312 |     }
  313 | 
  314 |     // Go back online
  315 |     await page.context().setOffline(false);
  316 |   });
  317 | 
  318 |   test('should display user-friendly error messages', async ({ page }) => {
  319 |     await page.goto('/sign-in');
  320 | 
  321 |     // Try to submit empty form
  322 |     const submitButton = page.locator('button[type="submit"]');
  323 |     
  324 |     if (await submitButton.isVisible()) {
  325 |       // Check for validation
  326 |       const emailInput = page.locator('input[type="email"]');
  327 |       if (await emailInput.isVisible()) {
  328 |         // Input validation should work
  329 |         expect(emailInput).toBeVisible();
  330 |       }
  331 |     }
```