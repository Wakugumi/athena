"use client";

import Link from "next/link";
import { Button } from "flowbite-react";

export default function NotFound() {
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
                <p className="text-sm font-medium text-secondary">404</p>
                <h1 className="mt-2 text-3xl font-semibold text-foreground">Page not found</h1>
                <p className="mt-2 text-sm text-secondary max-w-md">
                    Sorry, we couldn&aptos;t find the page you&aptos;re looking for. It might have been moved or deleted.
                </p>

                <div className="mt-6 flex items-center gap-3">
                    <Link href="/">
                        <Button color="primary">Go home</Button>
                    </Link>
                    <Button color="light" onClick={() => history.back()}>
                        Go back
                    </Button>
                </div>
            </div>
        </>
    );
}