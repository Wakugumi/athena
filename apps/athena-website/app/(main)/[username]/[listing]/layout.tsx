import { ReactNode } from "react";

export default function ListingLayout({
  children
}: Readonly<{ children: ReactNode }>) {


  return (
    <>
      <section className="bg-background min-h-screen">
        <div className="mx-auto max-w-8xl px-6 py-18 md:py-24 space-y-6 relative">
          {children}
        </div>
      </section></>
  )


}
