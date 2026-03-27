
"use client";
 
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, LayoutDashboard, User, Upload, Bookmark, Settings, LogOut } from "lucide-react";
 
export default function Navbar({ coins }) {
  const { data: session } = useSession();
  const [logoHover, setLogoHover] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const displayName = session?.user?.name?.trim() || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarUrl = session?.user?.pfp_url;

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
              { label: "Browse", href: "/user/browse", authOnly: false },
              { label: "Upload", href: "/user/upload", authOnly: true },
            ]
              .filter((item) => !item.authOnly || session?.user)
              .map(({ label, href }) => (
                <Link
                key={label}
                href={href}
                className="font-medium transition-opacity hover:opacity-60"
                style={{ color: "#25671E" }}
              >
                {label}
                </Link>
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
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full p-1.5 pr-2 text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{
                    background: "rgba(37, 103, 30, 0.08)",
                    border: "1px solid rgba(37, 103, 30, 0.18)",
                    boxShadow: isMenuOpen
                      ? "0 6px 16px rgba(37, 103, 30, 0.22)"
                      : "0 4px 12px rgba(37, 103, 30, 0.12)",
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover"
                      style={{ border: "1px solid rgba(37, 103, 30, 0.2)" }}
                    />
                  ) : (
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        background: "#25671E",
                        color: "white",
                      }}
                    >
                      {avatarInitial || <User size={14} />}
                    </div>
                  )}
                  <ChevronDown
                    size={14}
                    style={{
                      color: "#25671E",
                      transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl"
                      style={{
                        background: "rgba(247, 240, 240, 0.95)",
                        backdropFilter: "blur(18px)",
                        border: "1px solid rgba(37, 103, 30, 0.16)",
                        boxShadow: "0 14px 40px rgba(37, 103, 30, 0.18)",
                      }}
                    >
                      <div
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ borderBottom: "1px solid rgba(37, 103, 30, 0.12)" }}
                      >
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                          style={{
                            background: "rgba(37, 103, 30, 0.1)",
                            color: "#25671E",
                          }}
                        >
                          <User size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold" style={{ color: "#25671E" }}>
                            {displayName}
                          </p>
                        </div>
                      </div>

                      <div className="px-2 py-2">
                        {[
                          { label: "My Dashboard", href: "/user/dashboard", icon: <LayoutDashboard size={16} /> },
                          { label: "My Uploads", href: "/user/upload", icon: <Upload size={16} /> },
                          { label: "My Saved Papers", href: "/user/saved-papers", icon: <Bookmark size={16} /> },
                          { label: "My Profile", href: "/user/profile", icon: <Settings size={16} /> },
                        ].map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-white/80"
                            style={{ color: "#25671E" }}
                          >
                            <span style={{ opacity: 0.75 }}>{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div
                        className="px-2 py-2"
                        style={{ borderTop: "1px solid rgba(37, 103, 30, 0.12)" }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/80"
                          style={{ color: "#25671E" }}
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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