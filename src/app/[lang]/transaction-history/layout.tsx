import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transcation History Page",
  description: "Transcation  History Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
