import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Toolbar, { FilterChip } from "@/Components/primitives/Toolbar";

describe("Toolbar primitive", () => {
  it("renders search input when onSearchChange provided", () => {
    render(<Toolbar search="" onSearchChange={() => {}} searchPlaceholder="Find..." />);
    expect(screen.getByPlaceholderText("Find...")).toBeInTheDocument();
  });

  it("does NOT render search when onSearchChange is missing", () => {
    render(<Toolbar />);
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("fires onSearchChange on typing", () => {
    const onChange = vi.fn();
    render(<Toolbar search="" onSearchChange={onChange} searchPlaceholder="Find..." />);
    fireEvent.change(screen.getByPlaceholderText("Find..."), {
      target: { value: "hello" },
    });
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("renders filters slot", () => {
    render(
      <Toolbar
        filters={<span data-testid="f">filter slot</span>}
      />
    );
    expect(screen.getByTestId("f")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    render(
      <Toolbar actions={<button>Export</button>} />
    );
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("reflects controlled search value", () => {
    render(<Toolbar search="abc" onSearchChange={() => {}} />);
    expect(screen.getByRole("searchbox")).toHaveValue("abc");
  });
});

describe("FilterChip", () => {
  it("renders children", () => {
    render(<FilterChip>Unpaid</FilterChip>);
    expect(screen.getByRole("button", { name: /unpaid/i })).toBeInTheDocument();
  });

  it("renders count when provided", () => {
    render(<FilterChip count={7}>Late</FilterChip>);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(<FilterChip onClick={onClick}>Toggle</FilterChip>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies active state classes", () => {
    render(<FilterChip active>On</FilterChip>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-\[var\(--brand\)\]/);
  });

  it("applies inactive state classes", () => {
    render(<FilterChip>Off</FilterChip>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-\[var\(--surface\)\]/);
  });
});
