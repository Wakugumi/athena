"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthRedirectClient() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const runCheck = async () => {
      if (await auth.checkAuth()) {
        router.replace("/");
      }
    };
    runCheck();
  }, [auth, router]);

  return null;
}
