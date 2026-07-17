import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TechnicFix — Parafusos e Fixadores",
    template: "%s | TechnicFix",
  },
  description:
    "Loja especializada em parafusos, fixadores e materiais de construção. Qualidade e atendimento especializado para sua obra. Atacado e varejo.",
  keywords: [
    "parafusos",
    "fixadores",
    "buchas",
    "porcas",
    "arruelas",
    "chumbadores",
    "ferramentas",
    "EPIs",
    "material de construção",
    "technicfix",
  ],
  authors: [{ name: "TechnicFix" }],
  creator: "TechnicFix",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://technicfix.com.br"),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "TechnicFix",
    title: "TechnicFix — Parafusos e Fixadores",
    description:
      "Loja especializada em parafusos, fixadores e materiais de construção. Qualidade e atendimento especializado para sua obra.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechnicFix — Parafusos e Fixadores",
    description: "Loja especializada em parafusos, fixadores e materiais de construção.",
    images: ["/og-image.jpg"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
