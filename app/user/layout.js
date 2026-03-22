"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2, Upload, FileText } from "lucide-react";
import Navbar from "@/component/Navbar";

export default function UserLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg, #F7F0F0 0%, #eef5ec 60%, #F7F0F0 100%)" }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: "#25671E" }}>
          <Loader2 size={18} className="animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login?callbackUrl=/user/upload");
    return null;
  }

  const navLinks = [
    { href: "/user/browse", label: "Browse Papers", icon: <FileText size={16} /> },
    { href: "/user/upload", label: "Upload Paper", icon: <Upload size={16} /> },
  ];

  return (
    <>
      <Navbar />
      <div className="pt-20">
        {/* Secondary Navigation */}
        <div className="sticky top-[72px] z-40 px-4 sm:px-6 lg:px-8 mb-6">
          <div
            className="mx-auto max-w-7xl flex items-center gap-2 rounded-xl px-4 py-2"
            style={{
              background: "rgba(247, 240, 240, 0.92)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(37, 103, 30, 0.15)",
              boxShadow: "0 4px 16px rgba(37, 103, 30, 0.08)",
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: isActive ? "#25671E" : "transparent",
                    color: isActive ? "white" : "#25671E",
                  }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {children}
      </div>
    </>
  );
}
