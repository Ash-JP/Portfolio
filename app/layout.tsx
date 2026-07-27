import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk, Syne, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Aashray J Pramod | Software Developer & AI Enthusiast",
  description: "Portfolio of Aashray J Pramod, a BTech CSE student specializing in AI & ML, Web Development, and highly aesthetic frontend experiences.",
  keywords: ["Aashray J Pramod", "Software Developer", "AI/ML", "Next.js", "React", "Portfolio", "Web Development", "UI/UX"],
  authors: [{ name: "Aashray J Pramod" }],
  creator: "Aashray J Pramod",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aashrayjpramod.com",
    title: "Aashray J Pramod | Software Developer & AI Enthusiast",
    description: "Portfolio of Aashray J Pramod, a BTech CSE student specializing in AI & ML, Web Development, and highly aesthetic frontend experiences.",
    siteName: "Aashray J Pramod Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aashray J Pramod | Software Developer",
    description: "Portfolio of Aashray J Pramod, building intelligent and aesthetic digital products.",
    creator: "@aashrayjpramod",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} ${syne.variable} ${playfair.variable} antialiased font-sans`}>
        <ThemeProvider attribute="data-theme" defaultTheme="minimalist" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
