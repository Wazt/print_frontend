import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AuthContext from "@/contexts/AuthContext";

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
  Toaster: () => null,
}));

import LoginPage from "@/Pages/LoginPage";

function MockAuth({ login, isLoading = false, children }) {
  return (
    <AuthContext.Provider
      value={{
        login,
        isLoading,
        isAuthenticated: null,
        logout: vi.fn(),
        verifyToken: vi.fn(),
        profile: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function renderLogin({ login = vi.fn(), isLoading = false } = {}) {
  return {
    login,
    ...render(
      <MemoryRouter>
        <LanguageProvider>
          <MockAuth login={login} isLoading={isLoading}>
            <LoginPage />
          </MockAuth>
        </LanguageProvider>
      </MemoryRouter>
    ),
  };
}

describe("LoginPage — integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the welcome heading", () => {
    renderLogin();
    // FR default: "Bienvenue"
    expect(screen.getByRole("heading", { name: /bienvenue|welcome back/i })).toBeInTheDocument();
  });

  it("renders email and password fields", () => {
    const { container } = renderLogin();
    expect(screen.getByPlaceholderText("you@company.com")).toBeInTheDocument();
    // Password input by id (getByLabelText would also match the eye button aria-label)
    expect(container.querySelector("#password")).toBeInTheDocument();
  });

  it("renders a sign in submit button", () => {
    renderLogin();
    expect(
      screen.getByRole("button", { name: /se connecter|sign in/i })
    ).toBeInTheDocument();
  });

  it("renders the forgot-password button (not an anchor)", () => {
    renderLogin();
    const forgot = screen.getByRole("button", {
      name: /mot de passe oublie|forgot password/i,
    });
    expect(forgot).toBeInTheDocument();
    expect(forgot.tagName).toBe("BUTTON");
  });

  it("toggles password visibility when eye button is clicked", () => {
    const { container } = renderLogin();
    const pwInput = container.querySelector("#password");
    expect(pwInput).toHaveAttribute("type", "password");

    const toggle = screen.getByRole("button", { name: /show password|hide password/i });
    fireEvent.click(toggle);
    expect(pwInput).toHaveAttribute("type", "text");

    fireEvent.click(toggle);
    expect(pwInput).toHaveAttribute("type", "password");
  });

  it("calls the login handler on form submit with event", () => {
    const login = vi.fn();
    const { container } = renderLogin({ login });

    const email = screen.getByPlaceholderText("you@company.com");
    const pw = container.querySelector("#password");
    fireEvent.change(email, { target: { value: "admin@test.com" } });
    fireEvent.change(pw, { target: { value: "admin1234admin" } });

    fireEvent.click(screen.getByRole("button", { name: /se connecter|sign in/i }));
    expect(login).toHaveBeenCalledTimes(1);
    // The handler receives a submit event object
    expect(login.mock.calls[0][0]).toBeDefined();
  });

  it("displays loading state when isLoading is true", () => {
    renderLogin({ isLoading: true });
    const btn = screen.getByRole("button", { name: /connexion|signing in/i });
    expect(btn).toBeDisabled();
  });

  it("has proper email input type", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("you@company.com")).toHaveAttribute("type", "email");
  });

  it("has accessible language switcher in header", () => {
    renderLogin();
    // LanguageSwitcher renders role=group with aria-label
    expect(
      screen.getByRole("group", { name: /selecteur de langue|language selector/i })
    ).toBeInTheDocument();
  });
});
