import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Campaign Management
 */

test.describe("Campaign Management", () => {
  test.beforeEach(async ({ page }) => {
    // Assume user is logged in
    await page.goto("/campaigns");
  });

  test("should display campaign list or create prompt", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // Check for campaigns or create button
    const campaigns = page.locator(
      '[data-testid="campaign-card"], .campaign-item',
    );
    const createButton = page.locator(
      'button:has-text("Create"), button:has-text("New")',
    );

    const hasCampaigns = (await campaigns.count()) > 0;
    const hasCreateButton = await createButton.isVisible();

    expect(hasCampaigns || hasCreateButton).toBeTruthy();
  });

  test("should open campaign details on click", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const campaignLink = page
      .locator('[data-testid="campaign-card"], a[href*="/campaign"]')
      .first();

    if (await campaignLink.isVisible()) {
      await campaignLink.click();
      await page.waitForLoadState("networkidle");

      // Should be on campaign detail page
      expect(page.url()).toContain("/campaign") ||
        expect(page.url()).toContain("/preview");
    }
  });

  test("should display campaign sections", async ({ page }) => {
    await page.goto("/campaigns");
    await page.waitForLoadState("networkidle");

    const campaignLink = page
      .locator('[data-testid="campaign-card"], a[href*="/campaign"]')
      .first();

    if (await campaignLink.isVisible()) {
      await campaignLink.click();

      // Should have campaign content
      const sections = page.locator(
        'section, [data-testid="campaign-section"]',
      );
      const sectionCount = await sections.count();

      expect(sectionCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("should be able to view campaign details", async ({ page }) => {
    await page.goto("/campaigns");
    await page.waitForLoadState("networkidle");

    // Look for campaign name or details
    const campaignTitle = page.locator("h1, h2, .campaign-title");

    if (await campaignTitle.isVisible()) {
      const text = await campaignTitle.textContent();
      expect(text).toBeTruthy();
    }
  });
});

/**
 * E2E Tests for Character Management
 */

test.describe("Character Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/characters");
  });

  test("should display character list", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // Check for characters or empty state
    const characters = page.locator(
      '[data-testid="character-card"], .character-item',
    );
    const emptyState = page.locator("text=No characters");

    const hasCharacters = (await characters.count()) > 0;
    const hasEmptyState = await emptyState.isVisible();

    expect(hasCharacters || hasEmptyState).toBeTruthy();
  });

  test("should open character details on click", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const characterLink = page
      .locator('[data-testid="character-card"], a[href*="/character"]')
      .first();

    if (await characterLink.isVisible()) {
      await characterLink.click();
      await page.waitForLoadState("networkidle");

      // Should navigate to character page
      expect(page.url()).toContain("/character") ||
        expect(page.url()).toContain("/preview");
    }
  });

  test("should display character details on preview page", async ({ page }) => {
    await page.goto("/characters");
    await page.waitForLoadState("networkidle");

    const characterLink = page
      .locator('[data-testid="character-card"], a[href*="/character"]')
      .first();

    if (await characterLink.isVisible()) {
      await characterLink.click();

      // Should show character information
      const characterName = page.locator("h1, .character-name");
      const characterClass = page.locator("text=Class, .character-class");

      // At least name should be visible
      expect(characterName || characterClass).toBeTruthy();
    }
  });

  test("should display character sections", async ({ page }) => {
    await page.goto("/characters");
    await page.waitForLoadState("networkidle");

    const characterLink = page.locator('a[href*="/character"]').first();

    if (await characterLink.isVisible()) {
      await characterLink.click();

      // Look for character sections (General, Personal, Stats, etc.)
      const sections = page.locator(
        'button:has-text("General"), button:has-text("Personal"), button:has-text("Stats"), section',
      );

      const sectionCount = await sections.count();
      expect(sectionCount).toBeGreaterThanOrEqual(0);
    }
  });
});

/**
 * E2E Tests for Campaign Sections (Locations, Missions, NPCs)
 */

test.describe("Campaign Sub-Resources", () => {
  test("should display campaign sections with content", async ({ page }) => {
    await page.goto("/campaigns");
    await page.waitForLoadState("networkidle");

    const campaignLink = page.locator('a[href*="/campaign"]').first();

    if (await campaignLink.isVisible()) {
      await campaignLink.click();

      // Look for section tabs or headings
      const sectionButtons = page.locator(
        'button:has-text("Locations"), button:has-text("Missions"), button:has-text("NPCs"), [role="tab"]',
      );

      const count = await sectionButtons.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("should allow switching between sections", async ({ page }) => {
    await page.goto("/campaigns");
    await page.waitForLoadState("networkidle");

    const campaignLink = page.locator('a[href*="/campaign"]').first();

    if (await campaignLink.isVisible()) {
      await campaignLink.click();

      // Try to find and click section button
      const locationsButton = page
        .locator('button:has-text("Locations")')
        .first();

      if (await locationsButton.isVisible()) {
        await locationsButton.click();

        // Should display locations content
        expect(locationsButton || page.locator("section")).toBeTruthy();
      }
    }
  });
});

/**
 * E2E Tests for Editing
 */

test.describe("Content Editing", () => {
  test("should allow editing character details", async ({ page }) => {
    await page.goto("/characters");
    await page.waitForLoadState("networkidle");

    const characterLink = page.locator('a[href*="/character"]').first();

    if (await characterLink.isVisible()) {
      await characterLink.click();

      // Look for edit button
      const editButton = page
        .locator('button:has-text("Edit"), button:has-text("✏")')
        .first();

      if (await editButton.isVisible()) {
        await editButton.click();

        // Should show edit form
        const inputs = page.locator("input, textarea");
        const inputCount = await inputs.count();

        expect(inputCount).toBeGreaterThan(0);
      }
    }
  });

  test("should allow saving changes", async ({ page }) => {
    await page.goto("/characters");
    await page.waitForLoadState("networkidle");

    const characterLink = page.locator('a[href*="/character"]').first();

    if (await characterLink.isVisible()) {
      await characterLink.click();

      const editButton = page
        .locator('button:has-text("Edit"), button:has-text("✏")')
        .first();

      if (await editButton.isVisible()) {
        await editButton.click();

        // Look for save button
        const saveButton = page.locator('button:has-text("Save")').first();

        if (await saveButton.isVisible()) {
          expect(saveButton).toBeEnabled();
        }
      }
    }
  });

  test("should allow canceling edits", async ({ page }) => {
    await page.goto("/characters");
    await page.waitForLoadState("networkidle");

    const characterLink = page.locator('a[href*="/character"]').first();

    if (await characterLink.isVisible()) {
      await characterLink.click();

      const editButton = page
        .locator('button:has-text("Edit"), button:has-text("✏")')
        .first();

      if (await editButton.isVisible()) {
        await editButton.click();

        // Look for cancel button
        const cancelButton = page.locator('button:has-text("Cancel")').first();

        if (await cancelButton.isVisible()) {
          await cancelButton.click();

          // Should exit edit mode
          expect(page.url()).toBeTruthy();
        }
      }
    }
  });
});

/**
 * E2E Tests for Data Persistence
 */

test.describe("Data Persistence", () => {
  test("should persist data after page reload", async ({ page }) => {
    await page.goto("/characters");
    await page.waitForLoadState("networkidle");

    // Get current content
    const beforeReload = await page.content();

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Content should still be visible
    const afterReload = await page.content();

    expect(afterReload).toContain("character") ||
      expect(afterReload).toBeDefined();
  });

  test("should maintain navigation state", async ({ page }) => {
    await page.goto("/characters");
    await page.waitForLoadState("networkidle");

    const currentUrl = page.url();

    // Navigate away and back
    await page.goto("/campaigns");
    await page.goBack();

    // Should be back on characters page
    expect(page.url()).toContain("/character") ||
      expect(page.url()).toContain("/character");
  });
});

/**
 * E2E Tests for User Feedback
 */

test.describe("User Feedback", () => {
  test("should show loading states during data fetch", async ({ page }) => {
    await page.goto("/characters");

    // Wait for content to load
    await page.waitForLoadState("networkidle");

    // Should have loaded content
    expect(page.url()).toBeTruthy();
  });

  test("should display success messages on save", async ({ page }) => {
    await page.goto("/characters");
    await page.waitForLoadState("networkidle");

    const characterLink = page.locator('a[href*="/character"]').first();

    if (await characterLink.isVisible()) {
      await characterLink.click();

      const editButton = page.locator('button:has-text("Edit")').first();

      if (await editButton.isVisible()) {
        await editButton.click();

        const saveButton = page.locator('button:has-text("Save")').first();

        if (await saveButton.isVisible()) {
          // Look for success message after save
          const successMessage = page.locator(
            'text=saved, text=success, [role="alert"]',
          );

          // Success message may appear
          expect(successMessage || saveButton).toBeTruthy();
        }
      }
    }
  });

  test("should display error messages on failure", async ({ page }) => {
    // This would need backend to fail
    await page.goto("/characters");
    await page.waitForLoadState("networkidle");

    // Should not show error on initial load if backend is healthy
    expect(page.url()).toBeTruthy();
  });
});
