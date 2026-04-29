import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MSWProvider } from "@/components/MSWProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinXAI | Açıklanabilir Finansal Karar Destek Platformu",
  description:
    "XAITK Tabanlı İnsan-Makine Takımlaşması ile şeffaf ve açıklanabilir finansal karar destek sistemi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full">
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  );
}
