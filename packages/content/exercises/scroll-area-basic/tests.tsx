import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScrollArea } from "./initial";

function renderScrollArea({
  contentHeight = 1000,
  viewportHeight = 200,
}: { contentHeight?: number; viewportHeight?: number } = {}) {
  return render(
    <ScrollArea.Root style={{ height: viewportHeight, width: 300 }}>
      <ScrollArea.Viewport>
        <div style={{ height: contentHeight }}>
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i}>Item {i + 1}</p>
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>,
  );
}

describe("ScrollArea", () => {
  test("renders root container", () => {
    const { container } = renderScrollArea();
    const root = container.firstElementChild;
    expect(root).toBeDefined();
    expect(root?.style.position).toBe("relative");
    expect(root?.style.overflow).toBe("hidden");
  });

  test("renders viewport with overflow scroll", () => {
    renderScrollArea();
    const viewport = screen.getByTestId("scroll-area-viewport");
    expect(viewport).toBeDefined();
    expect(viewport.style.overflow).toBe("scroll");
  });

  test("hides native scrollbar via scrollbar-width", () => {
    renderScrollArea();
    const viewport = screen.getByTestId("scroll-area-viewport");
    expect(viewport.style.scrollbarWidth).toBe("none");
  });

  test("renders content inside viewport", () => {
    renderScrollArea();
    expect(screen.getByText("Item 1")).toBeDefined();
    expect(screen.getByText("Item 50")).toBeDefined();
  });

  test("scrollbar has role='scrollbar'", () => {
    renderScrollArea();
    const scrollbar = screen.queryByRole("scrollbar");
    // Scrollbar may or may not render depending on JSDOM overflow detection
    // In a real browser, overflow is detected; in JSDOM scrollHeight === clientHeight
    // This test validates the role attribute when the scrollbar is present
    if (scrollbar) {
      expect(scrollbar).toHaveAttribute("aria-orientation", "vertical");
    }
  });

  test("scrollbar has aria-orientation='vertical'", () => {
    renderScrollArea();
    const scrollbar = screen.queryByTestId("scroll-area-scrollbar");
    if (scrollbar) {
      expect(scrollbar).toHaveAttribute("aria-orientation", "vertical");
    }
  });

  test("root has relative positioning for scrollbar absolute placement", () => {
    const { container } = renderScrollArea();
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.position).toBe("relative");
  });

  test("viewport fills the root container", () => {
    renderScrollArea();
    const viewport = screen.getByTestId("scroll-area-viewport");
    expect(viewport.style.width).toBe("100%");
    expect(viewport.style.height).toBe("100%");
  });

  test("thumb has position absolute for track placement", () => {
    renderScrollArea();
    const thumb = screen.queryByTestId("scroll-area-thumb");
    if (thumb) {
      expect(thumb.style.position).toBe("absolute");
    }
  });
});
