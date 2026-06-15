import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                {/* Logo */}
                <Link
                    to="/browse"
                    className="group relative text-2xl font-black tracking-tight text-white transition-transform duration-300 hover:scale-105"
                >
                    flat<span className="text-[#C6FF3A]">mate</span>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-[#C6FF3A] transition-all duration-500 group-hover:w-full" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
                    {[
                        { to: "/browse", label: "Browse" },
                        { to: "/matches", label: "Matches" },
                        { to: "/create-profile", label: "Profile" },
                    ].map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="relative rounded-full px-4 py-2 text-sm font-bold text-white/60 transition-colors duration-200 hover:text-white hover:bg-white/5"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        to="/login"
                        className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-white/70 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
                    >
                        log in
                    </Link>
                    <Link
                        to="/signup"
                        className="group inline-flex items-center gap-1.5 rounded-full bg-[#C6FF3A] px-5 py-2 text-sm font-extrabold text-[#0B0B0F] transition-all duration-200 hover:shadow-[0_0_20px_2px_rgba(198,255,58,0.4)] active:scale-95"
                    >
                        sign up
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white md:hidden"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {open ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="border-t border-white/10 bg-[#0B0B0F] px-5 py-4 md:hidden">
                    <div className="flex flex-col gap-1">
                        {[
                            { to: "/browse", label: "Browse" },
                            { to: "/matches", label: "Matches" },
                            { to: "/create-profile", label: "Profile" },
                        ].map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-3 py-2.5 text-sm font-bold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                        <Link
                            to="/login"
                            onClick={() => setOpen(false)}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-center text-sm font-bold text-white/70 transition-colors hover:text-white"
                        >
                            log in
                        </Link>
                        <Link
                            to="/signup"
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-[#C6FF3A] px-4 py-2.5 text-center text-sm font-extrabold text-[#0B0B0F]"
                        >
                            sign up →
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}