import { useCallback } from "react";

export function useNavigate(setIsExiting: (val: boolean) => void, router: any) {
  return useCallback(
    (destination: string) => {
      setIsExiting(true);
      setTimeout(() => {
        router.push(`/${destination}`);
      }, 400); // match animation duration
    },
    [setIsExiting, router]
  );
}
