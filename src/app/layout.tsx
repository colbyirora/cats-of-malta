import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Playfair_Display, Fraunces, Fredoka, Gochi_Hand, Nunito, Mali, Patrick_Hand } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: "700",
});

const gochiHand = Gochi_Hand({
  variable: "--font-gochi-hand",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: "700",
});

const mali = Mali({
  variable: "--font-mali",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Cats of Malta | Celebrating Malta's Street Cats",
  description: "A visual storytelling project celebrating the iconic street cats of Malta. Browse, name, and support the feline friends of the Mediterranean.",
  openGraph: {
    title: "Cats of Malta",
    description: "Celebrating Malta's iconic street cats through photography and community",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${playfair.variable} ${fraunces.variable} ${fredoka.variable} ${gochiHand.variable} ${nunito.variable} ${mali.variable} ${patrickHand.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
