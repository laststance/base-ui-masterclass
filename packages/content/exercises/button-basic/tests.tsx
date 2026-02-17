import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./initial";

describe("Button", () => {
  test("renders a button element by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDefined();
    expect(button.textContent).toBe("Click me");
  });

  test("forwards onClick handler", () => {
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(clicked).toBe(true);
  });

  test("supports disabled prop", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("disabled");
  });

  test("adds data-disabled attribute when disabled", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-disabled");
  });

  test("supports render prop for custom elements", () => {
    render(
      <Button render={<a href="/test" />}>
        Link Button
      </Button>
    );
    const link = document.querySelector("a");
    expect(link).toBeDefined();
    expect(link?.getAttribute("href")).toBe("/test");
  });
});
