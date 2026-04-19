import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormField, { Input, Textarea, Select } from "@/Components/primitives/FormField";

describe("FormField primitive", () => {
  it("renders label and child input", () => {
    render(
      <FormField label="Email" htmlFor="email">
        <Input id="email" />
      </FormField>
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("associates label with input via htmlFor", () => {
    render(
      <FormField label="Email" htmlFor="email-1">
        <Input id="email-1" />
      </FormField>
    );
    const label = screen.getByText("Email");
    expect(label.getAttribute("for")).toBe("email-1");
  });

  it("renders a required asterisk when required", () => {
    render(
      <FormField label="Name" required>
        <Input />
      </FormField>
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not render asterisk when not required", () => {
    render(
      <FormField label="Name">
        <Input />
      </FormField>
    );
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("renders hint when no error", () => {
    render(
      <FormField label="Password" hint="Min 8 chars">
        <Input type="password" />
      </FormField>
    );
    expect(screen.getByText("Min 8 chars")).toBeInTheDocument();
  });

  it("error takes precedence over hint", () => {
    render(
      <FormField label="Email" hint="We will not spam" error="Invalid email">
        <Input />
      </FormField>
    );
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    expect(screen.queryByText("We will not spam")).not.toBeInTheDocument();
  });
});

describe("Input sub-primitive", () => {
  it("is editable and emits onChange", () => {
    const onChange = vi.fn();
    render(<Input placeholder="type" onChange={onChange} />);
    const el = screen.getByPlaceholderText("type");
    fireEvent.change(el, { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards type attribute", () => {
    render(<Input type="email" data-testid="e" />);
    expect(screen.getByTestId("e")).toHaveAttribute("type", "email");
  });
});

describe("Textarea sub-primitive", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="notes" />);
    expect(screen.getByPlaceholderText("notes").tagName).toBe("TEXTAREA");
  });
});

describe("Select sub-primitive", () => {
  it("renders options and responds to change", () => {
    const onChange = vi.fn();
    render(
      <Select data-testid="sel" onChange={onChange} value="a">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    const sel = screen.getByTestId("sel");
    fireEvent.change(sel, { target: { value: "b" } });
    expect(onChange).toHaveBeenCalled();
  });
});
