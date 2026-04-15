import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import PageHeader from "@/Components/primitives/PageHeader";

describe("PageHeader primitive", () => {
  it("renders title as h1", () => {
    render(<PageHeader title="Orders" />);
    expect(screen.getByRole("heading", { level: 1, name: "Orders" })).toBeInTheDocument();
  });

  it("renders subtitle paragraph", () => {
    render(<PageHeader title="Orders" subtitle="Manage everything" />);
    expect(screen.getByText("Manage everything")).toBeInTheDocument();
  });

  it("omits subtitle when not provided", () => {
    const { container } = render(<PageHeader title="Orders" />);
    expect(container.querySelector("p")).toBeFalsy();
  });

  it("renders icon wrapper when icon is provided", () => {
    const { container } = render(<PageHeader title="Orders" icon={Inbox} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders breadcrumb string above title", () => {
    render(<PageHeader title="Order detail" breadcrumb="Orders / ORD-001" />);
    expect(screen.getByText("Orders / ORD-001")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    render(
      <PageHeader
        title="Orders"
        actions={<button>New</button>}
      />
    );
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });
});
