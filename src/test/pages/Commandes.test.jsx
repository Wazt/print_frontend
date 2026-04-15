import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("@/Services/OrdersService", () => ({
  getOrders: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn(), warning: vi.fn() },
}));

import Commandes from "@/Pages/Commandes";
import { getOrders } from "@/Services/OrdersService";

const MOCK_ORDERS = [
  {
    id: 1,
    order_number: "ORD-0001",
    company: { name: "Acme Print Co" },
    creator: { username: "alice" },
    created_at: "2026-03-15T10:00:00Z",
    order_price: 12500,
    status: "PENDING",
  },
  {
    id: 2,
    order_number: "ORD-0002",
    company: { name: "Beta Graphics" },
    creator: { username: "bob" },
    created_at: "2026-03-16T10:00:00Z",
    order_price: 8200,
    status: "ACCEPTED",
  },
];

const MOCK_PAGINATION = { page: 1, total_pages: 1, total_items: 2 };

function renderCommandes() {
  return render(
    <MemoryRouter initialEntries={["/Commandes"]}>
      <LanguageProvider>
        <Commandes />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Commandes list — smoke", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getOrders.mockResolvedValue([MOCK_ORDERS, MOCK_PAGINATION]);
  });

  it("renders the page header", async () => {
    renderCommandes();
    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("fetches orders on mount", async () => {
    renderCommandes();
    await waitFor(() => expect(getOrders).toHaveBeenCalled());
  });

  it("renders rows for each fetched order", async () => {
    renderCommandes();
    expect(await screen.findByText("ORD-0001")).toBeInTheDocument();
    expect(screen.getByText("ORD-0002")).toBeInTheDocument();
    expect(screen.getByText("Acme Print Co")).toBeInTheDocument();
    expect(screen.getByText("Beta Graphics")).toBeInTheDocument();
  });

  it("renders status filter chips", async () => {
    renderCommandes();
    await screen.findByText("ORD-0001");
    // French is default: "Toutes"
    expect(screen.getByRole("button", { name: "Toutes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "En attente" })).toBeInTheDocument();
  });

  it("filters rows client-side when searching", async () => {
    renderCommandes();
    await screen.findByText("ORD-0001");
    const search = screen.getByPlaceholderText(/rechercher|search/i);
    fireEvent.change(search, { target: { value: "acme" } });
    // Beta should disappear
    expect(screen.queryByText("Beta Graphics")).not.toBeInTheDocument();
    // Acme still visible
    expect(screen.getByText("Acme Print Co")).toBeInTheDocument();
  });

  it("renders empty state when no orders", async () => {
    getOrders.mockResolvedValue([[], { page: 1, total_pages: 0, total_items: 0 }]);
    renderCommandes();
    await waitFor(() =>
      expect(screen.getByText(/aucune commande|no orders found/i)).toBeInTheDocument()
    );
  });

  it("shows stat cards with counts", async () => {
    renderCommandes();
    await screen.findByText("ORD-0001");
    // Total items = 2 (from pagination.total_items)
    const cards = screen.getAllByText("2");
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });
});
