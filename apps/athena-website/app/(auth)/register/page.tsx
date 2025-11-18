"use client";

import { Label, TextInput, Button, Checkbox } from "flowbite-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { SignupRequest } from "@athena/types";
import UserService from "@/api/UserService";
import { redirect } from "next/navigation";

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data: SignupRequest = {
            firstName: form.get("firstname") as string,
            lastName: form.get("lastname") as string,
            username: form.get("username") as string,
            email: form.get("email") as string,
            password: form.get("password") as string,
        };
        if (data.password !== form.get("confirm")) {
            setError("Passwords do not match");
            return;
        }
        setError(null);
        UserService.signUp(data).then(() => {
            redirect('/login');
        }).catch((err) => {
            setError(err.message || "An error occurred during registration");
        });
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Create an account</h1>
                    <p className="text-sm text-secondary">Join Athena in a few seconds</p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="firstname">First name</Label>
                        </div>
                        <TextInput id="firstname" name="firstname" type="text" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="lastname">Last name</Label>
                        </div>
                        <TextInput id="lastname" name="lastname" type="text" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="username">Username</Label>
                        </div>
                        <TextInput id="username" name="username" type="text" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email">Email</Label>
                        </div>
                        <TextInput id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <TextInput id="password" name="password" type="password" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="confirm">Confirm password</Label>
                        </div>
                        <TextInput id="confirm" name="confirm" type="password" required />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="terms" name="terms" required />
                        <Label htmlFor="terms">I agree to the Terms and Privacy Policy</Label>
                    </div>
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                    <Button type="submit" color="primary" className="w-full">
                        Create account
                    </Button>
                </form>
                <p className="text-sm text-secondary">
                    Already have an account?{" "}
                    <Link href="/login" className="text-foreground hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </>
    );
}