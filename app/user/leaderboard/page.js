"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useInView } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const UPLOAD_DATA = [
  { rank: 1,  name: "Arjun Sharma",   college: "IIT Bombay",         avatar: "AS", papers: 142, coins: 1420, badge: "Legend",      streak: 30 },
  { rank: 2,  name: "Priya Nair",     college: "BITS Pilani",         avatar: "PN", papers: 118, coins: 1180, badge: "Elite",       streak: 21 },
  { rank: 3,  name: "Rohan Mehta",    college: "NIT Trichy",          avatar: "RM", papers: 97,  coins: 970,  badge: "Elite",       streak: 14 },
  { rank: 4,  name: "Sneha Joshi",    college: "VIT Vellore",         avatar: "SJ", papers: 84,  coins: 840,  badge: "Pro",         streak: 10 },
  { rank: 5,  name: "Karan Patel",    college: "COEP Pune",           avatar: "KP", papers: 71,  coins: 710,  badge: "Pro",         streak: 7  },
  { rank: 6,  name: "Divya Reddy",    college: "Anna University",     avatar: "DR", papers: 63,  coins: 630,  badge: "Active",      streak: 5  },
  { rank: 7,  name: "Amit Verma",     college: "DTU Delhi",           avatar: "AV", papers: 58,  coins: 580,  badge: "Active",      streak: 4  },
  { rank: 8,  name: "Neha Singh",     college: "RVCE Bangalore",      avatar: "NS", papers: 52,  coins: 520,  badge: "Active",      streak: 3  },
  { rank: 9,  name: "Vikram Das",     college: "SRM Chennai",         avatar: "VD", papers: 47,  coins: 470,  badge: "Active",      streak: 2  },
  { rank: 10, name: "Aisha Khan",     college: "Jamia Millia",        avatar: "AK", papers: 41,  coins: 410,  badge: "Contributor", streak: 1  },
];

const SAVE_DATA = [
  { rank: 1,  name: "Meera Iyer",     college: "IISc Bangalore",      avatar: "MI", papers: 312, coins: 890,  badge: "Legend",      streak: 45 },
  { rank: 2,  name: "Dev Malhotra",   college: "IIT Delhi",           avatar: "DM", papers: 278, coins: 730,  badge: "Elite",       streak: 33 },
  { rank: 3,  name: "Tanvi Kulkarni", college: "COEP Pune",           avatar: "TK", papers: 241, coins: 610,  badge: "Elite",       streak: 28 },
  { rank: 4,  name: "Siddharth Rao",  college: "Manipal University",  avatar: "SR", papers: 205, coins: 540,  badge: "Pro",         streak: 19 },
  { rank: 5,  name: "Pooja Pillai",   college: "PSG Tech",            avatar: "PP", papers: 187, coins: 490,  badge: "Pro",         streak: 15 },
  { rank: 6,  name: "Rahul Gupta",    college: "NSIT Delhi",          avatar: "RG", papers: 163, coins: 420,  badge: "Active",      streak: 11 },
  { rank: 7,  name: "Ananya Bose",    college: "Jadavpur University", avatar: "AB", papers: 148, coins: 370,  badge: "Active",      streak: 8  },
  { rank: 8,  name: "Chirag Shah",    college: "GEC Ahmedabad",       avatar: "CS", papers: 132, coins: 310,  badge: "Active",      streak: 6  },
  { rank: 9,  name: "Lakshmi Venkat", college: "NIT Warangal",        avatar: "LV", papers: 114, coins: 260,  badge: "Contributor", streak: 4  },
  { rank: 10, name: "Harsh Tiwari",   college: "BIT Mesra",           avatar: "HT", papers: 98,  coins: 220,  badge: "Contributor", streak: 2  },
];

const ME = { rank: 23, name: "Alex", college: "COEP Pune", avatar: "AX", papers: 18, coins: 91, badge: "Rising", streak: 3 };

// ─── Badge config ──────────────────────────────────────────────────────────────
const BADGE = {
  Legend:      { classes: "bg-amber-50 text-amber-800 border-amber-300",   icon: "👑" },
  Elite:       { classes: "bg-violet-50 text-violet-800 border-violet-300", icon: "⚡" },
  Pro:         { classes: "bg-blue-50 text-blue-800 border-blue-300",       icon: "🔥" },
  Active:      { classes: "bg-green-50 text-green-800 border-green-300",    icon: "✅" },
  Contributor: { classes: "bg-gray-50 text-gray-700 border-gray-300",       icon: "📄" },
  Rising:      { classes: "bg-orange-50 text-orange-800 border-orange-300", icon: "🚀" },
};

// Podium glow / ring per rank
const PODIUM_STYLE = {
  1: { ring: "ring-yellow-400",  glow: "shadow-yellow-200/60",  numColor: "text-yellow-600", medal: "🥇", size: "w-24 h-24", text: "text-2xl", mt: "mt-0"  },
  2: { ring: "ring-gray-400",   glow: "shadow-gray-200/40",   numColor: "text-gray-500",   medal: "🥈", size: "w-20 h-20", text: "text-lg",  mt: "mt-7"  },
  3: { ring: "ring-amber-600",  glow: "shadow-amber-200/40",  numColor: "text-amber-600",  medal: "🥉", size: "w-20 h-20", text: "text-lg",  mt: "mt-7"  },
};

const ROW_RING = { 1: "ring-yellow-400", 2: "ring-gray-400", 3: "ring-amber-600" };

const AVATAR_BG = [
  "bg-green-900", "bg-cyan-900", "bg-blue-900",
  "bg-purple-900","bg-emerald-900","bg-red-900",
  "bg-teal-900",  "bg-violet-900",
];
const avBg = (name) => AVATAR_BG[name.charCodeAt(0) % AVATAR_BG.length];

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const step = Math.ceil(end / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// ─── Podium card ─────────────────────────────────────────────────────────────
function PodiumCard({ user, tab }) {
  const p = PODIUM_STYLE[user.rank];
  const b = BADGE[user.badge];
  const val = tab === "uploads" ? `${user.papers} papers` : `${user.papers} saved`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: user.rank * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center ${p.mt}`}
    >
      <motion.span
        className="text-4xl mb-2 select-none"
        animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
        transition={{ delay: user.rank * 0.2 + 0.6, duration: 0.5 }}
      >
        {p.medal}
      </motion.span>

      <motion.div
        whileHover={{ scale: 1.08 }}
        className={`
          ${p.size} rounded-full ${avBg(user.name)} text-white
          flex items-center justify-content-center justify-center
          font-bold ${p.text}
          ring-4 ${p.ring} shadow-2xl ${p.glow}
          transition-all duration-300
        `}
      >
        {user.avatar}
      </motion.div>

      <div className="mt-3 text-center">
        <p className="font-bold text-gray-900 text-sm">{user.name.split(" ")[0]}</p>
        <p className="text-gray-400 text-xs mt-0.5">{user.college.split(" ")[0]}</p>
        <p className={`font-bold text-sm mt-1.5 ${p.numColor}`}>{val}</p>
        <span className={`inline-flex items-center gap-1 mt-2 px-3 py-0.5 rounded-full border text-xs font-semibold ${b.classes}`}>
          {b.icon} {user.badge}
        </span>
      </div>
    </motion.div>
  );
}

// ─── List row ─────────────────────────────────────────────────────────────────
function Row({ user, tab, i, me }) {
  const b = BADGE[user.badge] ?? BADGE.Contributor;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
      className={`
        flex items-center gap-3 px-5 py-3 rounded-2xl border
        transition-all duration-200 cursor-default
        ${me
          ? "border-green-300 bg-green-50 shadow-md shadow-green-100"
          : "border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200"
        }
      `}
    >
      {/* Rank */}
      <div className={`w-8 shrink-0 text-center font-bold text-sm
        ${PODIUM_STYLE[user.rank]?.numColor ?? "text-gray-500"}`}>
        {user.rank <= 3 ? PODIUM_STYLE[user.rank].medal : `#${user.rank}`}
      </div>

      {/* Avatar */}
      <div className={`
        w-10 h-10 rounded-full shrink-0 ${avBg(user.name)} text-white
        flex items-center justify-center font-bold text-xs
        ring-2 ${ROW_RING[user.rank] ?? "ring-transparent"}
      `}>
        {user.avatar}
      </div>

      {/* Name / College */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate ${me ? "text-green-800" : "text-gray-900"}`}>
          {user.name}
          {me && <span className="ml-1.5 font-normal text-xs text-green-600">(You)</span>}
        </p>
        <p className="text-gray-400 text-xs truncate mt-0.5">{user.college}</p>
      </div>

      {/* Badge */}
      <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0 ${b.classes}`}>
        {b.icon} {user.badge}
      </span>

      {/* Streak */}
      <div className="text-center shrink-0 hidden md:block min-w-[52px]">
        <p className="text-gray-400 text-[10px]">Streak</p>
        <p className="font-bold text-sm text-orange-500">🔥{user.streak}d</p>
      </div>

      {/* Coins */}
      <div className="text-center shrink-0 min-w-[58px]">
        <p className="text-gray-400 text-[10px]">Coins</p>
        <p className="font-bold text-sm text-amber-600">🪙{user.coins}</p>
      </div>

      {/* Metric */}
      <div className="text-right shrink-0 min-w-[52px]">
        <p className="font-extrabold text-xl text-green-800">
          <AnimatedNumber value={user.papers} />
        </p>
        <p className="text-[10px] text-gray-400">{tab === "uploads" ? "papers" : "saved"}</p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [tab, setTab]       = useState("uploads");
  const [filter, setFilter] = useState("all");
  const [ready, setReady]   = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setReady(true);
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        dur: 4 + Math.random() * 4,
        size: 4 + Math.random() * 8,
      }))
    );
  }, []);

  const data = tab === "uploads" ? UPLOAD_DATA : SAVE_DATA;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-[#f5f6f1] font-sans relative overflow-x-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-green-400/10"
            style={{ left: `${p.left}%`, width: p.size, height: p.size, bottom: -20 }}
            animate={{ y: [0, -window.innerHeight - 40], opacity: [0, 0.6, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 pt-10">

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7"
        >
          <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
            🏆 Community Rankings
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-green-950 tracking-tight leading-none mb-1">
            Leaderboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            See who's contributing the most to Vault. Upload papers, save more, climb higher.
          </p>
        </motion.div>

        {/* ── Your Rank Banner ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="
            bg-gradient-to-r from-[#1a5c1e] to-[#166534]
            rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4
            shadow-2xl shadow-green-900/30 mb-7
          "
        >
          <motion.div
            whileHover={{ rotate: 10 }}
            className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center
              font-bold text-lg text-white shrink-0 ring-2 ring-green-400"
          >
            {ME.avatar}
          </motion.div>

          <div className="flex-1 min-w-[130px]">
            <p className="text-green-300 text-xs font-semibold mb-0.5">Your Position</p>
            <p className="font-extrabold text-lg text-white">Rank #{ME.rank} — {ME.name}</p>
            <p className="text-green-400 text-xs mt-0.5">{ME.college}</p>
          </div>

          {[["Papers", ME.papers], ["Coins", `🪙${ME.coins}`], ["Streak", `🔥${ME.streak}d`]].map(([lbl, val]) => (
            <div key={lbl} className="text-center shrink-0">
              <p className="text-green-300 text-xs mb-0.5">{lbl}</p>
              <p className="font-extrabold text-xl text-white">{val}</p>
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="
              ml-auto bg-amber-400 text-amber-900
              font-bold text-xs px-5 py-2.5 rounded-xl shrink-0
              shadow-lg shadow-amber-400/30
              transition-colors hover:bg-amber-300
            "
          >
            Upload &amp; Rise ↑
          </motion.button>
        </motion.div>

        {/* ── Tab + Filter bar ───────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">

          {/* Tab switcher */}
          <div className="flex bg-white border border-gray-200 rounded-2xl p-1 shadow-sm gap-1">
            {[["uploads","📤 Upload Board"],["saves","🔖 Save Board"]].map(([k, lbl]) => (
              <motion.button
                key={k}
                onClick={() => setTab(k)}
                whileTap={{ scale: 0.96 }}
                className={`
                  relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${tab === k ? "text-white" : "text-gray-500 hover:text-gray-700"}
                `}
              >
                {tab === k && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-[#1a5c1e] rounded-xl"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                  />
                )}
                <span className="relative z-10">{lbl}</span>
              </motion.button>
            ))}
          </div>

          {/* Filter */}
          <div className="flex bg-white border border-gray-200 rounded-2xl p-1 shadow-sm gap-1">
            {[["all","All Time"],["week","This Week"],["month","This Month"]].map(([k, lbl]) => (
              <motion.button
                key={k}
                onClick={() => setFilter(k)}
                whileTap={{ scale: 0.96 }}
                className={`
                  relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200
                  ${filter === k ? "text-gray-900 bg-gray-100" : "text-gray-400 hover:text-gray-600"}
                `}
              >
                {lbl}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Podium ─────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + "-pod"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="
              bg-white rounded-3xl border border-gray-100
              shadow-lg shadow-black/5
              px-6 sm:px-10 pt-7 pb-8 mb-5
            "
          >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
              Top 3 Contributors
            </p>
            <div className="flex items-end justify-center gap-8 sm:gap-16">
              {/* 2nd – 1st – 3rd */}
              <PodiumCard user={top3[1]} tab={tab} />
              <PodiumCard user={top3[0]} tab={tab} />
              <PodiumCard user={top3[2]} tab={tab} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── List ───────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + "-list"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-2.5"
          >
            {/* Column headers */}
            <div className="hidden sm:flex items-center gap-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span className="w-8">Rank</span>
              <span className="w-10" />
              <span className="flex-1">Student</span>
              <span className="hidden sm:block min-w-[80px]">Badge</span>
              <span className="hidden md:block min-w-[52px] text-center">Streak</span>
              <span className="min-w-[58px] text-center">Coins</span>
              <span className="min-w-[52px] text-right">
                {tab === "uploads" ? "Papers" : "Saved"}
              </span>
            </div>

            {rest.map((u, i) => <Row key={u.rank} user={u} tab={tab} i={i} me={false} />)}

            {/* Separator */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 border-t-2 border-dashed border-gray-200" />
              <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap">
                Your ranking
              </span>
              <div className="flex-1 border-t-2 border-dashed border-gray-200" />
            </div>

            <Row user={ME} tab={tab} i={0} me={true} />
          </motion.div>
        </AnimatePresence>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="
            mt-8 rounded-3xl border border-green-100
            bg-gradient-to-br from-green-50 to-white
            p-6 flex flex-wrap items-center justify-between gap-6
          "
        >
          <div>
            <p className="font-extrabold text-lg text-green-950 mb-1">
              Want to climb the ranks faster?
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Upload papers, refer friends, keep your streak — every action earns coins.
            </p>
            <div className="flex flex-wrap gap-2">
              {[["📤","Upload Paper","+10 coins"],["👥","Refer Friend","+50 coins"],["🔥","Daily Streak","+5 coins"]].map(([ic, lbl, rw]) => (
                <motion.div
                  key={lbl}
                  whileHover={{ y: -2, scale: 1.03 }}
                  className="
                    flex items-center gap-1.5 bg-white border border-gray-200
                    rounded-xl px-3.5 py-2 text-xs font-medium text-gray-700
                    shadow-sm cursor-default
                  "
                >
                  {ic} {lbl}{" "}
                  <span className="font-bold text-green-700">{rw}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="
              bg-[#1a5c1e] text-white font-bold text-sm
              px-6 py-3.5 rounded-2xl shrink-0
              shadow-xl shadow-green-900/25
              hover:bg-green-800 transition-colors
            "
          >
            Upload a Paper →
          </motion.button>
        </motion.div>

        <p className="text-center text-[11px] text-gray-400 mt-7">
          Rankings update every 24 hours · Only approved papers count toward the Upload Leaderboard
        </p>
      </div>
    </div>
  );
}