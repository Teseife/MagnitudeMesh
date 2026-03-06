import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MagnitudeMesh | Seismic Command Center",
  description:
    "Real-time global earthquake visualization platform. Track seismic events, analyze impact zones, and explore magnitude data on an interactive 3D globe.",
  keywords: [
    "earthquake",
    "seismic",
    "visualization",
    "3D globe",
    "USGS",
    "geospatial",
  ],
  authors: [{ name: "MagnitudeMesh" }],
  openGraph: {
    title: "MagnitudeMesh | Seismic Command Center",
    description: "Real-time global earthquake visualization platform",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0b0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="/cesium/Widgets/widgets.css" />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${jetbrainsMono.variable} antialiased bg-[#050507] text-white`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
