import type React from "react"
import type { Metadata } from "next"
// Adding Playfair Display for elegant serif headlines and Inter for body text
import { Inter, Playfair_Display, Hepta_Slab } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Setting up Inter for sans-serif body text and Playfair Display for elegant headers
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "700", "900"] })
const heptaSlab = Hepta_Slab({ subsets: ["latin"], variable: "--font-hepta-slab", weight: ["400", "700", "900"] })

export const metadata: Metadata = {
  // Updated metadata for restaurant membership landing page
  title: "Weincard",
  description:
    "Tu llave para lo que quieras.",
  generator: "",
  icons: {
    icon: [
      {
        url: "/isotipo-weincard.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/isotipo-weincard.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/isotipo-weincard.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/isotipo-weincard.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} ${heptaSlab.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
