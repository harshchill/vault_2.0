
"use client";
 
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
 
export default function Navbar({ coins }) {
  const { data: session } = useSession();
  const [logoHover, setLogoHover] = useState(false);

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
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-2xl shadow-sm"
              style={{ background: "#25671E", border: "1px solid #1a4d15" }}
              onMouseEnter={() => setLogoHover(true)}
              onMouseLeave={() => setLogoHover(false)}
            >
              <span className="text-lg">{logoHover ? "🔑" : "🔐"}</span>
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
          </Link>
 
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
            {/* Coin pill - only shown when logged in */}
            {session?.user && (
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
                  {session.user.coinBalance || 0}
                </span>
              </div>
            )}

            {/* Auth Actions */}
            {session?.user? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:text-xs font-medium px-2" style={{ color: "#25671E" }}>
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden sm:inline-flex rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{
                    background: "#25671E",
                    boxShadow: "0 4px 14px rgba(37, 103, 30, 0.35)",
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-flex rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all hover:opacity-70"
                  style={{
                    background: "rgba(37, 103, 30, 0.1)",
                    border: "1px solid rgba(37, 103, 30, 0.2)",
                    color: "#25671E",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden sm:inline-flex rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{
                    background: "#25671E",
                    boxShadow: "0 4px 14px rgba(37, 103, 30, 0.35)",
                  }}
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}