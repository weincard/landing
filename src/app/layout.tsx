import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/lib/di/reflect-metadata";
import NProgressBar from "@/components/n-progress-bar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WEINCARD",
  description: "WEINCARD",
  metadataBase: new URL("https://WEINCARD.vercel.app/"),
  icons: "https://WEINCARD.vercel.app/logo.png",

  openGraph: {
    title: "WEINCARD",
    description: "WEINCARD",
    images: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors />
          <NProgressBar>{children}</NProgressBar>
        </ThemeProvider>
      </body>
    </html>
  );
}
