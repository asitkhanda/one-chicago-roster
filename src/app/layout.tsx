import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "One Chicago Roster — In-Universe Watch Order",
  description:
    "The definitive in-universe watch order for Chicago Fire, P.D., Med, Justice, and crossover episodes. Track your progress through 800+ episodes.",
  openGraph: {
    title: "One Chicago Roster",
    description:
      "Watch every One Chicago episode in the correct in-universe order, with filters, search, and progress tracking.",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
