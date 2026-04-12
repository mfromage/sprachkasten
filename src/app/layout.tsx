import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Sprachkasten",
  description: "Language learning toolbox",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
        <header className="flex items-center justify-between max-w-2xl mx-auto px-6 py-4">
          <span className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase">
            Sprachkasten
          </span>
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
