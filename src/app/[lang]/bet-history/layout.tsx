import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bet History Page",
  description: "Bet  History Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
