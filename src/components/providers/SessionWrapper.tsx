"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function SessionWrapper({ children }: Props) {
  return (
    <SessionProvider
      refetchInterval={0} // Disable automatic refetching
      refetchOnWindowFocus={false} // Disable refetch on window focus
    >
      {children}
    </SessionProvider>
  );
}
