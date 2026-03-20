"use client";

import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(160deg, #F7F0F0 0%, #eef5ec 60%, #F7F0F0 100%)",
      }}
    >
      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#25671E 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Card container with motion */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div
          className="rounded-2xl p-6 sm:p-10 border"
          style={{
            background: "white",
            border: "1px solid rgba(37, 103, 30, 0.15)",
            boxShadow: "0 2px 16px rgba(37, 103, 30, 0.08)",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
