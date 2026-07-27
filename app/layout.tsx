import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Closeit — Fashion Marketplace",
    template: "%s | Closeit",
  },
  description:
    "Buy and sell pre-loved fashion on Closeit, the AI-powered thrifting marketplace for vintage, streetwear, and pre-owned clothing.",
  keywords: ["thrifting", "vintage", "pre-loved", "fashion", "marketplace", "secondhand"],
  metadataBase: new URL("https://closeit.app"),
  openGraph: {
    title: "Closeit — Fashion Marketplace",
    description:
      "Buy and sell pre-loved fashion on Closeit, the AI-powered thrifting marketplace.",
    type: "website",
    locale: "en_US",
    siteName: "Closeit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
