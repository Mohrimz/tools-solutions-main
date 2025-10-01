import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/layout/header"
import { SkipLink } from "@/components/ui/skip-link"
import { Suspense } from "react"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css"
import { Titillium_Web as V0_Font_Titillium_Web } from "next/font/google"

const titilliumWeb = V0_Font_Titillium_Web({
  weight: ["200", "300", "400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-titillium-web",
})

export const metadata: Metadata = {
  title: "Tool Solutions",
  description:
    "Sri Lanka's trusted source for professional-grade hand tools. Quality tools at honest prices with island-wide delivery.",
  generator: "v0.app",
  icons: {
    icon: '/log.png',
    shortcut: '/log.png',
    apple: '/log.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${titilliumWeb.variable}`}>
        <ClerkProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange={false}
            storageKey="tools-solutions-theme"
          >
            <SkipLink />
            <Suspense fallback={<div>Loading...</div>}>
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main tabIndex={-1} className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </Suspense>
          </ThemeProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  )
}
