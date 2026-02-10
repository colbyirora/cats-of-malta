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
  description: "Discover the charming street cats of Malta! Browse photos, suggest names, vote for your favourites, and join a community celebrating the Mediterranean's most iconic feline residents.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Cats of Malta",
    description: "Meet the street cats of Malta! Browse adorable photos, help name unnamed cats, and vote for your favourites. A community-driven project celebrating the Mediterranean's most lovable feline residents.",
    type: "website",
    url: "https://catsofmalta.netlify.app",
    siteName: "Cats of Malta",
    images: [
      {
        url: "/logo.png",
        width: 633,
        height: 950,
        alt: "Cats of Malta - A kawaii cat with glasses and a red scarf",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Cats of Malta",
    description: "Meet the street cats of Malta! Browse photos, name cats, and vote for your favourites.",
    images: ["/logo.png"],
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
