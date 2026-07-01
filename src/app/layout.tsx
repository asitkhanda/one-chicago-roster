import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { AgentationToolbar } from "@/components/AgentationToolbar";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "One Chicago Roster — In-Universe Watch Order",
  description:
    "The definitive in-universe watch order for Chicago Fire, P.D., Med, Justice, and crossover episodes. Track your progress through 800+ episodes.",
  openGraph: {
    title: "One Chicago Roster",
    description:
      "Watch every One Chicago episode in the correct in-universe order, with filters, search, and progress tracking.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1500,
        height: 2250,
        alt: "One Chicago Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One Chicago Roster",
    description:
      "Watch every One Chicago episode in the correct in-universe order, with filters, search, and progress tracking.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="one-chicago-roster-theme";var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t="dark"}document.documentElement.dataset.theme=t}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <AgentationToolbar />
        <Analytics />
      </body>
    </html>
  );
}
