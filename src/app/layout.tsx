import type { Metadata } from "next";
import { Sora, DM_Sans, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import CursorGlow from "@/components/CursorGlow";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/assets/logo-icon.svg",
  },
  title: "AkiraKaizen | Design & Development Studio",
  description:
    "Studio de design e desenvolvimento web focado em soluções digitais elegantes e funcionais. Transformamos ideias em experiências digitais memoráveis.",
  openGraph: {
    title: "AkiraKaizen | Design & Development Studio",
    description:
      "Studio de design e desenvolvimento web focado em soluções digitais elegantes e funcionais.",
    url: "https://akirakaizen.com",
    siteName: "AkiraKaizen",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AkiraKaizen | Design & Development Studio",
    description:
      "Studio de design e desenvolvimento web focado em soluções digitais elegantes e funcionais.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${dmSans.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Skip Link */}
        <a href="#main" className="skip-link">
          Pular para o conteúdo
        </a>

        {/* Loader */}
        <Loader />

        {/* Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Scroll Progress */}
        <div className="scroll-progress" id="scroll-progress" aria-hidden="true" />

        {/* Custom Cursor */}
        <CursorGlow />

        {/* Page Content */}
        <SmoothScroll>
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
