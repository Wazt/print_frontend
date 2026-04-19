import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/Components/primitives/Button";

describe("Button primitive", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("defaults to type=button", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("respects type=submit", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("applies the accent variant classes", () => {
    render(<Button variant="accent">Accent</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-\[var\(--accent\)\]/);
  });

  it("applies the danger variant classes", () => {
    render(<Button variant="danger">Danger</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-\[var\(--danger\)\]/);
  });

  it("applies the size=sm classes", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toMatch(/h-8/);
  });

  it("applies the size=icon classes (square)", () => {
    render(
      <Button size="icon" aria-label="Remove">
        <span>X</span>
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Remove" });
    expect(btn.className).toMatch(/h-9/);
    expect(btn.className).toMatch(/w-9/);
  });

  it("is disabled when disabled prop set", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("is disabled and shows spinner when loading", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    // Spinner is a <span> with animate-spin class
    expect(btn.querySelector(".animate-spin")).toBeTruthy();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onClick when enabled", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Fire</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("merges custom className", () => {
    render(<Button className="custom-x">X</Button>);
    expect(screen.getByRole("button").className).toMatch(/custom-x/);
  });
});
