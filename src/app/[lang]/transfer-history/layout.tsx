import { ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Transfer History Page',
  description: 'Transfer  History Page'
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
