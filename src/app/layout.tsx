import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import IntroLoader from "@/components/ui/IntroLoader";
import { ScrollProgressBar, BackToTop } from "@/components/ui/PageUtils";
import CountdownPromo from "@/components/ui/CountdownPromo";
import { AuthProvider } from "@/hooks/useAuth";
import SocialProofNotification from "@/components/ui/SocialProofNotification";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CAROANA MINCEUR | Rituels Naturels de Bien-être Premium",
  description: "Découvrez nos infusions, gélules et tisanes ventre plat inspirées des plantes et des traditions africaines pour favoriser une sensation de légèreté.",
  metadataBase: new URL("https://caroana-minceur.vercel.app"),
  openGraph: {
    title: "CAROANA MINCEUR | Rituels Naturels de Bien-être Premium",
    description: "Découvrez nos tisanes et gélules ventre plat naturelles d'inspiration traditionnelle africaine.",
    url: "/",
    siteName: "CAROANA MINCEUR",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAROANA MINCEUR | Bien-être Naturel",
    description: "Tisanes et gélules ventre plat naturelles.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-theme-bg text-theme-fg selection:bg-theme-accent selection:text-theme-bg">
        <AuthProvider>
          <ThemeProvider>
            <ScrollProgressBar />
            <BackToTop />
            <IntroLoader />
            <SmoothScroll />
            <CustomCursor />
            <CountdownPromo />
            <Header />
            <main className="min-h-screen pattern-leaves">{children}</main>
            <Footer />
            <WhatsAppWidget />
            <SocialProofNotification />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
