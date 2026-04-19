import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

vi.mock("@/Services/StockService", () => {
  const getRawMaterials = vi.fn();
  return {
    default: getRawMaterials,
    __esModule: true,
  };
});

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn(), warning: vi.fn() },
}));

import RawMaterialsPage from "@/Pages/Stock/stockPage";
import getRawMaterials from "@/Services/StockService";

const MOCK_MATERIALS = [
  {
    id: 1,
    name: "Coated paper 170g",
    stock_quantity: 250,
    cost_per_unit: 150,
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: 2,
    name: "Cyan ink cartridge",
    stock_quantity: 5, // low stock
    cost_per_unit: 1200, // high cost
    created_at: "2026-02-20T10:00:00Z",
  },
  {
    id: 3,
    name: "Plastic binding",
    stock_quantity: 20, // medium stock
    cost_per_unit: 80,
    created_at: "2026-03-05T10:00:00Z",
  },
];

function renderStock() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <RawMaterialsPage />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("Stock page — smoke", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getRawMaterials.mockResolvedValue(MOCK_MATERIALS);
  });

  it("renders the page header", async () => {
    renderStock();
    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("fetches raw materials on mount", async () => {
    renderStock();
    await waitFor(() => expect(getRawMaterials).toHaveBeenCalled());
  });

  it("renders rows for each material", async () => {
    renderStock();
    expect(await screen.findByText("Coated paper 170g")).toBeInTheDocument();
    expect(screen.getByText("Cyan ink cartridge")).toBeInTheDocument();
    expect(screen.getByText("Plastic binding")).toBeInTheDocument();
  });

  it("shows Total materials stat = 3", async () => {
    renderStock();
    await screen.findByText("Coated paper 170g");
    // There are 3 materials in total
    const threes = screen.getAllByText("3");
    expect(threes.length).toBeGreaterThanOrEqual(1);
  });

  it("shows low stock count = 1 and high cost count = 2", async () => {
    renderStock();
    await screen.findByText("Coated paper 170g");
    // Materials 1 (cost 150) and 2 (cost 1200) are both >= 100 → highCostCount = 2
    // Only material 2 (stock 5) is <= 10 → lowStockCount = 1
    // "1" appears at least once (low stock card)
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    // "2" appears at least once (high cost card value)
    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
  });

  it("shows stock level StatusPills", async () => {
    renderStock();
    await screen.findByText("Coated paper 170g");
    // StatusPill label is "OK" / "Med" / "Low" (visible text in table)
    expect(screen.getByText("OK")).toBeInTheDocument(); // qty 250
    expect(screen.getByText("Low")).toBeInTheDocument(); // qty 5
    expect(screen.getByText("Med")).toBeInTheDocument(); // qty 20
  });

  it("renders empty state when no materials", async () => {
    getRawMaterials.mockResolvedValue([]);
    renderStock();
    await waitFor(() =>
      expect(screen.getByText(/aucun materiel|no materials/i)).toBeInTheDocument()
    );
  });

  it("handles API failure gracefully", async () => {
    getRawMaterials.mockRejectedValue(new Error("network"));
    renderStock();
    // Page shouldn't crash — header still there
    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
