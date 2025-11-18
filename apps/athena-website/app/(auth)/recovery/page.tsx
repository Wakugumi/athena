"use client";

import { Label, TextInput, Button } from "flowbite-react";
import Link from "next/link";
import { FormEvent } from "react";

export default function RecoveryPage() {
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = form.get("email");
        console.log("recover", { email });
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Account recovery</h1>
                    <p className="text-sm text-secondary">Enter your email and we&apos;ll send you a reset link</p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email">Email</Label>
                        </div>
                        <TextInput id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>

                    <Button type="submit" color="primary" className="w-full">
                        Send recovery link
                    </Button>
                </form>
                <p className="text-sm text-secondary">
                    Remembered your password? {""}
                    <Link href="/login" className="text-foreground hover:underline">
                        Go back to sign in
                    </Link>
                </p>
            </div>
        </>
    );
}