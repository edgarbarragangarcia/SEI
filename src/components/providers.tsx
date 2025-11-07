"use client";

import { SessionProvider } from "next-auth/react";
import GlobalLoading from '@/components/global-loading';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GlobalLoading />
      {children}
    </SessionProvider>
  );
}
