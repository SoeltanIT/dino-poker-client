import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password Page",
  description: "Forgot Password Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
