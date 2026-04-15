import { useState, useRef, useCallback } from "react";
import type { Dispatch, SetStateAction, RefObject } from "react";

export const useStateAndRef = <T>(
  init: T,
): [T, Dispatch<SetStateAction<T>>, RefObject<T>] => {
  const [value, setValue] = useState<T>(init);
  const mutableRef = useRef<T>(init);

  const setValueAndRef = useCallback(
    (newValue: T | ((old: T) => T)) => {
      const trueNewValue =
        typeof newValue === "function"
          ? (newValue as (old: T) => T)(mutableRef.current)
          : (newValue as T);

      mutableRef.current = trueNewValue;
      setValue(trueNewValue);
    },
    [setValue],
  );

  return [value, setValueAndRef, mutableRef];
};
