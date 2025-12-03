'use client';
import { useAuth } from "@/context/AuthContext";
import Popup from "../_components/Popup";
import Footer from "./_components/Footer";
import NavbarClient from "./_components/NavbarClient";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [client] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={client}>
        <NavbarClient />
        <Popup />
        <main className="pt-14">{children}</main>

        <Footer />
      </QueryClientProvider>
    </>
  );
}
