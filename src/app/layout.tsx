import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { AgentationToolbar } from "@/components/AgentationToolbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteUrl } from "@/lib/site-url";

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

const siteUrl = getSiteUrl();

const ogImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 1800,
  alt: "One Chicago Collection",
  type: "image/jpeg",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "One Chicago Roster — In-Universe Watch Order",
    template: "%s | One Chicago Roster",
  },
  description:
    "The definitive in-universe watch order for Chicago Fire, P.D., Med, Justice, and crossover episodes. Track your progress through 800+ episodes.",
  keywords: [
    "One Chicago watch order",
    "Chicago Fire watch order",
    "Chicago PD watch order",
    "Chicago Med watch order",
    "One Chicago chronological order",
    "One Chicago crossover episodes",
    "in-universe watch order",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "One Chicago Roster",
    description:
      "Watch every One Chicago episode in the correct in-universe order, with filters, search, and progress tracking.",
    url: siteUrl,
    siteName: "One Chicago Roster",
    locale: "en_US",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "One Chicago Roster",
    description:
      "Watch every One Chicago episode in the correct in-universe order, with filters, search, and progress tracking.",
    images: [ogImage.url],
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
