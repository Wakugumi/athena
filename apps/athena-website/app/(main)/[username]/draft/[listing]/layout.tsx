import NotFound from "@/app/not-found";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

export default function DraftLayout({ children }: Readonly<{ children: ReactNode }>) {

  return (
    <section className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-6 md:py-24 space-y-6 relative">

        {children}
      </div>
    </section>
  )
}
