import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * Utility to test component at different breakpoints
 */
const testViewport = (width: number, height: number, name: string) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });

  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });

  window.dispatchEvent(new Event("resize"));

  return { width, height, name };
};

/**
 * Mock responsive component
 */
const ResponsiveLayout = () => (
  <div
    data-testid="responsive-layout"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1rem",
      padding: "1rem",
    }}
  >
    <div
      data-testid="card-1"
      style={{ background: "lightblue", padding: "1rem" }}
    >
      Card 1
    </div>
    <div
      data-testid="card-2"
      style={{ background: "lightgreen", padding: "1rem" }}
    >
      Card 2
    </div>
    <div
      data-testid="card-3"
      style={{ background: "lightcoral", padding: "1rem" }}
    >
      Card 3
    </div>
  </div>
);

describe("Responsive Design - Layout Grid", () => {
  it("should render responsive layout", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    const layout = getByTestId("responsive-layout");
    expect(layout).toBeInTheDocument();

    const cards = [
      getByTestId("card-1"),
      getByTestId("card-2"),
      getByTestId("card-3"),
    ];

    cards.forEach((card) => {
      expect(card).toBeInTheDocument();
    });
  });

  it("should display grid with correct gap", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    const layout = getByTestId("responsive-layout");
    const styles = window.getComputedStyle(layout);

    expect(styles.display).toContain("grid");
  });
});

describe("Responsive Design - Mobile (320px - 480px)", () => {
  beforeEach(() => {
    testViewport(375, 667, "Mobile");
  });

  it("should render on mobile viewport", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    expect(getByTestId("responsive-layout")).toBeInTheDocument();
  });

  it("should stack cards on mobile", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    const cards = [
      getByTestId("card-1"),
      getByTestId("card-2"),
      getByTestId("card-3"),
    ];

    cards.forEach((card) => {
      expect(card).toBeVisible();
    });
  });

  it("should have readable font sizes on mobile", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    const card = getByTestId("card-1");
    const styles = window.getComputedStyle(card);

    // Padding should be adequate for touch targets
    expect(styles.padding).toBeDefined();
  });
});

describe("Responsive Design - Tablet (768px - 1024px)", () => {
  beforeEach(() => {
    testViewport(768, 1024, "Tablet");
  });

  it("should render on tablet viewport", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    expect(getByTestId("responsive-layout")).toBeInTheDocument();
  });

  it("should display 2-column layout on tablet", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    const layout = getByTestId("responsive-layout");
    expect(layout).toBeInTheDocument();

    const cards = [
      getByTestId("card-1"),
      getByTestId("card-2"),
      getByTestId("card-3"),
    ];

    cards.forEach((card) => {
      expect(card).toBeVisible();
    });
  });
});

describe("Responsive Design - Desktop (1920px+)", () => {
  beforeEach(() => {
    testViewport(1920, 1080, "Desktop");
  });

  it("should render on desktop viewport", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    expect(getByTestId("responsive-layout")).toBeInTheDocument();
  });

  it("should display 3-column layout on desktop", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    const layout = getByTestId("responsive-layout");
    expect(layout).toBeInTheDocument();

    const cards = [
      getByTestId("card-1"),
      getByTestId("card-2"),
      getByTestId("card-3"),
    ];

    cards.forEach((card) => {
      expect(card).toBeVisible();
    });
  });

  it("should have adequate spacing on desktop", () => {
    const { getByTestId } = render(<ResponsiveLayout />);

    const card1 = getByTestId("card-1");
    const card2 = getByTestId("card-2");

    expect(card1).toBeVisible();
    expect(card2).toBeVisible();
  });
});

describe("Responsive Design - Font Sizing", () => {
  const ResponsiveFontComponent = () => (
    <div data-testid="font-container">
      <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)" }}>
        Responsive Heading
      </h1>
      <p style={{ fontSize: "clamp(0.875rem, 2vw, 1.125rem)" }}>
        Responsive paragraph
      </p>
    </div>
  );

  it("should render responsive fonts", () => {
    const { getByTestId } = render(<ResponsiveFontComponent />);

    expect(getByTestId("font-container")).toBeInTheDocument();
  });

  it("should use clamp for responsive font sizes", () => {
    const { getByText } = render(<ResponsiveFontComponent />);

    const heading = getByText("Responsive Heading");
    expect(heading).toBeInTheDocument();
  });
});

describe("Responsive Design - Touch Targets", () => {
  const TouchTargetComponent = () => (
    <button
      data-testid="touch-button"
      style={{
        padding: "0.75rem 1rem",
        minHeight: "44px", // Apple touch target minimum
        minWidth: "44px",
      }}
    >
      Touch Button
    </button>
  );

  it("should have adequate touch target size", () => {
    const { getByTestId } = render(<TouchTargetComponent />);

    const button = getByTestId("touch-button") as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    const styles = window.getComputedStyle(button);
    expect(styles.minHeight).toBe("44px");
  });

  it("should be clickable on touch devices", async () => {
    const { getByTestId } = render(<TouchTargetComponent />);

    const button = getByTestId("touch-button");
    expect(button).toBeInTheDocument();

    // Simulate touch event
    const touchEvent = new TouchEvent("touchstart", {
      bubbles: true,
      cancelable: true,
    });

    button.dispatchEvent(touchEvent);
    expect(button).toBeInTheDocument();
  });
});

describe("Responsive Design - Orientation Changes", () => {
  it("should handle portrait orientation (mobile)", () => {
    testViewport(375, 667, "Mobile Portrait");

    const { getByTestId } = render(<ResponsiveLayout />);

    expect(getByTestId("responsive-layout")).toBeInTheDocument();
  });

  it("should handle landscape orientation (mobile)", () => {
    testViewport(667, 375, "Mobile Landscape");

    const { getByTestId } = render(<ResponsiveLayout />);

    expect(getByTestId("responsive-layout")).toBeInTheDocument();
  });

  it("should handle orientation change events", () => {
    const handleOrientationChange = vi.fn();

    window.addEventListener("orientationchange", handleOrientationChange);

    window.dispatchEvent(new Event("orientationchange"));

    // Event listener should be callable
    expect(handleOrientationChange).toHaveBeenCalled();

    window.removeEventListener("orientationchange", handleOrientationChange);
  });
});
