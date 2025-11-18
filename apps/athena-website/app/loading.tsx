"use client";

import { Spinner } from "flowbite-react";
import Logo from "@/app/_components/Logo";

export default function Loading() {
    return (
        <>
            <div className="relative min-h-screen bg-background flex items-center justify-center">
                <Logo />
                <div className="flex flex-col items-center gap-4">
                    <Spinner aria-label="Loading" size="lg" className="text-primary" />
                    <p className="text-sm text-secondary">Loading…</p>
                </div>
            </div>
        </>
    );
}