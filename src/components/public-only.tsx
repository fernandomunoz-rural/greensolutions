"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Renders the public header/footer everywhere except inside /admin. */
export function PublicOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
