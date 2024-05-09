"use client";

import useUserSession from "@/hooks/useUserSession";
import { getUserRole } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useUserSession();
  const router = useRouter();

  useEffect(() => {
    const getDocument = async () => {};

    getDocument();
  }, [user, router]);

  return <>{children}</>;
}
