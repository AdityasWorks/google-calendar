import { CalendarProvider } from "@/app/context/CalendarContext";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

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
                <SessionProvider>
                    <CalendarProvider>{children}</CalendarProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
