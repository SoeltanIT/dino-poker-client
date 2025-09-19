import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Account Page",
  description: "Bank Account Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
