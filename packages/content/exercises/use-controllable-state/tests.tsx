import { renderHook, act } from "@testing-library/react";
import { useControllableState } from "./initial";

describe("useControllableState", () => {
  describe("uncontrolled mode (value is undefined)", () => {
    test("initializes with defaultValue", () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: "hello",
        }),
      );

      expect(result.current[0]).toBe("hello");
    });

    test("updates internal state when setValue is called", () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: 0,
        }),
      );

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });

    test("calls onChange callback when setValue is called", () => {
      const onChange = vi.fn();

      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: false,
          onChange,
        }),
      );

      act(() => {
        result.current[1](true);
      });

      expect(onChange).toHaveBeenCalledWith(true);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("works with boolean defaultValue of false", () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: undefined,
          defaultValue: false,
        }),
      );

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });
  });

  describe("controlled mode (value is defined)", () => {
    test("uses the provided value", () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: "controlled",
          defaultValue: "default",
        }),
      );

      expect(result.current[0]).toBe("controlled");
    });

    test("does not update internal state when setValue is called", () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useControllableState({
            value,
            defaultValue: 0,
          }),
        { initialProps: { value: 10 as number | undefined } },
      );

      expect(result.current[0]).toBe(10);

      // Call setValue -- should NOT change the resolved value
      act(() => {
        result.current[1](99);
      });

      // Value stays at 10 because it is controlled
      expect(result.current[0]).toBe(10);
    });

    test("calls onChange callback even in controlled mode", () => {
      const onChange = vi.fn();

      const { result } = renderHook(() =>
        useControllableState({
          value: "current",
          defaultValue: "default",
          onChange,
        }),
      );

      act(() => {
        result.current[1]("next");
      });

      expect(onChange).toHaveBeenCalledWith("next");
    });

    test("reflects external value changes", () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useControllableState({
            value,
            defaultValue: "default",
          }),
        { initialProps: { value: "first" as string | undefined } },
      );

      expect(result.current[0]).toBe("first");

      rerender({ value: "second" });
      expect(result.current[0]).toBe("second");
    });

    test("treats false as a valid controlled value (not uncontrolled)", () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: false,
          defaultValue: true,
        }),
      );

      // false is a valid controlled value, should NOT fall back to defaultValue
      expect(result.current[0]).toBe(false);
    });

    test("treats 0 as a valid controlled value", () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: 0,
          defaultValue: 100,
        }),
      );

      expect(result.current[0]).toBe(0);
    });

    test("treats empty string as a valid controlled value", () => {
      const { result } = renderHook(() =>
        useControllableState({
          value: "",
          defaultValue: "fallback",
        }),
      );

      expect(result.current[0]).toBe("");
    });
  });
});
