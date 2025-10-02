import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "World Time Clocks - Multi-Timezone Clock Tool",
  description:
    "View, compare, and convert times across multiple time zones. Perfect for remote teams, travelers, and global collaboration.",
  keywords: ["world clock", "time zones", "timezone converter", "meeting planner", "UTC"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
