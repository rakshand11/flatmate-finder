import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

const inputCls =
    "w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#2A2438] bg-[#211C2E] text-[15px] text-[#F4F1FF] placeholder-[#6E6585] outline-none transition-colors focus:border-[#C8FF4D] disabled:opacity-60";

const TAGS = [
    { label: "🐶 Pet friendly", rotate: "-rotate-6", pos: "top-8 -left-16" },
    { label: "🎮 Gamer", rotate: "rotate-3", pos: "top-24 -right-20" },
    { label: "🌙 Night owl", rotate: "rotate-6", pos: "bottom-32 -left-24" },
    { label: "🧹 Clean freak", rotate: "-rotate-3", pos: "bottom-12 -right-16" },
];

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "", phone: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.email.trim()) { setError("Drop your email first 👀"); return; }
        if (!form.password) { setError("Pick a password, fam."); return; }
        setLoading(true);
        try {
            await API.post("/user/register", form);
            navigate("/create-profile");
        } catch (err: any) {
            setError(err.response?.data?.msg || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#15111F] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <style>{FONT_IMPORT}</style>

            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#C8FF4D]/10 blur-[100px]" />
                <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#FF6B6B]/15 blur-[100px]" />
            </div>

            <div className="relative w-full max-w-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

                {/* Card stack behind form — tinder deck illusion */}
                <div className="absolute inset-0 -z-10 hidden sm:block">
                    <div className="absolute top-6 left-6 right-6 bottom-0 rounded-[28px] bg-[#2A2438] rotate-[6deg] opacity-60" />
                    <div className="absolute top-3 left-3 right-3 bottom-0 rounded-[28px] bg-[#382F4D] rotate-[-3deg] opacity-80" />
                </div>

                {/* Floating tag chips */}
                {TAGS.map((tag) => (
                    <div
                        key={tag.label}
                        className={`hidden lg:flex absolute ${tag.pos} ${tag.rotate} items-center px-4 py-2 rounded-full bg-[#211C2E] border border-[#3A324D] text-xs text-[#C8FF4D] shadow-lg shadow-black/40`}
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        {tag.label}
                    </div>
                ))}

                {/* Main card */}
                <div className="relative rounded-[28px] bg-[#1D1829] border border-[#2E2640] shadow-2xl shadow-black/60 p-8 z-10">

                    {/* Eyebrow */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#C8FF4D] animate-pulse" />
                        <span
                            className="text-xs uppercase tracking-[0.2em] text-[#9D93B8]"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            Roommate hunt starts here
                        </span>
                    </div>

                    {/* Header */}
                    <h1 className="text-4xl font-bold text-[#F4F1FF] leading-tight mb-1">
                        Find your<br />
                        <span className="text-[#C8FF4D]">person.</span>
                    </h1>
                    <p className="text-sm text-[#9D93B8] mb-7">
                        Swipe, match, move in. No awkward intros.
                    </p>

                    {/* Error */}
                    {error && (
                        <div
                            className="mb-5 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 px-4 py-3 text-sm text-[#FF8A8A]"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6585] text-sm">@</span>
                            <input
                                type="email" name="email" value={form.email}
                                onChange={handleChange} required disabled={loading}
                                placeholder="you@gmail.com"
                                className={inputCls}
                            />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6585]">📱</span>
                            <input
                                type="tel" name="phone" value={form.phone}
                                onChange={handleChange} disabled={loading}
                                placeholder="98765 43210"
                                className={inputCls}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6585]">🔒</span>
                            <input
                                type="password" name="password" value={form.password}
                                onChange={handleChange} required disabled={loading}
                                placeholder="Make it a good one"
                                className={inputCls}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-[#C8FF4D] py-4 text-sm font-bold text-[#15111F] tracking-wide
                                       hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)]
                                       hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 rounded-full border-2 border-[#15111F]/30 border-t-[#15111F] animate-spin" />
                                    Setting things up…
                                </span>
                            ) : (
                                "Start swiping →"
                            )}
                        </button>
                    </form>

                    {/* Sign in link */}
                    <div className="mt-6 pt-6 border-t border-[#2E2640] text-center text-sm text-[#9D93B8]">
                        Already on FlatMate?{" "}
                        <Link to="/login" className="font-bold text-[#C8FF4D] hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>

                {/* Terms */}
                <p
                    className="text-center text-[11px] text-[#6E6585] mt-6"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                >
                    By signing up you're cool with our{" "}
                    <span className="text-[#9D93B8] underline cursor-pointer">Terms</span>
                    {" "}+{" "}
                    <span className="text-[#9D93B8] underline cursor-pointer">Privacy</span>
                </p>
            </div>
        </div>
    );
}