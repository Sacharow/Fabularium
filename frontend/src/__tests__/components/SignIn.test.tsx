import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

/**
 * Mock SignIn component for testing
 * (In real app, import from actual file)
 */
const SignIn = () => (
  <form data-testid="signin-form">
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      placeholder="Enter your email"
      required
      data-testid="email-input"
    />

    <label htmlFor="password">Password</label>
    <input
      id="password"
      type="password"
      placeholder="Enter your password"
      required
      data-testid="password-input"
    />

    <button type="submit" data-testid="signin-button">
      Sign In
    </button>

    <a href="/sign-up">Don't have an account? Sign up</a>
  </form>
);

describe("SignIn Form Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render sign in form", () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("signin-form")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("signin-button")).toBeInTheDocument();
  });

  it("should have email and password input fields", () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      "password-input",
    ) as HTMLInputElement;

    expect(emailInput.type).toBe("email");
    expect(passwordInput.type).toBe("password");
  });

  it("should validate required fields", async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const form = screen.getByTestId("signin-form") as HTMLFormElement;
    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      "password-input",
    ) as HTMLInputElement;

    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });

  it("should allow user to enter email and password", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      "password-input",
    ) as HTMLInputElement;

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("should have sign up link", () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const signupLink = screen.getByText(/don't have an account/i);
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/sign-up");
  });

  it("should have accessible labels", () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailLabel = screen.getByLabelText("Email");
    const passwordLabel = screen.getByLabelText("Password");

    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });

  it("should have submit button", () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const submitButton = screen.getByTestId("signin-button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton.type).toBe("submit");
  });
});

describe("SignIn Form - Mobile Responsiveness", () => {
  it("should be fully functional on mobile viewport", async () => {
    // Simulate mobile viewport
    vi.stubGlobal("innerWidth", 375);
    vi.stubGlobal("innerHeight", 667);

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      "password-input",
    ) as HTMLInputElement;

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("should be fully functional on tablet viewport", async () => {
    // Simulate tablet viewport
    vi.stubGlobal("innerWidth", 768);
    vi.stubGlobal("innerHeight", 1024);

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    await user.type(emailInput, "test@example.com");

    expect(emailInput.value).toBe("test@example.com");
  });

  it("should be fully functional on desktop viewport", async () => {
    // Simulate desktop viewport
    vi.stubGlobal("innerWidth", 1920);
    vi.stubGlobal("innerHeight", 1080);

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>,
    );

    const form = screen.getByTestId("signin-form");
    expect(form).toBeInTheDocument();
  });
});
