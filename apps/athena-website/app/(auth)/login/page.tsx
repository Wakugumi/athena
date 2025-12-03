"use client";

import UserService from "@/api/UserService";
import { useAuth } from "@/context/AuthContext";
import { LoginRequest } from "@athena/types";
import { useMutation } from "@tanstack/react-query";
import { Label, TextInput, Button, Checkbox } from "flowbite-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const login = useMutation({
    mutationFn: (payload: LoginRequest) => UserService.login(payload),
    onError: (error) => { setError("Credential mismatch") },
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.data?.access_token!);
      await auth.checkAuth()
      router.push("/")
    }
  })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: LoginRequest = {
      username: form.get("username") as string,
      password: form.get("password") as string,
    }
    setError(null);
    login.mutate(data)

  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-secondary">Sign in to your account</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div>
            <div className="mb-2 block">
              <Label color="primary" htmlFor="username">Username</Label>
            </div>
            <TextInput color="primary" id="username" name="username" type="text" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label color="primary" htmlFor="password">Password</Label>
            </div>
            <TextInput color="primary" id="password" name="password" type="password" required />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox color="primary" id="remember" name="remember" />
              <Label color="primary" htmlFor="remember">Remember me</Label>
            </div>
            <Link href="/recovery" className="text-sm text-foreground hover:underline">
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" color="primary" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="text-sm text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
