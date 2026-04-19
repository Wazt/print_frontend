import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function TestConsumer() {
  const { theme, isDark, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="isDark">{isDark.toString()}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to dark theme", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(screen.getByTestId("isDark").textContent).toBe("true");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles to light theme", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText("Toggle").click();
    });

    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(screen.getByTestId("isDark").textContent).toBe("false");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists to localStorage", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText("Toggle").click();
    });

    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("reads initial value from localStorage", () => {
    localStorage.setItem("theme", "light");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
  });
});
