import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Package } from "lucide-react";
import DataCard from "@/Components/primitives/DataCard";

describe("DataCard primitive", () => {
  it("renders children", () => {
    render(<DataCard>Body content</DataCard>);
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("does not render header when no title/description/action provided", () => {
    const { container } = render(<DataCard>body</DataCard>);
    // With no header, the first child div should only contain the body wrapper
    const topLevel = container.firstChild;
    expect(topLevel.children.length).toBe(1);
  });

  it("renders header with title only", () => {
    render(<DataCard title="Card title">body</DataCard>);
    expect(screen.getByRole("heading", { level: 3, name: "Card title" })).toBeInTheDocument();
  });

  it("renders header with title + description", () => {
    render(
      <DataCard title="Main" description="Subtitle text">
        body
      </DataCard>
    );
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Subtitle text")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const { container } = render(
      <DataCard title="With icon" icon={Package}>
        body
      </DataCard>
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders action slot", () => {
    render(
      <DataCard title="With action" action={<button>Edit</button>}>
        body
      </DataCard>
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("applies padding to body by default", () => {
    const { container } = render(<DataCard>body</DataCard>);
    const body = container.querySelector(".p-5");
    expect(body).toBeTruthy();
  });

  it("omits padding when padded=false", () => {
    const { container } = render(<DataCard padded={false}>body</DataCard>);
    const body = container.querySelector(".p-5");
    expect(body).toBeFalsy();
  });

  it("merges custom className on wrapper", () => {
    const { container } = render(<DataCard className="my-special-card">body</DataCard>);
    expect(container.firstChild.className).toMatch(/my-special-card/);
  });
});
