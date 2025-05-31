import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function usePreviousPathname() {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    previousPathRef.current = pathname;
  }, [pathname]);

  return previousPathRef.current;
}
