import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import EmptyState from "@/Components/primitives/EmptyState";

describe("EmptyState primitive", () => {
  it("renders title", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByRole("heading", { level: 3, name: "Nothing here" })).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="Empty" description="No items yet." />);
    expect(screen.getByText("No items yet.")).toBeInTheDocument();
  });

  it("does not render description paragraph when omitted", () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector("p")).toBeFalsy();
  });

  it("renders icon wrapper when icon provided", () => {
    const { container } = render(<EmptyState icon={Inbox} title="Empty" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("does not render icon wrapper when no icon", () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector("svg")).toBeFalsy();
  });

  it("renders action slot", () => {
    render(
      <EmptyState
        title="Empty"
        action={<button>Create one</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Create one" })).toBeInTheDocument();
  });
});
