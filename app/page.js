

"use client";
 
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/component/Navbar";
 
// ─── Palette ──────────────────────────────────────────────────────────────────
// #25671E  — Deep forest green  (primary dark / text)
// #48A111  — Vivid green        (accent / active states)
// #F2B50B  — Amber              (coins — untouched)
// #F7F0F0  — Warm off-white     (background base)
 
// ─── Animation Variants ──────────────────────────────────────────────────────
 
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] },
  }),
};
 
// ─── Data ─────────────────────────────────────────────────────────────────────
 
const floatingCardsSubjects = [
  "Operating Systems · Sem 5",
  "DBMS · Sem 4",
  "Digital Signal Processing · Sem 6",
  "Data Structures · Sem 3",
  "Engineering Maths II · Sem 2",
  "Computer Networks · Sem 5",
  "Microprocessors · Sem 4",
  "Compiler Design · Sem 6",
  "Web Technology · Sem 5",
  "Theory of Computation · Sem 4",
  "Software Engineering · Sem 7",
  "Probability & Statistics · Sem 3",
];
 
const paperCards = [
  { subject: "Operating Systems", university: "RGPV · CSE", meta: "Sem 5 · 2023", rating: "4.8", unlocks: "847", coins: 8 },
  { subject: "Digital Logic Design", university: "VTU · ECE", meta: "Sem 3 · 2022", rating: "4.7", unlocks: "562", coins: 8 },
  { subject: "Engineering Mechanics", university: "Mumbai University · Mech", meta: "Sem 1 · 2023", rating: "4.6", unlocks: "431", coins: 9 },
  { subject: "Concrete Technology", university: "Anna University · Civil", meta: "Sem 5 · 2021", rating: "4.9", unlocks: "305", coins: 10 },
  { subject: "Data Structures & Algorithms", university: "RGPV · CSE", meta: "Sem 3 · 2022", rating: "4.8", unlocks: "923", coins: 9 },
  { subject: "Signals & Systems", university: "VTU · ECE", meta: "Sem 4 · 2023", rating: "4.7", unlocks: "512", coins: 8 },
];
 
const leaderboardTop = [
  { name: "Priya M.", uploads: 61, position: 2 },
  { name: "Aryan S.", uploads: 84, position: 1 },
  { name: "Rahul K.", uploads: 47, position: 3 },
];
 
const leaderboardRest = [
  { rank: 4, name: "Neha T.", uploads: 39, delta: 3 },
  { rank: 5, name: "Rohan P.", uploads: 33, delta: 3 },
  { rank: 6, name: "Sana K.", uploads: 29, delta: 3 },
  { rank: 7, name: "Aditya V.", uploads: 22, delta: 3 },
  { rank: 8, name: "Ishita R.", uploads: 18, delta: 3 },
];
 
// ─── Hook ────────────────────────────────────────────────────────────────────
 
function useFloatingCardsConfig() {
  return useMemo(
    () =>
      floatingCardsSubjects.map((label, index) => {
        const column = index % 4;
        const baseX = 5 + column * 22;
        const randomOffset = (index * 13) % 10;
        return {
          label,
          x: baseX + randomOffset,
          duration: 12 + (index % 5) * 1.5,
          delay: index * 0.8,
        };
      }),
    []
  );
}
 
// ─── Sections ────────────────────────────────────────────────────────────────
 
function HeroSection({ floatingCards }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pb-24 pt-28"
      style={{ background: "linear-gradient(160deg, #F7F0F0 0%, #eef5ec 60%, #F7F0F0 100%)" }}
    >
      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#25671E 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
 
      {/* Background floating cards */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {floatingCards.map((card, index) => (
          <motion.div
            key={card.label + index}
            className="absolute w-52 rounded-xl px-4 py-3"
            style={{
              left: `${card.x}%`,
              opacity: 0.55,
              background: "rgba(247, 240, 240, 0.9)",
              border: "1px solid rgba(37, 103, 30, 0.12)",
              boxShadow: "0 2px 12px rgba(37, 103, 30, 0.06)",
            }}
            initial={{ y: 120 }}
            animate={{ y: -900 }}
            transition={{ duration: card.duration, delay: card.delay, repeat: Infinity, ease: "linear" }}
          >
            <p className="text-xs font-semibold truncate" style={{ color: "#25671E" }}>
              {card.label.split("·")[0]}
            </p>
            <p className="mt-1 text-[11px]" style={{ color: "#48A111", opacity: 0.8 }}>
              {card.label.split("·")[1]?.trim()}
            </p>
          </motion.div>
        ))}
      </div>
 
      {/* Foreground content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-10 w-full">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-medium shadow-sm"
            style={{
              background: "rgba(72, 161, 17, 0.1)",
              border: "1px solid rgba(72, 161, 17, 0.3)",
              color: "#25671E",
            }}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span>🎓</span>
            <span className="uppercase tracking-wide">Built for Indian College Students</span>
          </motion.div>
 
          {/* Heading */}
          <motion.h1
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ color: "#25671E" }}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <span className="block">Every Exam Paper.</span>
            <span
              className="block mt-1"
              style={{
                background: "linear-gradient(135deg, #48A111 0%, #25671E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Right Here.
            </span>
          </motion.h1>
 
          {/* Subtext */}
          <motion.p
            className="mt-5 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "#25671E", opacity: 0.65 }}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            Community-uploaded. AI-enhanced. Coin-unlocked. Access previous year papers from your college
            instantly — so you revise what actually appears in the exam.
          </motion.p>
 
          {/* CTA buttons */}
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            <button
              className="inline-flex items-center rounded-full px-8 py-4 text-sm sm:text-base font-semibold text-white transition-all hover:-translate-y-0.5 active:scale-95"
              style={{
                background: "#25671E",
                boxShadow: "0 8px 24px rgba(37, 103, 30, 0.35)",
              }}
            >
              Get 100 Free Coins →
            </button>
            <button
              className="inline-flex items-center rounded-full px-8 py-4 text-sm sm:text-base font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: "#FAF6EF",
                border: "1.5px solid rgba(37, 103, 30, 0.25)",
                color: "#25671E",
                boxShadow: "0 2px 10px rgba(37, 103, 30, 0.08)",
              }}
            >
              Browse Papers
            </button>
          </motion.div>
 
          {/* Trust badges */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            {["⭐ 10,000+ Papers", "🎓 200+ Colleges", "🔐 UGC Compliant"].map((badge) => (
              <span
                key={badge}
                className="rounded-full px-4 py-1.5"
                style={{
                  background: "white",
                  border: "1px solid rgba(37, 103, 30, 0.15)",
                  color: "#25671E",
                  opacity: 0.85,
                  boxShadow: "0 1px 4px rgba(37, 103, 30, 0.06)",
                }}
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
 
function HowItWorksSection() {
  const cards = [
    { icon: "🔍", title: "Search Your Paper", body: "Filter by university, course, semester, and year. Find exactly what you need in seconds." },
    { icon: "🪙", title: "Spend Coins to Unlock", body: "Each paper costs just 8–10 coins. Start with 100 free coins — no credit card needed." },
    { icon: "📖", title: "Study Offline", body: "Papers are cached locally on your device. Read anytime, anywhere, no internet needed." },
  ];
 
  return (
    <section id="how-it-works" className="px-4 sm:px-6 lg:px-10 py-20 lg:py-24" style={{ background: "#F7F0F0" }}>
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-semibold"
          style={{ color: "#25671E" }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
        >
          How Vault Works
        </motion.h2>
        <motion.p
          className="mt-3"
          style={{ color: "#25671E", opacity: 0.55 }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0.1}
        >
          Three steps. Zero friction.
        </motion.p>
      </div>
 
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            className="relative rounded-2xl p-7 sm:p-8 transition-all duration-200 hover:-translate-y-1"
            style={{
              background: "white",
              border: "1px solid rgba(37, 103, 30, 0.12)",
              boxShadow: "0 2px 16px rgba(37, 103, 30, 0.06)",
            }}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0.1 + index * 0.1}
          >
            {index < cards.length - 1 && (
              <div className="pointer-events-none absolute inset-y-8 right-[-32px] hidden w-16 items-center justify-center md:flex">
                <div
                  className="h-px w-full"
                  style={{ background: "linear-gradient(90deg, rgba(72,161,17,0.1), rgba(72,161,17,0.5), rgba(72,161,17,0.1))" }}
                />
              </div>
            )}
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: "rgba(72, 161, 17, 0.1)", border: "1px solid rgba(72, 161, 17, 0.2)" }}
            >
              <span className="text-xl">{card.icon}</span>
            </div>
            <h3 className="text-lg font-semibold" style={{ color: "#25671E" }}>{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "#25671E", opacity: 0.6 }}>{card.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
 
function LibrarySection() {
  const filters1 = ["All", "RGPV", "VTU", "Mumbai Uni", "Anna Uni"];
  const filters2 = ["CSE", "ECE", "Mech", "Civil"];
 
  return (
    <section id="library" className="px-4 sm:px-6 lg:px-10 py-20 lg:py-24" style={{ background: "white" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold" style={{ color: "#25671E" }}>Browse the Library</h2>
          <p className="mt-3" style={{ color: "#25671E", opacity: 0.55 }}>Tap any paper to preview — unlock with coins.</p>
        </motion.div>
 
        {/* Filter chips */}
        <motion.div
          className="mt-8 flex flex-wrap gap-2 text-xs sm:text-sm"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0.1}
        >
          {filters1.map((label, index) => (
            <button
              key={label}
              className="rounded-full px-3 py-1.5 font-medium transition-all"
              style={
                index === 0
                  ? { background: "#48A111", color: "white", border: "1px solid transparent", boxShadow: "0 2px 10px rgba(72,161,17,0.35)" }
                  : { background: "white", color: "#25671E", border: "1px solid rgba(37, 103, 30, 0.18)", opacity: 0.75 }
              }
            >
              {label}
            </button>
          ))}
          {filters2.map((label) => (
            <button
              key={label}
              className="rounded-full px-3 py-1.5 font-medium transition-all"
              style={{ background: "white", color: "#25671E", border: "1px solid rgba(37, 103, 30, 0.18)", opacity: 0.75 }}
            >
              {label}
            </button>
          ))}
        </motion.div>
 
        {/* Paper grid */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {paperCards.map((paper, index) => (
            <motion.article
              key={paper.subject + paper.university}
              className="group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1"
              style={{
                border: "1px solid rgba(37, 103, 30, 0.12)",
                background: "#F7F0F0",
                boxShadow: "0 2px 12px rgba(37, 103, 30, 0.05)",
              }}
              variants={fadeInUp}
              custom={0.1 + index * 0.05}
            >
              {/* Card header */}
              <div
                className="relative h-32"
                style={{ background: "linear-gradient(135deg, rgba(72,161,17,0.08) 0%, rgba(37,103,30,0.05) 100%)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
                    style={{
                      background: "white",
                      border: "2px solid rgba(37, 103, 30, 0.15)",
                      boxShadow: "0 2px 10px rgba(37, 103, 30, 0.08)",
                    }}
                    whileHover={{ scale: 1.06 }}
                  >
                    <span className="text-xl">🔒</span>
                  </motion.div>
                </div>
              </div>
 
              {/* Body */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold" style={{ color: "#25671E" }}>{paper.subject}</h3>
                  <p className="mt-1 text-xs" style={{ color: "#25671E", opacity: 0.5 }}>{paper.university}</p>
                  <div
                    className="mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px]"
                    style={{
                      background: "rgba(37, 103, 30, 0.07)",
                      border: "1px solid rgba(37, 103, 30, 0.12)",
                      color: "#25671E",
                    }}
                  >
                    {paper.meta}
                  </div>
                </div>
 
                {/* Footer */}
                <div className="mt-4 flex items-center justify-between text-xs sm:text-sm">
                  <span style={{ color: "#25671E", opacity: 0.5 }}>⭐ {paper.rating} · {paper.unlocks} unlocks</span>
                  <motion.button
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-all"
                    style={{ background: "#48A111", boxShadow: "0 2px 10px rgba(72,161,17,0.3)" }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <span>🪙</span>
                    <span>{paper.coins} Coins</span>
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
 
function CoinSection() {
  const rows = [
    { label: "Free on signup", value: "100 coins" },
    { label: "Per referral (you + friend)", value: "50 coins" },
    { label: "Cost per paper unlock", value: "8–10 coins" },
    { label: "To top up 100 more coins", value: "₹20 only" },
  ];
 
  const container = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };
 
  const item = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };
 
  return (
    <section className="px-4 sm:px-6 lg:px-10 py-20 lg:py-24" style={{ background: "#F7F0F0" }}>
      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-12 sm:px-10 sm:py-16"
        style={{
          background: "linear-gradient(135deg, #25671E 0%, #1a4d15 100%)",
          boxShadow: "0 20px 60px rgba(37, 103, 30, 0.3)",
        }}
      >
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr] lg:items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">The Coin Economy</h2>
            <p className="mt-3 text-sm sm:text-base max-w-lg leading-relaxed" style={{ color: "rgba(247,240,240,0.8)" }}>
              Earn coins, unlock papers, refer friends. It&apos;s the simplest currency you&apos;ve ever used —
              designed so you never have to worry about subscriptions when you just need that one paper.
            </p>
          </motion.div>
 
          <motion.div
            className="space-y-4"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {rows.map((row) => (
              <motion.div
                key={row.label}
                className="flex items-center gap-4 rounded-2xl px-4 py-3"
                style={{
                  background: "rgba(247, 240, 240, 0.1)",
                  border: "1px solid rgba(247, 240, 240, 0.15)",
                  backdropFilter: "blur(8px)",
                }}
                variants={item}
              >
                {/* Coin — untouched amber */}
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-lg leading-none flex-shrink-0"
                  style={{ background: "#F2B50B", boxShadow: "0 0 20px rgba(242,181,11,0.6)" }}
                >
                  🪙
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">{row.value}</span>
                  <span className="text-[11px]" style={{ color: "rgba(247,240,240,0.65)" }}>{row.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
 
function PremiumSection() {
  const features = [
    "AI Mock Paper Generator",
    "AI Tutor (ask anything)",
    "Pattern Analysis Dashboard",
    "Unlimited Paper Access",
    "Download Papers as Files",
  ];
 
  return (
    <section id="premium" className="px-4 sm:px-6 lg:px-10 py-20 lg:py-24" style={{ background: "white" }}>
      <motion.div
        className="mx-auto max-w-5xl rounded-3xl px-6 py-10 sm:px-10 sm:py-12"
        style={{
          background: "linear-gradient(135deg, #1a4d15 0%, #0f2e0b 100%)",
          border: "1px solid rgba(72, 161, 17, 0.2)",
          boxShadow: "0 24px 64px rgba(37, 103, 30, 0.35)",
        }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={0}
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr] lg:items-center">
          <div>
            {/* Amber badge — untouched */}
            <div
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-black"
              style={{ background: "#F2B50B", boxShadow: "0 2px 12px rgba(242,181,11,0.4)" }}
            >
              ✨ Premium
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-white">Go deeper with AI</h2>
            <p className="mt-3 text-sm sm:text-base max-w-lg leading-relaxed" style={{ color: "rgba(247,240,240,0.75)" }}>
              Mock papers. AI tutor. Pattern analysis. Everything a serious exam student needs — for less than a
              cup of chai in the campus canteen.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold text-white">₹79</span>
              <span className="text-sm" style={{ color: "rgba(247,240,240,0.5)" }}>/ month</span>
            </div>
            {/* Amber CTA — untouched */}
            <button
              className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 active:scale-95"
              style={{ background: "#F2B50B", boxShadow: "0 6px 20px rgba(242,181,11,0.45)" }}
            >
              Start Premium →
            </button>
          </div>
 
          <div
            className="space-y-3 rounded-2xl p-5 sm:p-6"
            style={{
              background: "rgba(247, 240, 240, 0.06)",
              border: "1px solid rgba(247, 240, 240, 0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 text-sm" style={{ color: "rgba(247,240,240,0.9)" }}>
                <span className="mt-0.5" style={{ color: "#48A111" }}>✅</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
 
function LeaderboardSection() {
  return (
    <section id="leaderboard" className="px-4 sm:px-6 lg:px-10 py-20 lg:py-24" style={{ background: "#F7F0F0" }}>
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold" style={{ color: "#25671E" }}>Top Contributors This Month</h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "#25671E", opacity: 0.55 }}>
            Students who upload the most high-quality papers get featured on the community board every month.
          </p>
        </motion.div>
 
        {/* Toggle */}
        <motion.div
          className="mt-6 inline-flex rounded-full p-1 text-xs sm:text-sm"
          style={{
            background: "white",
            border: "1px solid rgba(37, 103, 30, 0.15)",
            boxShadow: "0 1px 6px rgba(37, 103, 30, 0.06)",
          }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0.1}
        >
          <button
            className="rounded-full px-4 py-1.5 font-medium text-white transition-all"
            style={{ background: "#48A111", boxShadow: "0 2px 8px rgba(72,161,17,0.3)" }}
          >
            Upload Board
          </button>
          <button
            className="rounded-full px-4 py-1.5 font-medium transition-colors"
            style={{ color: "#25671E", opacity: 0.6 }}
          >
            Save Board
          </button>
        </motion.div>
 
        {/* Podium */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {leaderboardTop.map((entry, index) => (
            <motion.div
              key={entry.name}
              className="relative flex w-52 flex-col items-center rounded-3xl px-4 pb-4 pt-6"
              style={{
                height: entry.position === 1 ? "240px" : entry.position === 2 ? "210px" : "200px",
                background: "white",
                border: entry.position === 1
                  ? "1.5px solid rgba(72, 161, 17, 0.35)"
                  : "1px solid rgba(37, 103, 30, 0.12)",
                boxShadow: entry.position === 1
                  ? "0 8px 32px rgba(72, 161, 17, 0.15)"
                  : "0 4px 16px rgba(37, 103, 30, 0.06)",
              }}
              variants={fadeInUp}
              custom={0.1 + index * 0.1}
            >
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "rgba(72, 161, 17, 0.08)", border: "2px solid rgba(37, 103, 30, 0.18)" }}
              >
                <span className="text-lg font-semibold" style={{ color: "#25671E" }}>{entry.name[0]}</span>
                {entry.position === 1 && <span className="absolute -top-3 text-xl">👑</span>}
              </div>
              <div className="relative mt-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#48A111" }}>
                #{entry.position}
              </div>
              <div className="relative mt-1 text-sm font-semibold" style={{ color: "#25671E" }}>{entry.name}</div>
              <div className="relative mt-1 text-xs" style={{ color: "#25671E", opacity: 0.5 }}>{entry.uploads} uploads</div>
            </motion.div>
          ))}
        </motion.div>
 
        {/* Ranks 4–8 */}
        <motion.div
          className="mt-8 space-y-2 rounded-2xl p-4 sm:p-5"
          style={{
            background: "white",
            border: "1px solid rgba(37, 103, 30, 0.1)",
            boxShadow: "0 2px 12px rgba(37, 103, 30, 0.04)",
          }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0.2}
        >
          {leaderboardRest.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs sm:text-sm"
              style={{ background: "#F7F0F0" }}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 tabular-nums" style={{ color: "#25671E", opacity: 0.45 }}>{entry.rank}</span>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold"
                  style={{ background: "rgba(72,161,17,0.1)", color: "#25671E" }}
                >
                  {entry.name[0]}
                </div>
                <span className="font-medium" style={{ color: "#25671E" }}>{entry.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: "#25671E", opacity: 0.45 }}>{entry.uploads} uploads</span>
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: "rgba(72, 161, 17, 0.1)",
                    border: "1px solid rgba(72,161,17,0.25)",
                    color: "#48A111",
                  }}
                >
                  ↑{entry.delta}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
 
        <motion.div
          className="mt-5 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0.3}
        >
          <button className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: "#48A111" }}>
            View Full Leaderboard →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
 
function CTABanner() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 py-20 lg:py-24" style={{ background: "white" }}>
      <motion.div
        className="mx-auto max-w-3xl text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={0}
      >
        <h2 className="text-3xl sm:text-4xl font-semibold" style={{ color: "#25671E" }}>
          Your next exam paper is one search away.
        </h2>
        <p className="mt-3" style={{ color: "#25671E", opacity: 0.55 }}>
          Join 10,000+ students already revising with Vault instead of guessing the pattern the night before.
        </p>
        <motion.button
          className="mt-8 inline-flex items-center rounded-full px-10 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-semibold text-white transition-all active:scale-95"
          style={{ background: "#25671E", boxShadow: "0 10px 30px rgba(37, 103, 30, 0.35)" }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          Create Free Account → Get 100 Coins
        </motion.button>
      </motion.div>
    </section>
  );
}
 
// ─── Root ─────────────────────────────────────────────────────────────────────
 
export default function Home() {
  const [coins, setCoins] = useState(0);
  const floatingCards = useFloatingCardsConfig();
 
  useEffect(() => {
    let current = 0;
    const target = 100;
    const step = 2;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      setCoins(current);
    }, 30);
    return () => clearInterval(interval);
  }, []);
 
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F0F0", color: "#25671E" }}>
      <Navbar coins={coins} />
      <main className="flex-1">
        <HeroSection floatingCards={floatingCards} />
        <HowItWorksSection />
        <LibrarySection />
        <CoinSection />
        <PremiumSection />
        <LeaderboardSection />
        <CTABanner />
      </main>
    </div>
  );
}


