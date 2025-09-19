import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Promotion Page",
  description: "My Promotion Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
