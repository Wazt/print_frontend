import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrendingUp } from "lucide-react";
import StatCard from "@/Components/primitives/StatCard";

describe("StatCard primitive", () => {
  it("renders label and value", () => {
    render(<StatCard label="Total orders" value={42} />);
    expect(screen.getByText("Total orders")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders em-dash when value is null", () => {
    render(<StatCard label="Missing" value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows loading skeleton instead of value when loading", () => {
    const { container } = render(<StatCard label="Loading" value={5} loading />);
    // Value should NOT be visible
    expect(screen.queryByText("5")).not.toBeInTheDocument();
    // Skeleton has animate-pulse
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("renders icon with accent tone styles", () => {
    const { container } = render(
      <StatCard label="K" value={1} icon={TrendingUp} tone="accent" />
    );
    const iconWrap = container.querySelector('[style*="var(--accent-bg)"]');
    expect(iconWrap).toBeTruthy();
  });

  it("renders hint text", () => {
    render(<StatCard label="L" value={1} hint="vs last month" />);
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("renders positive delta with success color", () => {
    const { container } = render(
      <StatCard label="L" value={1} delta="+12%" deltaPositive />
    );
    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(container.querySelector(".text-\\[var\\(--success\\)\\]")).toBeTruthy();
  });

  it("renders negative delta with danger color", () => {
    const { container } = render(
      <StatCard label="L" value={1} delta="-4%" deltaPositive={false} />
    );
    expect(container.querySelector(".text-\\[var\\(--danger\\)\\]")).toBeTruthy();
  });

  it("defaults to default tone when no tone passed", () => {
    const { container } = render(
      <StatCard label="X" value={1} icon={TrendingUp} />
    );
    expect(container.querySelector('[style*="var(--surface-2)"]')).toBeTruthy();
  });
});
