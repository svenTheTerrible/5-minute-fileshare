import { useEffect, useRef } from "react";

export const useEffectOnce = (method: () => any, depenencdies: any[]) => {
  const alreadyRun = useRef<boolean>(false);

  useEffect(() => {
    if (alreadyRun.current) {
      return;
    }
    alreadyRun.current = true;
    return method();
  }, depenencdies);
};
