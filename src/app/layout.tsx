import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Providers } from "./providers";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "VASHUDHA — Food Rescue & Carbon Marketplace",
  description:
    "VASHUDHA connects surplus food donors with NGOs, generates blockchain-verified impact records, and issues Pre-Verified Impact Tokens for ESG compliance. Every meal rescued. Every tonne verified.",
  keywords: [
    "food rescue",
    "carbon credits",
    "blockchain",
    "ESG",
    "NGO",
    "food waste",
    "VASHUDHA",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${bricolage.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ backgroundColor: "#050805", color: "#f0faf0" }}
      >
        <Providers>
          {children}
        </Providers>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
