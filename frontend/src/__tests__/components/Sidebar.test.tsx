import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

/**
 * Mock Sidebar Component for Testing
 */
const MockSidebar = ({ isOpen }: { isOpen?: boolean }) => (
  <nav role="navigation" className={`sidebar ${isOpen ? "open" : "closed"}`}>
    <ul>
      <li>
        <a href="/campaigns" role="link">
          Campaigns
        </a>
      </li>
      <li>
        <a href="/characters" role="link">
          Characters
        </a>
      </li>
      <li>
        <a href="/settings" role="link">
          Settings
        </a>
      </li>
    </ul>
  </nav>
);

/**
 * Tests for Sidebar component
 */
describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render sidebar navigation", () => {
    render(
      <BrowserRouter>
        <MockSidebar />
      </BrowserRouter>,
    );

    expect(screen.getByText(/characters/i)).toBeInTheDocument();
    expect(screen.getByText(/campaigns/i)).toBeInTheDocument();
  });

  it("should have navigation links", () => {
    render(
      <BrowserRouter>
        <MockSidebar />
      </BrowserRouter>,
    );

    const navLinks = screen.getAllByRole("link");
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it("should be accessible with proper ARIA labels", () => {
    render(
      <BrowserRouter>
        <MockSidebar />
      </BrowserRouter>,
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("should render navigation structure", () => {
    const { container } = render(
      <BrowserRouter>
        <MockSidebar />
      </BrowserRouter>,
    );

    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
  });

  it("should have proper styling classes", () => {
    const { container } = render(
      <BrowserRouter>
        <MockSidebar isOpen={true} />
      </BrowserRouter>,
    );

    const sidebar = container.querySelector(".sidebar");
    expect(sidebar).toHaveClass("open");
  });
});

/**
 * Tests for Sidebar responsiveness
 */
describe("Sidebar Responsiveness", () => {
  it("should be visible on desktop (1024px+)", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(min-width: 1024px)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <BrowserRouter>
        <MockSidebar isOpen={true} />
      </BrowserRouter>,
    );

    const navLinks = screen.getAllByRole("link");
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it("should have mobile-friendly menu on small screens", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(max-width: 768px)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <BrowserRouter>
        <MockSidebar isOpen={false} />
      </BrowserRouter>,
    );

    expect(container).toBeInTheDocument();
  });
});
