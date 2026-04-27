import { ReactElement } from "react";
import { useAuthStore } from "../state/auth-store";

export const OnlyUser = ({ children }: { children: ReactElement }) => {
  const isAnonymous = useAuthStore((s) => s.currentUser?.isAnonymous);
  if (!isAnonymous) return <>{children}</>;
  return <></>;
};

export const OnlyAnonymous = ({ children }: { children: ReactElement }) => {
  const isAnonymous = useAuthStore((s) => s.currentUser?.isAnonymous);
  if (isAnonymous) return <>{children}</>;
  return <></>;
};
