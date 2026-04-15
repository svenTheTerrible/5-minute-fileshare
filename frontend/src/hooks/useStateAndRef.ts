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
          ? (newValue as (old: T) => T)(value)
          : (newValue as T);

      setValue(trueNewValue);
      mutableRef.current = trueNewValue;
    },
    [setValue, value],
  );

  return [value, setValueAndRef, mutableRef];
};
