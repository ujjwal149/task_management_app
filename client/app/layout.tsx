import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Toaster } from "react-hot-toast";

import AuthProvider from "@/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://taskfloo.in"),

  title: {
    default: "TaskFlow - Simple Task Management",
    template: "%s | TaskFlow",
  },

  description:
    "TaskFlow is a simple task management application to organize, manage, and track your tasks efficiently.",

  keywords: [
    "task management",
    "task manager",
    "productivity",
    "manage tasks",
    "TaskFlow",
  ],

  authors: [{ name: "TaskFlow" }],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "TaskFlow - Simple Task Management",
    description:
      "Organize, manage, and track your tasks efficiently with TaskFlow.",
    url: "https://taskfloo.in",
    siteName: "TaskFlow",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "12px",
                background: "#1E293B",
                color: "#fff",
              },
            }}
          />
        </AuthProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MCJQRR8CYT"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-MCJQRR8CYT');
          `}
        </Script>
      </body>
    </html>
  );
}