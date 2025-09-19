import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Referral Detail Page",
  description: "My Referral Detail Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
