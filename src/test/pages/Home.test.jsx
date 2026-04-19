import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Mock the analytics service BEFORE importing the page
vi.mock("@/Services/AnalyticsService", () => ({
  get_order_analytics: vi.fn(),
}));

// Mock sonner to avoid toast rendering issues in jsdom
vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn(), warning: vi.fn() },
}));

import Home from "@/Pages/Home";
import { get_order_analytics } from "@/Services/AnalyticsService";

const MOCK_STATS = {
  order_stats: {
    total_orders: 42,
    recent_created: 5,
    total_finished: 20,
    total_accepted: 30,
  },
  facture_stats: {
    PAID: 15,
    PARTIAL_PAID: 3,
    PENDING_PAYMENT: 2,
  },
};

function renderHome() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Home dashboard — smoke", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    get_order_analytics.mockResolvedValue(MOCK_STATS);
  });

  it("renders the page header title", async () => {
    renderHome();
    // Title is translated; default lang is French = "Tableau de bord"
    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("calls the analytics service on mount", async () => {
    renderHome();
    await waitFor(() => expect(get_order_analytics).toHaveBeenCalledTimes(1));
  });

  it("shows loading skeletons initially, then renders stat values", async () => {
    // Make analytics promise slow to resolve so we can observe loading state
    let resolveFn;
    get_order_analytics.mockImplementation(
      () => new Promise((resolve) => (resolveFn = resolve))
    );
    const { container } = renderHome();

    // Loading skeletons visible before resolve
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);

    // Resolve and wait for re-render
    resolveFn(MOCK_STATS);
    await waitFor(() => {
      // Total orders = 42 appears at least once (in KPI stat card + chart)
      expect(screen.getAllByText("42").length).toBeGreaterThan(0);
    });
  });

  it("renders 4 StatCards in the KPI row with correct values", async () => {
    renderHome();
    await waitFor(() =>
      expect(screen.getAllByText("42").length).toBeGreaterThan(0)
    );
    // Each stat value should appear somewhere on the page
    expect(screen.getAllByText("42").length).toBeGreaterThan(0); // total orders
    expect(screen.getAllByText("5").length).toBeGreaterThan(0); // recent
    expect(screen.getAllByText("20").length).toBeGreaterThan(0); // finished
    expect(screen.getAllByText("30").length).toBeGreaterThan(0); // accepted
  });

  it("renders both chart DataCards", async () => {
    renderHome();
    await waitFor(() =>
      expect(screen.getAllByText("42").length).toBeGreaterThan(0)
    );
    // Order overview card — FR default shows "Apercu commandes"
    expect(screen.getByText(/Apercu commandes|Order Overview/i)).toBeInTheDocument();
    // Invoice status card
    expect(screen.getByText(/Statut factures|Invoice Status/i)).toBeInTheDocument();
  });

  it("handles failed analytics gracefully (no crash)", async () => {
    get_order_analytics.mockRejectedValue(new Error("network"));
    renderHome();
    // Page should still render header without crashing
    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
