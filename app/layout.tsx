import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Sidebar from "./components/Sidebar";
import "./globals.css";
import HeaderAuth from './components/HeaderAuth'
import MobileNav from './components/MobileNav'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SplitEase",
  description: "Beautiful splitwise alternative built with Next.js and FastAPI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-splitwise-green/30">
        <ClerkProvider>
          {/* Main Layout Wrap Container */}
          <div className="flex flex-col flex-1 h-screen overflow-hidden">
            <header className="flex justify-between items-center p-4 gap-4 h-16 border-b border-glass-border glass relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-splitwise-green shadow-[0_0_15px_rgba(91,197,167,0.5)] flex items-center justify-center">
                  <span className="font-bold text-white text-xl leading-none">S</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">SplitEase</h1>
              </div>
              <HeaderAuth />
            </header>

            <div className="flex flex-1 overflow-hidden">
              {isSignedIn && <Sidebar />}

              <main className="flex-1 overflow-y-auto relative">
                {children}
              </main>
            </div>
            {isSignedIn && <MobileNav />}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
