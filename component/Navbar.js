
"use client";
 
import { motion } from "framer-motion";
 
export default function Navbar({ coins }) {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className="mt-4 flex items-center justify-between rounded-2xl px-4 py-2 sm:px-6"
          style={{
            background: "rgba(247, 240, 240, 0.88)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(37, 103, 30, 0.15)",
            boxShadow: "0 4px 24px rgba(37, 103, 30, 0.08)",
          }}
        >
          {/* Left — Logo */}
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-2xl shadow-sm"
              style={{ background: "#25671E", border: "1px solid #1a4d15" }}
            >
              <span className="text-lg">🔐</span>
            </div>
            <div className="flex items-baseline gap-1 text-lg font-semibold tracking-tight">
              <span style={{ color: "#25671E" }}>VAULT</span>
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: "#48A111",
                  boxShadow: "0 0 10px rgba(72,161,17,0.7)",
                }}
              />
            </div>
          </div>
 
          {/* Center — Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {[
              { label: "Home", href: "#hero" },
              { label: "Library", href: "#library" },
              { label: "Leaderboard", href: "#leaderboard" },
              { label: "Premium", href: "#premium" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-medium transition-opacity hover:opacity-60"
                style={{ color: "#25671E" }}
              >
                {label}
              </a>
            ))}
          </nav>
 
          {/* Right — Coin pill + CTA */}
          <div className="flex items-center gap-3">
            {/* Coin pill */}
            <div
              className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: "rgba(37, 103, 30, 0.06)",
                border: "1px solid rgba(242, 181, 11, 0.55)",
              }}
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                style={{
                  background: "#F2B50B",
                  boxShadow: "0 0 14px rgba(242,181,11,0.55)",
                }}
              >
                🪙
              </div>
              <span style={{ color: "#25671E", opacity: 0.65 }}>Coins</span>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: "#25671E" }}
              >
                {coins}
              </span>
            </div>
 
            {/* CTA */}
            <button
              className="hidden sm:inline-flex rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-95"
              style={{
                background: "#25671E",
                boxShadow: "0 4px 14px rgba(37, 103, 30, 0.35)",
              }}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}