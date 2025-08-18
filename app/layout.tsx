import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_KR, Inter } from "next/font/google"
import "./globals.css"

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Labchain - 어르신 정서 가이드 AI",
  description: "사회복지사를 위한 어르신 정서 관리 AI 앱",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${inter.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${notoSansKR.style.fontFamily};
  --font-sans: ${notoSansKR.variable};
  --font-mono: ${inter.variable};
}
        `}</style>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
