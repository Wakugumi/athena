"use client";
import AuthCardClient from "./_components/AuthCardClient";
import NavbarClient from "./_components/NavbarClient";

import AuthRedirectClient from "./_components/AuthRedirectClient";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [client] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={client}>
        <AuthRedirectClient />

        <div className="relative min-h-screen bg-background flex flex-col">
          <NavbarClient />
          <div className="flex-1 min-h-0 grid place-items-center p-4 overflow-y-auto">
            <AuthCardClient>
              {children}
            </AuthCardClient>
          </div>
        </div>

      </QueryClientProvider>
    </>
  );
}
