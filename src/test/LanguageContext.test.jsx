import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

function TestConsumer() {
  const { language, t, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="dashboard">{t("nav.dashboard")}</span>
      <span data-testid="orders">{t("nav.orders")}</span>
      <button onClick={() => setLanguage("en")}>Switch EN</button>
      <button onClick={() => setLanguage("fr")}>Switch FR</button>
    </div>
  );
}

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to French", () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId("lang").textContent).toBe("fr");
    expect(screen.getByTestId("dashboard").textContent).toBe("Tableau de bord");
    expect(screen.getByTestId("orders").textContent).toBe("Commandes");
  });

  it("switches to English", () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    act(() => {
      screen.getByText("Switch EN").click();
    });

    expect(screen.getByTestId("lang").textContent).toBe("en");
    expect(screen.getByTestId("dashboard").textContent).toBe("Dashboard");
    expect(screen.getByTestId("orders").textContent).toBe("Orders");
  });

  it("persists language to localStorage", () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    act(() => {
      screen.getByText("Switch EN").click();
    });

    expect(localStorage.getItem("lang")).toBe("en");
  });

  it("returns key for missing translations", () => {
    const { container } = render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    // t() should return the key string if translation is missing
    const TestMissing = () => {
      const { t } = useLanguage();
      return <span data-testid="missing">{t("nonexistent.key")}</span>;
    };

    const { getByTestId } = render(
      <LanguageProvider>
        <TestMissing />
      </LanguageProvider>
    );

    expect(getByTestId("missing").textContent).toBe("nonexistent.key");
  });
});
