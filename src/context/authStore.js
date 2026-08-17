import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

const ADMIN_UIDS = new Set([
  "QY2KLGHSRuQMzPeQEkLrBp2Nzat1",
  "zm3bLiR32SegwMaEJ8LC0bFP7Eb2",
]);

export function isAdminUser(user) {
  return Boolean(user && ADMIN_UIDS.has(user.uid));
}

export function useAuth() {
  return useContext(AuthContext);
}
