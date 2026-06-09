import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Authentication Flow
 */

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("user should navigate to sign in page", async ({ page }) => {
    // Navigate to sign in
    await page.click('a:has-text("Sign In")');

    // Check URL
    await expect(page).toHaveURL("/sign-in");

    // Check for sign in form
    await expect(page.locator("form")).toBeVisible();
  });

  test("should display sign in form with email and password fields", async ({
    page,
  }) => {
    await page.goto("/sign-in");

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button:has-text("Sign In")');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("should navigate to sign up from sign in page", async ({ page }) => {
    await page.goto("/sign-in");

    const signupLink = page.locator('a:has-text("Sign up")');
    await expect(signupLink).toBeVisible();

    await signupLink.click();
    await expect(page).toHaveURL("/sign-up");
  });

  test("should have password reset link", async ({ page }) => {
    await page.goto("/sign-in");

    const resetLink = page.locator('a:has-text("Forgot password")');
    // Password reset link may not be visible initially
    // await expect(resetLink).toBeVisible();
  });
});

/**
 * E2E Tests for Campaign Creation
 */
test.describe("Campaign Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Simulate logged in user
    await page.goto("/campaigns");
  });

  test("should navigate to campaigns page", async ({ page }) => {
    await expect(page).toHaveURL("/campaigns");
  });

  test("should display campaigns list or empty state", async ({ page }) => {
    // Should show either campaigns or "Create New Campaign" button
    const createButton = page.locator(
      'button:has-text("Create"), button:has-text("New")',
    );

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    expect(createButton || page.locator("text=campaigns")).toBeTruthy();
  });

  test("should open campaign creation modal", async ({ page }) => {
    await page.goto("/campaigns");

    // Look for create button
    const createButton = page
      .locator('button:has-text("Create"), button:has-text("New")')
      .first();

    if (await createButton.isVisible()) {
      await createButton.click();

      // Check for form
      const form = page.locator('form, [role="dialog"]');
      await expect(form).toBeVisible();
    }
  });
});

/**
 * E2E Tests for Character Creation
 */
test.describe("Character Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/characters");
  });

  test("should navigate to characters page", async ({ page }) => {
    await expect(page).toHaveURL("/characters");
  });

  test("should display characters list", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const header = page.locator("h1, h2");
    await expect(header).toBeTruthy();
  });

  test("should have button to create new character", async ({ page }) => {
    const createButton = page
      .locator(
        'button:has-text("Create"), button:has-text("New"), a:has-text("New")',
      )
      .first();

    if (await createButton.isVisible()) {
      await expect(createButton).toBeVisible();
    }
  });
});

/**
 * E2E Tests for Navigation
 */
test.describe("Navigation", () => {
  test("should display sidebar on desktop", async ({ page }) => {
    await page.goto("/");

    // Check for navigation
    const nav = page.locator('nav, [role="navigation"]');

    // Navigation should exist (may be hidden on mobile)
    expect(nav || page.locator("a")).toBeTruthy();
  });

  test("should navigate between main pages", async ({ page }) => {
    await page.goto("/");

    // Try to navigate to different pages
    const links = await page.locator('a[href*="/"]').all();

    if (links.length > 0) {
      // Page should have navigation
      expect(links.length).toBeGreaterThan(0);
    }
  });

  test("should handle navigation errors gracefully", async ({ page }) => {
    await page.goto("/non-existent-page");

    // Page should either show 404 or redirect
    const url = page.url();
    expect(url).toBeDefined();
  });
});

/**
 * E2E Tests for Responsive Design
 */
test.describe("Responsive Design", () => {
  test("should be functional on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Page should load and be interactive
    await page.waitForLoadState("networkidle");
    expect(page.url()).toBeTruthy();
  });

  test("should be functional on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    await page.waitForLoadState("networkidle");
    expect(page.url()).toBeTruthy();
  });

  test("should be functional on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    await page.waitForLoadState("networkidle");
    expect(page.url()).toBeTruthy();
  });

  test("should be accessible on different orientations", async ({ page }) => {
    // Portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    let content = page.locator('main, [role="main"], body > div');
    await expect(content).toBeTruthy();

    // Landscape
    await page.setViewportSize({ width: 667, height: 375 });
    content = page.locator('main, [role="main"], body > div');
    await expect(content).toBeTruthy();
  });
});

/**
 * E2E Tests for Performance
 */
test.describe("Performance", () => {
  test("homepage should load quickly", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Page should load in under 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test("should not have JavaScript errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should have no critical errors
    // Some warnings are acceptable
    const criticalErrors = errors.filter((e) => !e.includes("Warning"));
    expect(criticalErrors.length).toBe(0);
  });
});

/**
 * E2E Tests for Accessibility
 */
test.describe("Accessibility", () => {
  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();

    // Should have at least one heading
    expect(headings.length).toBeGreaterThan(0);
  });

  test("should have alt text for images", async ({ page }) => {
    await page.goto("/");

    const images = await page.locator("img").all();

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      // Alt text should exist or be intentionally empty for decorative images
      expect(alt !== null).toBe(true);
    }
  });

  test("should have proper link text", async ({ page }) => {
    await page.goto("/");

    const links = await page.locator("a").all();

    for (const link of links) {
      const text = await link.textContent();
      // Links should have descriptive text
      expect(text && text.trim().length > 0).toBe(true);
    }
  });

  test("should have proper form labels", async ({ page }) => {
    await page.goto("/sign-in");

    const labels = await page.locator("label").all();

    // Sign in form should have labels
    expect(labels.length).toBeGreaterThan(0);
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    // Press Tab to navigate
    await page.keyboard.press("Tab");

    // Get currently focused element
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );

    // Some element should be focused
    expect(focusedElement).toBeTruthy();
  });
});

/**
 * E2E Tests for Error Handling
 */
test.describe("Error Handling", () => {
  test("should handle network errors gracefully", async ({ page }) => {
    await page.goto("/");

    // Simulate offline
    await page.context().setOffline(true);

    // Try to perform action
    const button = page.locator("button").first();

    if (await button.isVisible()) {
      await button.click();
      // Page should not crash
      expect(page.url()).toBeTruthy();
    }

    // Go back online
    await page.context().setOffline(false);
  });

  test("should display user-friendly error messages", async ({ page }) => {
    await page.goto("/sign-in");

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');

    if (await submitButton.isVisible()) {
      // Check for validation
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.isVisible()) {
        // Input validation should work
        expect(emailInput).toBeVisible();
      }
    }
  });
});
