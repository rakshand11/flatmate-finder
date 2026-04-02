import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 to-white">
                {/* Blobs */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-24 -right-16 h-80 w-80 rounded-full bg-orange-200/50 blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 -left-16 h-64 w-64 rounded-full bg-pink-100/60 blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/3 h-48 w-48 rounded-full bg-amber-100/50 blur-2xl" />
                </div>

                <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-4 pb-28 pt-20 md:flex-row md:items-center md:justify-between md:pt-28">
                    {/* Left */}
                    <div className="max-w-xl text-center md:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 border border-orange-200/70 px-4 py-1.5 text-xs font-semibold text-orange-600 shadow-sm">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                            Finding flatmates made simple
                        </span>

                        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-tight">
                            Find your perfect{" "}
                            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
                                flatmate
                            </span>{" "}
                            <br className="hidden sm:block" />in your city
                        </h1>

                        <p className="mt-5 text-base text-gray-500 sm:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                            Swipe, match and chat with people who share your lifestyle, budget and vibe.
                            No awkward cold calls — just real connections.
                        </p>

                        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
                            <Link
                                to="/signup"
                                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                            >
                                <span className="group-hover:translate-x-1 transition-transform duration-200">
                                    Find my flatmate →
                                </span>
                            </Link>
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors duration-200 flex items-center gap-1"
                            >
                                I have an account →
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400 md:justify-start">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                24/7 active users
                            </span>
                            <span className="h-px w-12 bg-gray-200" />
                            <span>Trusted by renters across India</span>
                        </div>
                    </div>

                    {/* Right – bright card mockup */}
                    <div className="flex w-full justify-center md:w-auto">
                        <div className="relative w-full max-w-sm rounded-3xl bg-white border border-orange-100 p-7 shadow-2xl shadow-orange-200/50">
                            {/* Notch */}
                            <div className="absolute -top-2.5 left-1/2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-orange-200/60" />

                            <div className="mb-5 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500">Delhi · ₹15k–25k</span>
                                <span className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200/60 px-3 py-1 text-[10px] font-bold text-green-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                    3 matches today
                                </span>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { name: "Ananya, 24", tag: "Early riser · Non-smoker", badge: "Looking ASAP", color: "bg-green-50  border-green-200/60  text-green-700" },
                                    { name: "Karan, 26", tag: "Remote worker · Pet-friendly", badge: "Flexible move-in", color: "bg-blue-50   border-blue-200/60   text-blue-700" },
                                    { name: "Megha, 23", tag: "Student · Quiet", badge: "Sharing 2BHK", color: "bg-violet-50 border-violet-200/60 text-violet-700" },
                                ].map((p) => (
                                    <div
                                        key={p.name}
                                        className={`flex items-center justify-between rounded-2xl border ${p.color} px-4 py-3.5 hover:scale-[1.02] transition-transform duration-200`}
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{p.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{p.tag}</p>
                                        </div>
                                        <span className={`rounded-full border ${p.color} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide`}>
                                            {p.badge}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 flex items-center justify-between rounded-xl bg-orange-50 border border-orange-200/60 px-4 py-2.5">
                                <span className="text-xs font-semibold text-orange-600">Swipe to match →</span>
                                <span className="h-4 w-4 rounded-full bg-green-400 border-2 border-white shadow-sm animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats strip ── */}
            <section className="border-y border-orange-100/80 bg-orange-50/40 px-4 py-8">
                <div className="mx-auto max-w-4xl grid grid-cols-3 gap-4 text-center">
                    {[
                        { num: "10k+", label: "Active users" },
                        { num: "3k+", label: "Matches made" },
                        { num: "50+", label: "Cities" },
                    ].map((s) => (
                        <div key={s.label}>
                            <p className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">{s.num}</p>
                            <p className="text-xs text-gray-400 mt-0.5 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="bg-white px-4 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Simple process</span>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            How it works
                        </h2>
                        <p className="mt-4 text-base text-gray-500">
                            Three simple steps to find your flatmate and move in with confidence.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { step: "01", title: "Create your profile", desc: "Share your budget, city, lifestyle and preferences so we can find your best matches.", icon: "👤", bg: "bg-orange-50  border-orange-200/60" },
                            { step: "02", title: "Swipe & match", desc: "Discover people you'd actually live with. When you both swipe right, it's a match.", icon: "❤️", bg: "bg-pink-50   border-pink-200/60" },
                            { step: "03", title: "Chat & meet", desc: "Chat inside the app, ask questions, and plan a meetup before you decide.", icon: "💬", bg: "bg-violet-50 border-violet-200/60" },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className={`group rounded-3xl border ${item.bg} p-8 text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/60 transition-all duration-300`}
                            >
                                <span className="inline-block text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                                <span className="block text-xs font-bold tracking-[0.3em] text-orange-400 uppercase mb-3">{item.step}</span>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="bg-orange-50/50 px-4 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Why us</span>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Why Flatmate?
                        </h2>
                        <p className="mt-4 text-base text-gray-500">
                            Designed for renters, not brokers. Save time, money and awkward conversations.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {[
                            { icon: "🏙️", title: "City-wise matching", desc: "Find flatmates in your exact locality and budget range, from GK to Dwarka.", bg: "from-orange-50 to-amber-50", border: "border-orange-200/60" },
                            { icon: "🎯", title: "Lifestyle filters", desc: "Filter by habits like early riser, non-smoker, pets, work schedule and more.", bg: "from-pink-50 to-rose-50", border: "border-pink-200/60" },
                            { icon: "💬", title: "In-app chat", desc: "Talk to your matches directly in the app. Share numbers only when you're ready.", bg: "from-blue-50 to-sky-50", border: "border-blue-200/60" },
                            { icon: "🔒", title: "Safe & secure", desc: "Report, block and verify. Your data is protected and you only see people you match with.", bg: "from-violet-50 to-purple-50", border: "border-violet-200/60" },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className={`group flex gap-5 rounded-3xl bg-gradient-to-br ${f.bg} border ${f.border} p-7 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/60 transition-all duration-300`}
                            >
                                <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white border border-orange-100 text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    {f.icon}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <h3 className="mb-1.5 text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                                        {f.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="px-4 py-24 bg-white">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-rose-400 p-1 shadow-2xl shadow-orange-300/40">
                        <div className="rounded-[22px] bg-gradient-to-r from-orange-500 via-pink-500 to-rose-400 px-10 py-16 text-center">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl leading-tight drop-shadow">
                                Ready to find your<br />perfect flatmate?
                            </h2>
                            <p className="mt-5 text-base text-white/80 max-w-md mx-auto leading-relaxed">
                                Join thousands of people finding their perfect flatmate every day.
                                Be moved in before your next rent cycle.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center rounded-2xl bg-white px-10 py-4 text-sm font-bold text-orange-600 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                >
                                    Get started for free →
                                </Link>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
                                >
                                    Already a member? Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-orange-100/60 bg-orange-50/30 py-10 text-center">
                <p className="text-sm text-gray-400">
                    Built with ❤️ by Rakshand · Flatmate · 2026
                </p>
                <p className="mt-1.5 text-xs text-gray-300">
                    © 2026 Rakshand Chhikara. All rights reserved.
                </p>
            </footer>
        </div>
    );
}