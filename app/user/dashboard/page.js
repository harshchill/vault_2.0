

'use client'
 
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Play, Pause, RotateCcw } from 'lucide-react'
 
// Animations
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
}
const slideLeft = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}
const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } }
}
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } }
}
 
// Count-up hook
function useCountUp(target, duration = 1200) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const step = target / (duration / 16)
        const t = setInterval(() => {
            start += step
            if (start >= target) {
                setCount(target)
                clearInterval(t)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(t)
    }, [target])
    return count
}
 
// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '8px 12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            fontSize: 12
        }}>
            <div style={{ fontWeight: 500, marginBottom: 4, color: '#111' }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color, fontWeight: 500 }}>
                    {p.name}: {p.value}
                </div>
            ))}
        </div>
    )
}
 
// Data
const barData = [
    { month: 'Aug', approved: 5, pending: 2 },
    { month: 'Sep', approved: 8, pending: 1 },
    { month: 'Oct', approved: 6, pending: 3 },
    { month: 'Nov', approved: 10, pending: 0 },
    { month: 'Dec', approved: 7, pending: 2 },
    { month: 'Jan', approved: 9, pending: 1 },
    { month: 'Feb', approved: 4, pending: 3 },
    { month: 'Mar', approved: 11, pending: 0 }
]
 
const pieData = [
    { name: 'Unlocked', value: 47, color: '#2d6a2d' },
    { name: 'Pending', value: 15, color: '#a8d5a2' },
    { name: 'Locked', value: 38, color: '#e2e8f0' }
]
 
const leaderboard = [
    { name: 'Alice Johnson', university: 'MIT', uploads: 23, status: 'Completed', progress: 100 },
    { name: 'Bob Smith', university: 'Stanford', uploads: 18, status: 'In Progress', progress: 75 },
    { name: 'Charlie Brown', university: 'Harvard', uploads: 15, status: 'Completed', progress: 100 },
    { name: 'Diana Prince', university: 'CalTech', uploads: 12, status: 'In Progress', progress: 60 }
]
 
const savedPapers = [
    { name: 'Advanced Calculus Exam', semester: 'Fall 2023', color: 'bg-amber-400' },
    { name: 'Quantum Physics Midterm', semester: 'Spring 2024', color: 'bg-blue-400' },
    { name: 'Organic Chemistry Lab', semester: 'Winter 2023', color: 'bg-green-400' },
    { name: 'Data Structures Final', semester: 'Summer 2024', color: 'bg-purple-400' },
    { name: 'Linear Algebra Quiz', semester: 'Fall 2024', color: 'bg-red-400' }
]
 
const unlockPapers = [
    { subject: 'Thermodynamics', university: 'Berkeley', semester: 'Spring 2024', cost: 25 },
    { subject: 'Machine Learning', university: 'CMU', semester: 'Fall 2024', cost: 30 }
]
 
export default function Dashboard() {
    const [timerSeconds, setTimerSeconds] = useState(5048)
    const [isRunning, setIsRunning] = useState(true)
 
    useEffect(() => {
        if (!isRunning) return
        const interval = setInterval(() => {
            setTimerSeconds(prev => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [isRunning])
 
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${h}:${m}:${s}`
    }
 
    const totalPapers = useCountUp(47)
    const pending = useCountUp(2)
    const unlocked = useCountUp(12)
    const coins = useCountUp(91)
 
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })
    const studentName = "Alex"
 
    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="min-h-screen bg-gray-50"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* ── GREETING BAR ── */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                    <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 18, margin: 0, color: '#111827', letterSpacing: '-0.01em' ,padding: '0 4px'}}>
                        {greeting},{' '}
                        <span style={{ fontStyle: 'italic', fontWeight: 500, background: 'linear-gradient(100deg, #16a34a 10%, #15803d 85%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {studentName}
                        </span>
                    </h1>
                    <p style={{ margin: 0, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af' }}>{dateStr}</p>
                </div>
            </div>
 
            {/* ── STAT STRIP (mirrors .db-body 3-col) ── */}
            <div className="bg-white border-b border-gray-200 grid grid-cols-4 divide-x divide-gray-200 px-2" >
                {/* Total Papers */}
                <motion.div variants={fadeUp} className="p-5">
                    <div className="text-2xl font-bold text-gray-900">{totalPapers}</div>
                    <div className="text-xs text-gray-500 mt-1">Total Papers</div>
                    <div className="text-xs text-green-600 mt-1.5">↑ Active</div>
                </motion.div>
 
                {/* Pending */}
                <motion.div variants={fadeUp} className="p-5">
                    <div className="text-2xl font-bold text-amber-600">{pending}</div>
                    <div className="text-xs text-gray-500 mt-1">Pending</div>
                    <div className="text-xs text-amber-500 mt-1.5">Awaiting review</div>
                </motion.div>
 
                {/* Unlocked */}
                <motion.div variants={fadeUp} className="p-5">
                    <div className="text-2xl font-bold text-green-600">{unlocked}</div>
                    <div className="text-xs text-gray-500 mt-1">Unlocked</div>
                    <div className="text-xs text-green-500 mt-1.5">3 saved offline</div>
                </motion.div>
 
                {/* Coins */}
                <motion.div variants={fadeUp} className="p-5">
                    <div className="text-2xl font-bold text-blue-600">{coins}</div>
                    <div className="text-xs text-gray-500 mt-1">Coins</div>
                    <div className="text-xs text-blue-500 mt-1.5">↑ +10 from quiz today</div>
                </motion.div>
            </div>
 
            {/* ── BROWSE & UPLOAD ENGAGEMENT BANNER ── */}
            <div className="px-4 pt-4 grid grid-cols-2 gap-4">
                {/* Browse Card */}
                <motion.div
                    variants={fadeUp}
                    whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(21,128,61,0.18)' }}
                    className="relative overflow-hidden rounded-xl cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)', minHeight: 130 }}
                >
                    {/* Decorative blobs */}
                    <div style={{ position: 'absolute', top: -28, right: -28, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                    <div style={{ position: 'absolute', bottom: -20, right: 60, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                    {/* Dotted grid texture */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
 
                    <div className="relative p-5 flex items-center justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(187,247,208,0.8)', fontWeight: 600 }}>Explore</span>
                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#86efac', display: 'inline-block' }} />
                            </div>
                            <h2 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                                Browse Papers
                            </h2>
                            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'rgba(187,247,208,0.75)', lineHeight: 1.5 }}>
                                1,200+ papers across 40 universities
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                style={{ marginTop: 14, background: '#fff', color: '#14532d', fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.01em' }}
                            >
                                Browse Library →
                            </motion.button>
                        </div>
 
                        {/* Right visual — stacked paper thumbnails */}
                        <div style={{ position: 'relative', width: 80, height: 90, flexShrink: 0 }}>
                            {[
                                { rotate: '-8deg', top: 10, right: 0, bg: 'rgba(255,255,255,0.1)' },
                                { rotate: '-2deg', top: 5, right: 6, bg: 'rgba(255,255,255,0.15)' },
                                { rotate: '4deg', top: 0, right: 12, bg: 'rgba(255,255,255,0.2)' },
                            ].map((s, i) => (
                                <div key={i} style={{ position: 'absolute', top: s.top, right: s.right, width: 54, height: 68, borderRadius: 6, background: s.bg, border: '1px solid rgba(255,255,255,0.15)', transform: `rotate(${s.rotate})`, backdropFilter: 'blur(4px)' }}>
                                    <div style={{ margin: '8px 6px 4px', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }} />
                                    <div style={{ margin: '0 6px', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
                                    <div style={{ margin: '4px 6px 0', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
                                    <div style={{ margin: '4px 6px 0', width: '60%', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
 
                {/* Upload Card */}
                <motion.div
                    variants={fadeUp}
                    whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(180,160,20,0.15)' }}
                    className="relative overflow-hidden rounded-xl cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 60%, #1c1917 100%)', minHeight: 130 }}
                >
                    {/* Decorative glow */}
                    <div style={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(202,193,76,0.08)', filter: 'blur(20px)' }} />
                    <div style={{ position: 'absolute', bottom: -20, right: 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(202,193,76,0.05)', filter: 'blur(16px)' }} />
                    {/* Grid texture */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
 
                    <div className="relative p-5 flex items-center justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(202,193,76,0.8)', fontWeight: 600 }}>Contribute</span>
                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ca8a04', display: 'inline-block' }} />
                            </div>
                            <h2 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                                Upload a Paper
                            </h2>
                            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                                Earn <span style={{ color: '#eab308', fontWeight: 600 }}>+25 coins</span> per approved upload
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                style={{ marginTop: 14, background: '#eab308', color: '#1c1917', fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.01em' }}
                            >
                                Upload Now →
                            </motion.button>
                        </div>
 
                        {/* Right visual — upload icon with orbit ring */}
                        <div style={{ position: 'relative', width: 80, height: 90, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 60, height: 60, borderRadius: '50%', border: '1.5px dashed rgba(234,179,8,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(234,179,8,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </div>
                            </div>
                            {/* Coin badges floating */}
                            <div style={{ position: 'absolute', top: 4, right: 0, background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: 20, padding: '2px 7px', fontSize: 10, color: '#eab308', fontWeight: 600 }}>+25🪙</div>
                        </div>
                    </div>
                </motion.div>
            </div>
 
            {/* ── MAIN CONTENT (mirrors .db-content two-col) ── */}
            <div className="p-4 grid grid-cols-2 gap-4">
 
                {/* LEFT COLUMN */}
                <div className="space-y-4">
 
                    {/* Recent Uploads (mirrors "Recent in your university") */}
                    <motion.div variants={fadeUp} className="bg-white-500 text-black p-5 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-sm font-medium">Recent Uploads</span>
                            </div>
                            <button className="text-xs text-green-400 hover:text-green-300 transition-colors">View all →</button>
                        </div>
                        <ul className="space-y-2">
                            {[
                                { title: "Quantum Mechanics Final", subject: "Physics", date: "Mar 21", size: "2.4 MB", pages: 12, status: "graded" },
                                { title: "Linear Algebra Midterm", subject: "Mathematics", date: "Mar 18", size: "1.1 MB", pages: 8, status: "pending" },
                                { title: "Data Structures Quiz", subject: "CS", date: "Mar 15", size: "0.8 MB", pages: 4, status: "reviewed" },
                            ].map((paper, i) => (
                                <li key={i} className="group flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all cursor-pointer">
                                    <div className="flex items-start gap-2.5 min-w-0">
                                        <div className="mt-0.5 shrink-0 w-7 h-7 rounded-md bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center text-indigo-300 text-[10px] font-bold">PDF</div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-600 truncate leading-snug">{paper.title}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{paper.subject} · {paper.pages}p · {paper.size}</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-1">
                                        <span className="text-[10px] text-slate-500">{paper.date}</span>
                                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${paper.status === "graded" ? "bg-emerald-500/15 text-emerald-400" : paper.status === "reviewed" ? "bg-sky-500/15 text-sky-400" : "bg-amber-500/15 text-amber-400"}`}>
                                            {paper.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
 
                    {/* Bar Chart */}
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-green-600 rounded-full" />
                            <span className="text-sm font-medium">Approved</span>
                            <div className="w-2 h-2 bg-green-300 rounded-full ml-4" />
                            <span className="text-sm font-medium">Pending</span>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={barData}>
                                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="approved" stackId="a" fill="#2d6a2d" isAnimationActive animationDuration={900} />
                                <Bar dataKey="pending" stackId="a" fill="#a8d5a2" isAnimationActive animationDuration={900} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
 
                    {/* Leaderboard */}
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <h3 className="font-semibold text-gray-800 mb-4">Leaderboard</h3>
                        <div className="space-y-3">
                            {leaderboard.map((user, i) => (
                                <motion.div key={i} variants={fadeUp} whileHover={{ x: 4 }} className="flex items-center justify-between p-2 rounded">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.university}</div>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${user.progress}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                                className="h-1 bg-green-500 mt-1 rounded"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-800">{user.uploads}</div>
                                        <div className={`text-xs px-2 py-1 rounded-full ${user.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {user.status}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
 
                {/* RIGHT COLUMN */}
                <div className="space-y-4">
 
                    {/* Exam Season / Pending Papers (mirrors "Exam season approaching") */}
                    <motion.div variants={fadeUp} className="bg-white p-5 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-sm font-medium">Pending Papers</span>
                            </div>
                            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">View all →</button>
                        </div>
                        <ul className="space-y-2">
                            {[
                                { title: "Differential Equations Final", subject: "Maths", date: "Mar 21", size: "2.4 MB", pages: 12, status: "pending" },
                                { title: "Computer Networks Midterm", subject: "CS", date: "Mar 18", size: "1.1 MB", pages: 8, status: "pending" },
                            ].map((paper, i) => (
                                <li key={i} className="flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all cursor-pointer">
                                    <div className="flex items-start gap-2.5 min-w-0">
                                        <div className="mt-0.5 shrink-0 w-7 h-7 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 text-[10px] font-bold">PDF</div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-700 truncate leading-snug">{paper.title}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{paper.subject} · {paper.pages}p · {paper.size}</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-1">
                                        <span className="text-[10px] text-slate-400">{paper.date}</span>
                                        <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">pending</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                  </motion.div>
 
                    {/* Next Unlocks */}
                    <motion.div variants={fadeUp} className="bg-white p-5 rounded-lg shadow-md space-y-3">
                        <h3 className="font-semibold text-gray-800">Next Unlocks</h3>
                        {unlockPapers.map((paper, i) => (
                            <motion.div key={i} variants={scaleIn} whileHover={{ scale: 1.02 }} className="p-3 border rounded-lg">
                                <div className="font-bold text-gray-800">{paper.subject}</div>
                                <div className="text-sm text-gray-500">{paper.university} • {paper.semester}</div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-amber-600 font-medium">{paper.cost} coins</span>
                                    <button className="bg-green-900 text-green-200 px-3 py-1 rounded text-sm">Unlock</button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
 
                    {/* Saved Papers + Library Progress + Study Tracker */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Saved Papers */}
                        <motion.div variants={fadeUp} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-3">Saved Papers</h3>
                            <div className="space-y-2">
                                {savedPapers.map((paper, i) => (
                                    <motion.div key={i} variants={slideLeft} className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${paper.color}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium text-gray-800 truncate">{paper.name}</div>
                                            <div className="text-[10px] text-gray-500">{paper.semester}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
 
                        {/* Library Progress donut */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">Library</h3>
                            <div className="relative">
                                <ResponsiveContainer width="100%" height={110}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value" isAnimationActive animationBegin={200} animationDuration={900}>
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-800">47%</div>
                                        <div className="text-[10px] text-gray-500">Unlocked</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                                {pieData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] text-gray-500">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
 

                </div>
            </div>
        </motion.div>
    )
}
