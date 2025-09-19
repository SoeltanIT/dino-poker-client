import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Referral Page",
  description: "My Referral Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
