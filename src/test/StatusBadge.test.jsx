import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "@/Components/StatusBadge";

describe("StatusBadge", () => {
  it("renders pending status with orange styling", () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText("pending");
    expect(badge).toBeInTheDocument();
    expect(badge.closest("span")).toHaveClass("bg-[var(--ob-orl)]");
  });

  it("renders finished status with green styling", () => {
    render(<StatusBadge status="finished" />);
    expect(screen.getByText("finished")).toBeInTheDocument();
  });

  it("renders processing status with teal styling", () => {
    render(<StatusBadge status="processing" />);
    const badge = screen.getByText("processing");
    expect(badge.closest("span")).toHaveClass("bg-[var(--ob-tll)]");
  });

  it("renders cancelled status with red styling", () => {
    render(<StatusBadge status="cancelled" />);
    const badge = screen.getByText("cancelled");
    expect(badge.closest("span")).toHaveClass("bg-[var(--ob-redl)]");
  });

  it("renders unknown status with default styling", () => {
    render(<StatusBadge status="unknown_status" />);
    const badge = screen.getByText("unknown_status");
    expect(badge.closest("span")).toHaveClass("bg-[var(--ob-surf2)]");
  });
});
