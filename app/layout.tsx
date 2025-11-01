import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CalendarProvider } from "@/app/context/CalendarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Google Calendar Clone",
  description: "High-fidelity Google Calendar clone built with Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CalendarProvider>
          {children}
        </CalendarProvider>
      </body>
    </html>
  );
}
