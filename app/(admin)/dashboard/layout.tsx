import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Admin Dashboard",
  description: "Blog by Kota Cody Enokida using NextJS and Google Firebase",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
