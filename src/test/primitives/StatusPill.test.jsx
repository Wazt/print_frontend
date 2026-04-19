import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusPill from "@/Components/primitives/StatusPill";

describe("StatusPill primitive", () => {
  it("auto-maps PENDING to warning tone", () => {
    render(<StatusPill status="PENDING" />);
    const pill = screen.getByText(/pending/i);
    expect(pill).toBeInTheDocument();
    expect(pill.style.background).toMatch(/var\(--warning-bg\)/);
    expect(pill.style.color).toMatch(/var\(--warning\)/);
  });

  it("auto-maps PAID to success tone", () => {
    render(<StatusPill status="PAID" />);
    const pill = screen.getByText(/paid/i);
    expect(pill.style.color).toMatch(/var\(--success\)/);
  });

  it("auto-maps REJECTED to danger tone", () => {
    render(<StatusPill status="REJECTED" />);
    const pill = screen.getByText(/rejected/i);
    expect(pill.style.color).toMatch(/var\(--danger\)/);
  });

  it("falls back to neutral for unknown statuses", () => {
    render(<StatusPill status="WEIRD_STATUS" />);
    const pill = screen.getByText(/weird status/i);
    expect(pill.style.color).toMatch(/var\(--text-2\)/);
  });

  it("explicit tone overrides auto-mapping", () => {
    render(<StatusPill status="PENDING" tone="success" label="Done" />);
    const pill = screen.getByText("Done");
    expect(pill.style.color).toMatch(/var\(--success\)/);
  });

  it("uses provided label instead of status", () => {
    render(<StatusPill status="PAID" label="All clear" />);
    expect(screen.getByText("All clear")).toBeInTheDocument();
    expect(screen.queryByText(/paid/i)).not.toBeInTheDocument();
  });

  it("replaces underscores with spaces in auto-label", () => {
    render(<StatusPill status="PARTIAL_PAID" />);
    expect(screen.getByText(/partial paid/i)).toBeInTheDocument();
  });

  it("hides dot when dot=false", () => {
    const { container } = render(<StatusPill status="PAID" dot={false} />);
    // No inner span for the dot indicator
    const pill = container.querySelector("span");
    expect(pill.querySelectorAll("span").length).toBe(0);
  });

  it("applies sm size classes", () => {
    render(<StatusPill status="PAID" size="sm" />);
    expect(screen.getByText(/paid/i).className).toMatch(/text-\[10px\]/);
  });

  it("applies lg size classes", () => {
    render(<StatusPill status="PAID" size="lg" />);
    expect(screen.getByText(/paid/i).className).toMatch(/text-xs/);
  });
});
