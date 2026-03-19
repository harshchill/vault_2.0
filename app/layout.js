import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Vault · Every Exam Paper, Right Here",
  description:
    "VAULT is a coin-powered exam paper library for Indian college students. Access previous year papers, unlock with coins, and study smarter.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-inter antialiased bg-slate-950 text-text-main`}
      >
        <div className="min-h-screen bg-[#285A48] text-text-main">
          {children}
        </div>
      </body>
    </html>
  );
}
