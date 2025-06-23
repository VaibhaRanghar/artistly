import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/contexts/theme-context";
import { ArtistProvider } from "@/src/contexts/artist-context";
import { Navigation } from "@/src/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://artistly-799l.vercel.app/"),
  title: "Artistly - Book Professional Artists for Your Events",
  description:
    "Connect with talented singers, dancers, speakers, and DJs for your next event. Professional artist booking made simple.",
  keywords:
    "artist booking, event entertainment, singers, dancers, speakers, DJs",
  authors: [{ name: "Artistly Team" }],
  openGraph: {
    title: "Artistly - Book Professional Artists for Your Events",
    description:
      "Connect with talented singers, dancers, speakers, and DJs for your next event.",
    type: "website",
  },
  icons: "/image.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ArtistProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
          </ArtistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
