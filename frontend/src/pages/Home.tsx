import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0B0B0F] text-white">
            <Navbar />

            {/* ── Hero ── */}
            <section className="relative overflow-hidden">
                {/* Background texture */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-[#C6FF3A]/20 blur-[100px]" />
                    <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-[#FF5CA8]/15 blur-[100px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:28px_28px]" />
                </div>

                <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 px-5 pb-24 pt-14 md:flex-row md:items-center md:justify-between md:pt-24">
                    {/* Left */}
                    <div className="max-w-xl text-center md:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#C6FF3A]/30 bg-[#C6FF3A]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#C6FF3A]">
                            <span className="h-2 w-2 rounded-full bg-[#C6FF3A] animate-ping" />
                            no cap, finally a good roomie app
                        </span>

                        <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[0.95]">
                            stop living with{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-[#C6FF3A] via-[#7CFFCB] to-[#5CE1FF] bg-clip-text text-transparent">
                                    randoms
                                </span>
                                <svg className="absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                                    <path d="M0,5 Q50,0 100,5 T200,5" stroke="#C6FF3A" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="mt-5 text-base text-white/60 sm:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                            Swipe on flatmates who actually match your budget, vibe and sleep schedule.
                            Zero broker calls. Zero awkward group chats with strangers.
                        </p>

                        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
                            <Link
                                to="/signup"
                                className="group inline-flex items-center justify-center rounded-full bg-[#C6FF3A] px-8 py-4 text-sm font-extrabold text-[#0B0B0F] shadow-[0_0_0_0_rgba(198,255,58,0.6)] hover:shadow-[0_0_30px_4px_rgba(198,255,58,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                            >
                                find my flatmate
                                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                            </Link>
                            <Link
                                to="/login"
                                className="text-sm font-bold text-white/50 hover:text-white transition-colors duration-200"
                            >
                                already in? log in
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/40 md:justify-start">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#7CFFCB] animate-pulse" />
                                live matches happening rn
                            </span>
                            <span className="h-px w-10 bg-white/10" />
                            <span>10k+ renters across India</span>
                        </div>
                    </div>

                    {/* Right – stacked swipe cards */}
                    <div className="flex w-full justify-center md:w-auto">
                        <div className="relative h-[420px] w-full max-w-sm">
                            {/* Back card */}
                            <div className="absolute inset-x-6 top-6 h-full rounded-[28px] border border-white/10 bg-white/5 rotate-3" />
                            {/* Middle card */}
                            <div className="absolute inset-x-3 top-3 h-full rounded-[28px] border border-white/10 bg-white/5 -rotate-2" />

                            {/* Front card */}
                            <div className="relative h-full w-full rounded-[28px] border border-white/10 bg-[#15151C] p-6 shadow-2xl shadow-black/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Bandra · ₹18k–22k</span>
                                    <span className="flex items-center gap-1.5 rounded-full bg-[#C6FF3A]/15 border border-[#C6FF3A]/30 px-3 py-1 text-[10px] font-extrabold text-[#C6FF3A]">
                                        98% match
                                    </span>
                                </div>

                                <div className="mt-5 flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7CFFCB]/20 to-[#5CE1FF]/10 border border-white/5 text-6xl">
                                    🧑‍🎨
                                </div>

                                <div className="mt-5">
                                    <h3 className="text-xl font-extrabold">Riya, 24</h3>
                                    <p className="text-sm text-white/50 mt-1">UX designer · plant mom · night owl</p>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {["non-smoker", "loves cooking", "WFH"].map((t) => (
                                        <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white/60">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-5">
                                    <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl hover:bg-white/10 transition-colors">
                                        ✕
                                    </button>
                                    <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C6FF3A] text-2xl text-[#0B0B0F] hover:scale-110 transition-transform">
                                        ♥
                                    </button>
                                    <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl hover:bg-white/10 transition-colors">
                                        ⭐
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Marquee divider ── */}
            <div className="overflow-hidden border-y border-white/10 bg-[#C6FF3A] py-3">
                <div className="flex animate-marquee whitespace-nowrap">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-8 px-4 text-sm font-extrabold uppercase tracking-widest text-[#0B0B0F]">
                            {Array.from({ length: 6 }).map((__, j) => (
                                <span key={j} className="flex items-center gap-8">
                                    swipe right on your next bestie ✦ no more random roomie horror stories ✦
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Stats strip ── */}
            <section className="px-5 py-12">
                <div className="mx-auto max-w-4xl grid grid-cols-3 gap-4 text-center">
                    {[
                        { num: "10k+", label: "active users" },
                        { num: "3k+", label: "matches made" },
                        { num: "50+", label: "cities" },
                    ].map((s) => (
                        <div key={s.label}>
                            <p className="text-3xl sm:text-4xl font-black text-[#C6FF3A]">{s.num}</p>
                            <p className="text-xs text-white/40 mt-1 font-bold uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="px-5 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#7CFFCB]">the vibe check</span>
                        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                            three swipes to your new spot
                        </h2>
                        <p className="mt-4 text-base text-white/50">
                            it's basically dating, but for someone who'll split the wifi bill.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { emoji: "📝", title: "build your profile", desc: "drop your budget, city, sleep schedule and chaos level so we can find your match." },
                            { emoji: "💚", title: "swipe & match", desc: "double tap on the people you'd actually share a kitchen with. mutual swipe = match." },
                            { emoji: "💬", title: "chat & link up", desc: "text inside the app, vibe check on a call, then plan a move-in date that works." },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center hover:border-[#C6FF3A]/40 hover:bg-white/[0.06] transition-all duration-300"
                            >
                                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C6FF3A]/10 text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                                    {item.emoji}
                                </span>
                                <h3 className="text-lg font-extrabold mb-2">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-white/50">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="px-5 py-24 border-t border-white/10">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FF5CA8]">why us, fr</span>
                        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                            built different (in a good way)
                        </h2>
                        <p className="mt-4 text-base text-white/50">
                            no brokers, no fees, no fake listings. just real people, real rooms.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {[
                            { icon: "🏙️", title: "hyperlocal matching", desc: "find flatmates in your exact area and budget, from GK to Dwarka.", accent: "#C6FF3A" },
                            { icon: "🎯", title: "vibe filters", desc: "filter by early riser, non-smoker, pet parent, work-from-home and more.", accent: "#7CFFCB" },
                            { icon: "💬", title: "in-app chat", desc: "talk to matches without giving out your number until you're ready.", accent: "#5CE1FF" },
                            { icon: "🔒", title: "actually safe", desc: "verified profiles, easy reporting, and you only see people you've matched with.", accent: "#FF5CA8" },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className="group relative flex gap-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 hover:bg-white/[0.06] transition-all duration-300"
                            >
                                <div
                                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"
                                    style={{ backgroundColor: f.accent }}
                                />
                                <span
                                    className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-2xl group-hover:scale-110 transition-transform duration-300"
                                >
                                    {f.icon}
                                </span>
                                <div className="relative min-w-0 flex-1">
                                    <h3 className="mb-1.5 text-lg font-extrabold">{f.title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="px-5 py-24 border-t border-white/10">
                <div className="mx-auto max-w-3xl">
                    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#C6FF3A] via-[#7CFFCB] to-[#5CE1FF] px-10 py-16 text-center">
                        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
                        <h2 className="relative text-4xl font-black text-[#0B0B0F] sm:text-5xl leading-tight">
                            your future roomie<br />is one swipe away
                        </h2>
                        <p className="relative mt-5 text-base text-[#0B0B0F]/70 max-w-md mx-auto leading-relaxed font-medium">
                            join thousands of people finding their people every day. be moved in before your next rent cycle.
                        </p>
                        <div className="relative mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center rounded-full bg-[#0B0B0F] px-10 py-4 text-sm font-extrabold text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                            >
                                get started — it's free →
                            </Link>
                            <Link
                                to="/login"
                                className="text-sm font-bold text-[#0B0B0F]/60 hover:text-[#0B0B0F] transition-colors"
                            >
                                already a member? sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-white/10 py-10 text-center">
                <p className="text-sm text-white/40 font-medium">
                    built with 💚 by Rakshand · Flatmate · 2026
                </p>
                <p className="mt-1.5 text-xs text-white/20">
                    © 2026 Rakshand Chhikara. all rights reserved.
                </p>
            </footer>

            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 22s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-marquee { animation: none; }
                }
            `}</style>
        </div>
    );
}