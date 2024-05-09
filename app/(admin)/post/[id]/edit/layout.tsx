import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit this post",
  description: "Blog by Kota Cody Enokida using NextJS and Google Firebase",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
