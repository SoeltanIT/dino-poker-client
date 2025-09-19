import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wallet Page",
  description: "My Wallet Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
