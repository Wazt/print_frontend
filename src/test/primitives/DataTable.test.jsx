import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DataTable from "@/Components/primitives/DataTable";

const COLUMNS = [
  { key: "name", header: "Name" },
  { key: "qty", header: "Qty", align: "right" },
  { key: "status", header: "Status", render: (row) => <span>Status: {row.status}</span> },
];

const ROWS = [
  { id: 1, name: "Alpha", qty: 10, status: "ok" },
  { id: 2, name: "Beta", qty: 20, status: "late" },
];

describe("DataTable primitive", () => {
  it("renders header columns", () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} empty={<div>empty</div>} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Qty")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders all rows with default value access", () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} empty={<div>empty</div>} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("uses column.render when provided", () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} empty={<div>empty</div>} />);
    expect(screen.getByText("Status: ok")).toBeInTheDocument();
    expect(screen.getByText("Status: late")).toBeInTheDocument();
  });

  it("renders em-dash for missing values without render fn", () => {
    const rows = [{ id: 1, name: "A" }]; // no qty, no status
    render(
      <DataTable
        columns={[
          { key: "name", header: "Name" },
          { key: "qty", header: "Qty" },
        ]}
        rows={rows}
        empty={<div>empty</div>}
      />
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows loading skeleton when loading", () => {
    const { container } = render(
      <DataTable columns={COLUMNS} rows={[]} loading empty={<div>empty</div>} />
    );
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });

  it("shows empty slot when rows is empty", () => {
    render(<DataTable columns={COLUMNS} rows={[]} empty={<div>No data</div>} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("fires onRowClick with the row object", () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        onRowClick={onRowClick}
        empty={<div>empty</div>}
      />
    );
    fireEvent.click(screen.getByText("Alpha").closest("tr"));
    expect(onRowClick).toHaveBeenCalledWith(ROWS[0]);
  });

  it("does not add cursor-pointer when onRowClick not provided", () => {
    const { container } = render(
      <DataTable columns={COLUMNS} rows={ROWS} empty={<div>empty</div>} />
    );
    const rows = container.querySelectorAll("tbody tr");
    rows.forEach((r) => {
      expect(r.className).not.toMatch(/cursor-pointer/);
    });
  });
});
