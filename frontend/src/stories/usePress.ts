import { useState, useCallback } from "react";

interface PressState {
  hover: boolean;
  active: boolean;
}

export function usePress(
  disabled: boolean,
): [
  PressState,
  Record<
    "onMouseEnter" | "onMouseLeave" | "onMouseDown" | "onMouseUp",
    () => void
  >,
] {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const handlers = {
    onMouseEnter: useCallback(() => !disabled && setHover(true), [disabled]),
    onMouseLeave: useCallback(() => {
      setHover(false);
      setActive(false);
    }, []),
    onMouseDown: useCallback(() => !disabled && setActive(true), [disabled]),
    onMouseUp: useCallback(() => setActive(false), []),
  };
  return [{ hover: hover && !disabled, active: active && !disabled }, handlers];
}
