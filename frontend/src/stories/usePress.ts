import { useState, useCallback, MouseEventHandler } from "react";

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
    MouseEventHandler
  >,
] {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const handlers = {
    onMouseEnter: useCallback<MouseEventHandler>(
      () => !disabled && setHover(true),
      [disabled],
    ),
    onMouseLeave: useCallback<MouseEventHandler>(() => {
      setHover(false);
      setActive(false);
    }, []),
    onMouseDown: useCallback<MouseEventHandler>(
      () => !disabled && setActive(true),
      [disabled],
    ),
    onMouseUp: useCallback<MouseEventHandler>(() => setActive(false), []),
  };
  return [{ hover: hover && !disabled, active: active && !disabled }, handlers];
}
