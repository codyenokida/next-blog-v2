"use client";

import useUserSession from "@/hooks/useUserSession";
import { getUserRole } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useUserSession(null);
  const router = useRouter();

  useEffect(() => {
    const getDocument = async () => {
      if (!user && router) {
        router.push("/login");
      }
      if (user && router) {
        const role = await getUserRole(user.email);
        if (role === "Admin") {
          router.push("/dashboard");
        }
      }
    };

    getDocument();
  }, [user, router]);

  return <>{children}</>;
}
