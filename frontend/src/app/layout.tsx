import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RichCards | Premium Luxury Wedding Invitation Design Studio",
  description: "Premium digital wedding invitation videos, save the dates, e-cards, custom monograms, and luxury wedding stationery designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans bg-[#FDFBF7] text-[#0B0B0B] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
