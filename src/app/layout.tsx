import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Delhi Public School - ERP System",
  description: "Complete School ERP Software for managing students, fees, and reports. Professional school management system.",
  keywords: ["School ERP", "Education Management", "Fee Collection", "Student Management", "School Software"],
  authors: [{ name: "Delhi Public School" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Delhi Public School - ERP System",
    description: "Complete School ERP Software for managing students, fees, and reports",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
