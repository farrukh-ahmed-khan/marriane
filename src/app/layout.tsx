import type { Metadata } from "next";
import { Bebas_Neue, Heebo, Roboto } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const heebo = Heebo({ subsets: ["latin"], variable: "--font-heebo", display: "swap" });
const roboto = Roboto({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-roboto-var", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Oregon County Capers", template: "%s | Oregon County Capers" },
  description:
    "Discover Oregon, one county at a time. Explore all 36 counties through adventures, attractions, and hidden gems statewide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${heebo.variable} ${roboto.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
