import type { Metadata } from "next";
import { JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
import classNames from "classnames";

import { GoogleAnalytics } from "@next/third-parties/google";
import ThemeScript from "@/lib/ThemeScript";

import "./globals.css";

const jetBrains = JetBrains_Mono({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-jetBrains",
});
const ibm = IBM_Plex_Mono({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A Small Peek into my Life.",
  description: "Blog by Kota Cody Enokida using NextJS and Google Firebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID as string}
      />
      <body className={classNames(ibm.className, jetBrains.variable)}>
        {children}
      </body>
    </html>
  );
}
