import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import LoadingIntro from "@/components/layout/loading-intro";
import ScrollProgress from "@/components/layout/scroll-progress";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F4F1EA",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ReWear AI - Upcycle your old clothes with AI",
  description:
    "A quiet artificial intelligence that analyzes wear on forgotten clothing and creates tailored upcycling blueprints.",
  keywords: [
    "fashion",
    "upcycling",
    "sustainable fashion",
    "textile repair",
    "circular design",
    "sashiko",
  ],
  authors: [{ name: "ReWear AI Team" }],
  openGraph: {
    title: "ReWear AI - Upcycle your old clothes with AI",
    description:
      "A quiet artificial intelligence that analyzes wear on forgotten clothing and creates tailored upcycling blueprints.",
    type: "website",
    siteName: "ReWear",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[var(--color-paper,#F4F1EA)] text-[var(--color-ink,#0E0E0E)] font-sans antialiased selection:bg-[#0E0E0E] selection:text-white relative overflow-x-hidden">
        <SmoothScroll>
          {/* Global 2px ink progress bar */}
          <ScrollProgress />

          {/* Minimal 1.1s loading intro */}
          <LoadingIntro />

          {/* Page content layers */}
          <div className="flex-1 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
