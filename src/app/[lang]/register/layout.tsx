import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Page",
  description: "Register Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
