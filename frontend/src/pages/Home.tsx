import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
            {/* Navbar */}
            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
                    <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />
                </div>

                <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 pb-24 pt-24 md:flex-row md:items-center md:justify-between md:pt-28">
                    {/* Left */}
                    <div className="max-w-xl text-center md:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold text-orange-600 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            Finding flatmates made simple
                        </span>

                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            Find your perfect{" "}
                            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                flatmate
                            </span>{" "}
                            in your city
                        </h1>

                        <p className="mt-4 text-base text-gray-500 sm:text-lg">
                            Swipe, match and chat with people who share your lifestyle, budget and vibe.
                            No awkward cold calls, just real connections.
                        </p>

                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                            >
                                Find my flatmate
                            </Link>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
                            >
                                I have an account →
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400 md:justify-start">
                            <span className="flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                                24/7 active users
                            </span>
                            <span>Trusted by renters across India</span>
                        </div>
                    </div>

                    {/* Right – mock phone/card */}
                    <div className="flex w-full justify-center md:w-auto">
                        <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl shadow-orange-200/40 ring-1 ring-orange-100">
                            <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                                <span>Delhi · ₹15k–25k</span>
                                <span>3 matches today</span>
                            </div>

                            <div className="space-y-3">
                                {[
                                    {
                                        name: "Ananya, 24",
                                        tag: "Early riser · Non-smoker",
                                        badge: "Looking ASAP",
                                        color: "bg-green-50 text-green-600"
                                    },
                                    {
                                        name: "Karan, 26",
                                        tag: "Remote worker · Pet-friendly",
                                        badge: "Flexible move-in",
                                        color: "bg-blue-50 text-blue-600"
                                    },
                                    {
                                        name: "Megha, 23",
                                        tag: "Student · Quiet",
                                        badge: "Sharing 2BHK",
                                        color: "bg-purple-50 text-purple-600"
                                    }
                                ].map((p) => (
                                    <div
                                        key={p.name}
                                        className="flex items-center justify-between rounded-2xl bg-orange-50/60 px-3 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                                            <p className="text-xs text-gray-500">{p.tag}</p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${p.color}`}
                                        >
                                            {p.badge}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                                <span>Swipe to match →</span>
                                <span>Safe & verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-white px-4 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            How it works
                        </h2>
                        <p className="mt-3 text-sm text-gray-500">
                            Three simple steps to find your flatmate and move in with confidence.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {[
                            {
                                step: "01",
                                title: "Create your profile",
                                desc: "Share your budget, city, lifestyle and preferences so we can find your best matches.",
                                icon: "👤"
                            },
                            {
                                step: "02",
                                title: "Swipe & match",
                                desc: "Discover people you’d actually live with. When you both swipe right, it’s a match.",
                                icon: "❤️"
                            },
                            {
                                step: "03",
                                title: "Chat & meet",
                                desc: "Chat inside the app, ask questions, and plan a meetup before you decide.",
                                icon: "💬"
                            }
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="flex flex-col items-center rounded-2xl bg-orange-50/70 p-6 text-center shadow-sm ring-1 ring-orange-100"
                            >
                                <span className="mb-4 text-4xl">{item.icon}</span>
                                <span className="mb-1 text-xs font-bold tracking-[0.2em] text-orange-300">
                                    {item.step}
                                </span>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-orange-50 px-4 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            Why Flatmate?
                        </h2>
                        <p className="mt-3 text-sm text-gray-500">
                            Designed for renters, not brokers. Save time, money and awkward conversations.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        {[
                            {
                                icon: "🏙️",
                                title: "City-wise matching",
                                desc: "Find flatmates in your exact locality and budget range, from GK to Dwarka."
                            },
                            {
                                icon: "🎯",
                                title: "Lifestyle filters",
                                desc: "Filter by habits like early riser, non-smoker, pets, work schedule and more."
                            },
                            {
                                icon: "💬",
                                title: "In-app chat",
                                desc: "Talk to your matches directly in the app. Share numbers only when you’re ready."
                            },
                            {
                                icon: "🔒",
                                title: "Safe & secure",
                                desc: "Report, block and verify. Your data is protected and you only see people you match with."
                            }
                        ].map((f) => (
                            <div
                                key={f.title}
                                className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-orange-100"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                                    {f.icon}
                                </span>
                                <div>
                                    <h3 className="mb-1 text-base font-semibold text-gray-900">
                                        {f.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-20 text-center text-white">
                <div className="mx-auto max-w-2xl">
                    <h2 className="text-3xl font-bold sm:text-4xl">
                        Ready to find your flatmate?
                    </h2>
                    <p className="mt-3 text-sm text-orange-100">
                        Join thousands of people finding their perfect flatmate every day.
                        Be moved in before your next rent cycle.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link
                            to="/signup"
                            className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-orange-600 shadow-lg shadow-orange-700/30 transition hover:-translate-y-0.5 hover:bg-orange-50"
                        >
                            Get started for free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-6 text-center">
                <p className="text-xs text-gray-400">
                    Built with ❤️ by Rakshand · Flatmate · 2024
                </p>
            </footer>
        </div>
    );
}