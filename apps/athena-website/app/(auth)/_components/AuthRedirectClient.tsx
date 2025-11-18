"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthRedirectClient() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth?.checkAuth && auth.checkAuth()) {
    router.replace("/");
    }
  }, [auth, router]);

  return null;
}
