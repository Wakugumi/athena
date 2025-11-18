"use client";

import { Card } from "flowbite-react";

export default function AuthCardClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Card className="w-full max-w-md md:max-w-lg">
        {children}
      </Card>
    </>
  );
}
