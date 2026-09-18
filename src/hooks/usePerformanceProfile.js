import { useMediaQuery } from "react-responsive";

export function usePerformanceProfile() {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const hasCoarsePointer = useMediaQuery({ query: "(pointer: coarse)" });
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const lowPower = isMobile || hasCoarsePointer ||
    (memory > 0 && memory <= 4) || (cores > 0 && cores <= 4) ||
    Boolean(navigator.connection?.saveData);

  return { lowPower, isMobile };
}
