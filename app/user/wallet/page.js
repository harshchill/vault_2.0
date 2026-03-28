"use client";

import { useState, useRef } from "react";

// ── SVG Icons ──────────────────────────────────────────────────────────────
const CoinIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="#f59e0b" />
    <circle cx="12" cy="12" r="8" fill="#fbbf24" />
    <circle cx="12" cy="12" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="0.5" />
    <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#92400e">V</text>
  </svg>
);

const ArrowUpIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDownIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GiftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M12 11V22M3 7h18v4H3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 7c0 0-2-5 2-5s2 5 2 5M12 7c0 0 2-5-2-5s-2 5-2 5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShareIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ── Toast ──────────────────────────────────────────────────────────────────
const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-medium animate-slide-in"
        style={{
          background: t.type === "success" ? "#f0fdf4" : t.type === "error" ? "#fef2f2" : "#f0f9ff",
          border: `1px solid ${t.type === "success" ? "#bbf7d0" : t.type === "error" ? "#fecaca" : "#bae6fd"}`,
          color: t.type === "success" ? "#166534" : t.type === "error" ? "#991b1b" : "#0369a1",
        }}
      >
        <span className="text-base">{t.icon}</span>
        <span>{t.message}</span>
        <button onClick={() => removeToast(t.id)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
          <CloseIcon />
        </button>
      </div>
    ))}
  </div>
);

// ── Data ───────────────────────────────────────────────────────────────────
const PACKS = [
  { coins: 100, price: 20, rate: "₹0.20/coin", label: "" },
  { coins: 200, price: 30, rate: "₹0.15/coin", label: "Best Value", popular: true },
  { coins: 500, price: 60, rate: "₹0.12/coin", label: "Max Savings" },
];

const TRANSACTIONS = [
  { id: 1, label: "Referral bonus — Priya joined", sub: "Today, 2:14 PM", amount: +50, type: "referral" },
  { id: 2, label: "Unlocked DBMS End Sem 2022", sub: "Yesterday", amount: -10, type: "unlock" },
  { id: 3, label: "Coin top-up — ₹30 pack", sub: "3 days ago", amount: +200, type: "topup" },
  { id: 4, label: "Unlocked OS Mid Sem 2023", sub: "4 days ago", amount: -8, type: "unlock" },
  { id: 5, label: "Upload reward — Networks Paper", sub: "6 days ago", amount: +30, type: "upload" },
  { id: 6, label: "Signup bonus", sub: "14 days ago", amount: +100, type: "bonus" },
];

const WAYS_TO_EARN = [
  { icon: <UploadIcon />, title: "Upload Papers", desc: "Earn 20–50 coins per approved paper", reward: "+20–50", color: "neutral" },
  { icon: <ShareIcon />, title: "Refer Friends", desc: "Both you & friend get 50 coins each", reward: "+50", color: "neutral" },
  { icon: <StarIcon />, title: "Daily Login", desc: "Streak bonuses up to 10 coins/day", reward: "+2–10", color: "neutral" },
  { icon: <GiftIcon />, title: "Signup Bonus", desc: "One-time welcome gift for new users", reward: "+100", color: "neutral" },
];

const PREMIUM_PERKS = [
  "AI Mock Paper Generator",
  "Unlimited paper unlocks",
  "Pattern Analysis Dashboard",
  "In-app AI Tutor",
  "Download papers as files",
  "Ad-free experience",
];

const EARN_STYLE = {
  bg: "#f5f5f0",
  color: "#7a7a6e",
  border: "#e8e6de",
  badge: "#eaf0eb",
  badgeText: "#1a4731",
};

// ── Main ───────────────────────────────────────────────────────────────────
export default function VaultWallet() {
  const [balance] = useState(214);
  const [coins, setCoins] = useState(340);
  const [toasts, setToasts] = useState([]);
  const [buying, setBuying] = useState(null);
  const [selectedPack, setSelectedPack] = useState(1);
  const [showReferral, setShowReferral] = useState(false);
  const toastId = useRef(0);

  const addToast = (message, type = "success", icon = "✨") => {
    const id = ++toastId.current;
    setToasts((p) => [...p, { id, message, type, icon }]);
    setTimeout(() => removeToast(id), 4000);
  };
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const handleBuy = async (pack, idx) => {
    setBuying(idx);
    await new Promise((r) => setTimeout(r, 1200));
    setCoins((c) => c + pack.coins);
    setBuying(null);
    addToast(`+${pack.coins} coins added to your wallet!`, "success", "🪙");
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText("https://vaultapp.in/ref/S1234").catch(() => {});
    addToast("Referral link copied! Share & earn 50 coins.", "info", "🔗");
    setShowReferral(false);
  };

  const TX_STYLE = { bg: "#f5f5f0", color: "#7a7a6e", border: "#e8e6de" };

  const txIconEl = (type) => ({
    referral: <ShareIcon />,
    unlock:   <LockIcon size={17} />,
    topup:    <CoinIcon size={17} />,
    upload:   <UploadIcon />,
    bonus:    <GiftIcon />,
  }[type] || <CoinIcon size={17} />);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        @keyframes slide-in {
          from { opacity: 0; transform: translateX(24px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
        @keyframes float-coin {
          0%, 100% { transform: translateY(0)   rotate(0deg); }
          50%       { transform: translateY(-7px) rotate(5deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);    opacity: .5; }
          100% { transform: scale(1.55); opacity: 0;  }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes flamePulse {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.12); opacity: 0.85; }
        }
        @keyframes tip-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.0); }
          50%       { box-shadow: 0 0 0 6px rgba(251,191,36,0.12); }
        }

        .animate-slide-in { animation: slide-in 0.38s cubic-bezier(.22,1,.36,1) forwards; }
        .float-coin       { animation: float-coin 3s ease-in-out infinite; }
        .animate-spin     { animation: spin 0.9s linear infinite; }

        .shimmer-num {
          background: linear-gradient(90deg, #dcfce7, #22c55e, #fbbf24, #22c55e, #dcfce7);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3.5s linear infinite;
        }

        .pulse-ring { position: relative; }
        .pulse-ring::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.5);
          animation: pulse-ring 2s ease-out infinite;
        }

        .card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); transform: translateY(-1px); }

        .pack-card { transition: all 0.18s ease; cursor: pointer; }
        .pack-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.07); }
        .pack-selected { border-color: #22c55e !important; background: #f0fdf4 !important; }

        .btn { transition: all 0.17s ease; }
        .btn:hover { filter: brightness(1.05); }
        .btn:active { transform: scale(0.98); }

        .tx-row { transition: background 0.14s ease; border-radius: 14px; }
        .tx-row:hover { background: #f5f5f0; }

        .earn-row { transition: background 0.15s ease, border-color 0.15s ease; border-radius: 14px; }

        .tip-banner { animation: tip-glow 3s ease-in-out infinite; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
      `}</style>

      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Referral Modal */}
      {showReferral && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ background: "rgba(15,20,15,0.3)", backdropFilter: "blur(5px)" }}
          onClick={() => setShowReferral(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 w-full max-w-md"
            style={{ border: "1px solid #e5e7eb", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-semibold text-lg">Refer & Earn</h3>
              <button onClick={() => setShowReferral(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <CloseIcon />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎁</div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Share your link. When a friend joins,{" "}
                <span className="font-semibold text-green-700">both of you get 50 coins</span> instantly.
              </p>
            </div>
            <div className="rounded-2xl p-4 flex items-center gap-3 mb-4" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
              <span className="text-gray-500 text-sm flex-1 truncate">https://vaultapp.in/ref/S1234</span>
              <button
                onClick={handleCopyReferral}
                className="btn px-4 py-1.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#1a4731" }}
              >
                Copy
              </button>
            </div>
            <p className="text-gray-400 text-xs text-center">Referral bonus credited after friend's first login ✓</p>
          </div>
        </div>
      )}

      {/* ── Page ─────────────────────────────────────────────────────────── */}
      <div className="min-h-screen w-full bg-[#FAF9F6] pb-2 md:px-2 py-5">

        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="mb-8">
            <h1 className="text-gray-900 text-2xl font-semibold tracking-tight">Coin Wallet</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage your coins, top up, and track your activity</p>
          </div>

          <div className="grid grid-cols-12 gap-6">

            {/* ── LEFT (8) ─────────────────────────────────────────────── */}
            <div className="col-span-8 flex flex-col gap-5">

              {/* Balance Hero */}
              <div
                className="rounded-3xl p-8 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #1a4731 0%, #14532d 60%, #166534 100%)",
                  boxShadow: "0 12px 40px rgba(22,101,52,0.2)",
                }}
              >
                <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="absolute top-8 right-36 w-16 h-16 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-green-200/60 text-xs uppercase tracking-widest font-medium mb-3">Your Balance</p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="pulse-ring float-coin">
                        <CoinIcon size={50} />
                      </div>
                      <div>
                        <div className="shimmer-num text-6xl font-bold leading-none tracking-tight">
                          {coins.toLocaleString()}
                        </div>
                        <p className="text-green-200/50 text-xs mt-1.5">{Math.floor(coins / 10)} papers unlockable at ~10 coins</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowReferral(true)}
                        className="btn flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white"
                        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(8px)" }}
                      >
                        <ShareIcon /> Refer & Earn +50
                      </button>
                      <button
                        onClick={() => { setCoins(c => c + 5); addToast("Daily login bonus! +5 coins earned.", "success", "🔥"); }}
                        className="btn flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold"
                        style={{ background: "#22c55e", color: "#052e16" }}
                      >
                        <ZapIcon /> Daily Bonus
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 shrink-0">
                    <div
                      className="rounded-2xl px-5 py-4 text-center min-w-[112px]"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.14)" }}
                    >
                      <p className="text-green-200/55 text-xs mb-0.5">Papers left</p>
                      <p className="text-white text-3xl font-bold">{Math.floor(coins / 10)}</p>
                      <p className="text-green-200/40 text-[10px]">at ~10 coins each</p>
                    </div>
                    <div
                      className="rounded-2xl px-5 py-3 text-center"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <p className="text-green-200/55 text-xs mb-0.5">Upload a paper</p>
                      <p className="text-amber-300 text-sm font-semibold">earn +20–50 coins</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Up */}
              <div className="card rounded-3xl p-7 bg-white" style={{ border: "1px solid #e8ebe4" }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-gray-900 font-semibold text-lg">Top Up Coins</h2>
                    <p className="text-gray-400 text-sm mt-0.5">Instant credit · Secure payments via Razorpay</p>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
                    Secure & Live
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                  {PACKS.map((pack, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPack(idx)}
                      className={`pack-card rounded-2xl p-5 relative ${selectedPack === idx ? "pack-selected" : ""}`}
                      style={{
                        border: selectedPack === idx ? "2px solid #22c55e" : "1.5px solid #e5e7eb",
                        background: selectedPack === idx ? "#f0fdf4" : "#fafafa",
                      }}
                    >
                      {pack.label && (
                        <span
                          className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-0.5 rounded-full whitespace-nowrap text-white"
                          style={{ background: pack.popular ? "#1a4731" : "#f59e0b" }}
                        >
                          {pack.label}
                        </span>
                      )}
                      <div className="text-center pt-1">
                        <div className="flex justify-center mb-2"><CoinIcon size={30} /></div>
                        <div className="text-gray-900 text-2xl font-bold">{pack.coins}</div>
                        <div className="text-gray-400 text-xs mb-2">coins</div>
                        <div className="text-green-800 text-xl font-bold">₹{pack.price}</div>
                        <div className="text-gray-400 text-xs mt-1">{pack.rate}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleBuy(PACKS[selectedPack], selectedPack)}
                  disabled={buying !== null}
                  className="btn w-full py-3.5 rounded-2xl font-semibold text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "#1a4731" }}
                >
                  {buying !== null ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    `Buy ${PACKS[selectedPack].coins} Coins for ₹${PACKS[selectedPack].price} →`
                  )}
                </button>
              </div>

              {/* ── Transaction History ───────────────────────────────── */}
              <div className="card rounded-3xl p-7 bg-white" style={{ border: "1px solid #e8ebe4" }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-gray-900 font-semibold text-lg">Transaction History</h2>
                  <span
                    className="text-gray-400 text-xs px-3 py-1 rounded-full"
                    style={{ background: "#f5f5f0", border: "1px solid #e8e6de" }}
                  >
                    Last 30 days
                  </span>
                </div>
                <div className="flex flex-col">
                  {TRANSACTIONS.map((tx, i) => (
                    <div
                      key={tx.id}
                      className="tx-row flex items-center gap-4 p-3.5"
                      style={{
                        borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid #f0efe8" : "none",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: TX_STYLE.bg,
                          color: TX_STYLE.color,
                          border: `1px solid ${TX_STYLE.border}`,
                        }}
                      >
                        {txIconEl(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 text-sm font-medium truncate">{tx.label}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{tx.sub}</p>
                      </div>
                      <div
                        className="flex items-center gap-1 font-semibold text-sm"
                        style={{ color: tx.amount > 0 ? "#166534" : "#9a3412" }}
                      >
                        {tx.amount > 0 ? <ArrowUpIcon size={13} /> : <ArrowDownIcon size={13} />}
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT (4) ────────────────────────────────────────────── */}
            <div className="col-span-4 flex flex-col gap-5">

              {/* Premium Card */}
              <div
                className="card rounded-3xl p-6 relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 55%, #3730a3 100%)",
                  boxShadow: "0 10px 32px rgba(49,46,129,0.25)",
                }}
              >
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="absolute -bottom-6 left-4 w-24 h-24 rounded-full" style={{ background: "rgba(251,191,36,0.1)" }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1" style={{ color: "#c4b5fd" }}>
                    <ShieldIcon />
                    <span className="text-purple-200 font-semibold text-sm">Vault Premium</span>
                  </div>
                  <p className="text-purple-300/55 text-xs mb-5">Everything you need to ace your exams</p>
                  <div className="flex items-end gap-1 mb-5">
                    <span className="text-white text-4xl font-bold">₹79</span>
                    <span className="text-purple-300/55 text-sm mb-1.5">/month</span>
                  </div>
                  <div className="flex flex-col gap-2.5 mb-6">
                    {PREMIUM_PERKS.map((perk) => (
                      <div key={perk} className="flex items-center gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "rgba(196,181,253,0.2)", color: "#c4b5fd" }}
                        >
                          <CheckIcon />
                        </div>
                        <span className="text-purple-100/80 text-sm">{perk}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addToast("Redirecting to premium checkout…", "info", "👑")}
                    className="btn w-full py-3 rounded-2xl text-sm font-semibold text-white"
                    style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)" }}
                  >
                    Upgrade to Premium →
                  </button>
                  <p className="text-purple-300/35 text-xs text-center mt-3">Cancel anytime · No hidden fees</p>
                </div>
              </div>

              {/* ── Ways to Earn ──────────────────────────────────────── */}
              <div className="card rounded-3xl p-6 bg-white" style={{ border: "1px solid #e8ebe4" }}>
                <h2 className="text-gray-900 font-semibold mb-0.5">Ways to Earn</h2>
                <p className="text-gray-400 text-xs mb-5">More uploads = more coins, always</p>
                <div className="flex flex-col gap-2">
                  {WAYS_TO_EARN.map((w) => (
                    <div
                      key={w.title}
                      className="earn-row flex items-center gap-3 p-3 cursor-pointer"
                      style={{ background: "#f9faf8", border: "1px solid #f0efea" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#edf3ee";
                        e.currentTarget.style.borderColor = "#c8deca";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "#f9faf8";
                        e.currentTarget.style.borderColor = "#f0efea";
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: EARN_STYLE.bg,
                          color: EARN_STYLE.color,
                          border: `1px solid ${EARN_STYLE.border}`,
                        }}
                      >
                        {w.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 text-sm font-medium">{w.title}</p>
                        <p className="text-gray-400 text-xs truncate">{w.desc}</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-xl whitespace-nowrap"
                        style={{ background: EARN_STYLE.badge, color: EARN_STYLE.badgeText }}
                      >
                        {w.reward}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Upload Streak — Condensed ─────────────────────────── */}
              <div className="card rounded-3xl bg-white overflow-hidden" style={{ border: "1px solid #e8ebe4" }}>
                <div
                  className="px-6 py-5 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #1a4731 0%, #14532d 100%)" }}
                >
                  <div style={{ position: "absolute", top: -30, right: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ fontSize: 18, animation: "flamePulse 2s ease-in-out infinite", display: "inline-block" }}>🔥</span>
                        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>Upload Streak</h2>
                        <span style={{ fontSize: 11, background: "rgba(251,191,36,0.2)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 20, padding: "1px 8px", fontWeight: 700 }}>4 days</span>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                        3 more days → unlock <strong style={{ color: "#fbbf24" }}>+50 bonus coins</strong>
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1, margin: 0 }}>+120</p>
                      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, margin: "2px 0 0" }}>coins this week</p>
                    </div>
                  </div>

                  {/* Mini 7-day dot row */}
                  <div style={{ display: "flex", gap: 5, marginTop: 14 }}>
                    {[
                      { done: true }, { done: true }, { done: true }, { done: true },
                      { today: true }, { done: false }, { done: false },
                    ].map((d, i) => (
                      <div key={i} style={{
                        flex: 1, height: 6, borderRadius: 99,
                        background: d.done ? "#22c55e" : d.today ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.12)",
                        border: d.today ? "1px solid rgba(251,191,36,0.6)" : "none",
                      }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                    {["M","T","W","T","F","S","S"].map((d, i) => (
                      <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 8, fontWeight: 700, color: i < 4 ? "#22c55e" : i === 4 ? "#fbbf24" : "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>{d}</span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "14px 20px 16px" }}>
                  <button
                    onClick={() => addToast("Opening upload page…", "info", "📤")}
                    className="btn"
                    style={{
                      width: "100%", padding: "11px 0", borderRadius: 12,
                      fontSize: 13, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: "#1a4731", color: "#fff", border: "none", cursor: "pointer",
                    }}
                  >
                    <UploadIcon /> Upload Today — Keep the Streak
                  </button>
                </div>
              </div>

              {/* ── Attractive tip banner ─────────────────────────────── */}
              <div
                className="tip-banner rounded-2xl px-5 py-4 flex items-center gap-4"
                style={{
                  background: "linear-gradient(135deg, #fffbeb 0%, #fef9ee 100%)",
                  border: "1.5px solid #fde68a",
                }}
              >
                <span style={{ fontSize: 26, flexShrink: 0 }}>🚀</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#78350f", margin: "0 0 2px" }}>
                    {balance} coins = {Math.floor(balance / 9)} papers ready to unlock
                  </p>
                  <p style={{ fontSize: 11, color: "#92400e", margin: 0, lineHeight: 1.5 }}>
                    That's a full revision set — <span style={{ fontWeight: 600 }}>start unlocking before your exam week hits.</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
    