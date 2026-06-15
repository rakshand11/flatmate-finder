import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

const LIFESTYLE_OPTIONS = [
    "non-smoker", "smoker", "pet-friendly", "no-pets",
    "early riser", "night owl", "vegetarian", "non-vegetarian",
    "introverted", "extroverted", "work from home", "student",
];

const LIFESTYLE_EMOJIS: Record<string, string> = {
    "non-smoker": "🚭", "smoker": "🚬", "pet-friendly": "🐾", "no-pets": "🙅",
    "early riser": "🌅", "night owl": "🦉", "vegetarian": "🥗", "non-vegetarian": "🍗",
    "introverted": "📚", "extroverted": "🎉", "work from home": "💻", "student": "🎓",
};

const STEPS = [
    { id: 1, label: "Who are you?", icon: "👤" },
    { id: 2, label: "Where at?", icon: "📍" },
    { id: 3, label: "Budget", icon: "💸" },
    { id: 4, label: "Vibe check", icon: "✨" },
];

const inputCls =
    "w-full rounded-2xl border-2 border-[#2A2438] bg-[#211C2E] px-4 py-3.5 text-sm text-[#F4F1FF] placeholder-[#6E6585] outline-none transition-colors focus:border-[#C8FF4D] disabled:opacity-60";

const labelCls = "block text-xs font-semibold uppercase tracking-[0.15em] text-[#9D93B8] mb-2";

export default function CreateProfile() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "", age: "", gender: "", bio: "",
        city: "", locality: "", budget_min: "", budget_max: "",
        occupation: "", lifestyle_tags: [] as string[],
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => setForm({ ...form, [e.target.name]: e.target.value });

    const toggleTag = (tag: string) =>
        setForm((prev) => ({
            ...prev,
            lifestyle_tags: prev.lifestyle_tags.includes(tag)
                ? prev.lifestyle_tags.filter((t) => t !== tag)
                : [...prev.lifestyle_tags, tag],
        }));

    const next = () => {
        setError("");
        if (step === 1 && (!form.name.trim() || !form.age)) {
            setError("Name and age are required 👀"); return;
        }
        if (step === 2 && (!form.city.trim() || !form.locality.trim())) {
            setError("Tell us where you're at 📍"); return;
        }
        if (step === 3 && (!form.budget_min || !form.budget_max)) {
            setError("Set your budget range 💸"); return;
        }
        setStep((s) => s + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await API.post("/profile/create", {
                ...form,
                age: Number(form.age),
                budget_min: Number(form.budget_min),
                budget_max: Number(form.budget_max),
            });
            navigate("/browse");
        } catch (err: any) {
            setError(err.response?.data?.msg || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-[#15111F] relative overflow-hidden"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            <style>{FONT_IMPORT}</style>

            {/* Ambient blobs */}
            <div className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#C8FF4D]/10 blur-[100px]" />
                <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#FF6B6B]/15 blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#7C3AED]/8 blur-[80px]" />
            </div>

            {/* ── Full screen layout: left panel + right form ── */}
            <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

                {/* ══ LEFT PANEL ══ */}
                <div className="lg:w-[42%] flex flex-col justify-between p-8 lg:p-14 lg:min-h-screen border-b lg:border-b-0 lg:border-r border-[#2E2640]">

                    {/* Top: brand + step label */}
                    <div>
                        {/* Eyebrow */}
                        <div className="flex items-center gap-2 mb-10">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#C8FF4D] animate-pulse" />
                            <span
                                className="text-xs uppercase tracking-[0.2em] text-[#9D93B8]"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                Profile Setup
                            </span>
                        </div>

                        {/* Big headline */}
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#F4F1FF] leading-tight mb-4">
                            Build your<br />
                            <span className="text-[#C8FF4D]">flatmate</span><br />
                            card.
                        </h1>
                        <p className="text-[#9D93B8] text-sm leading-relaxed max-w-xs">
                            This is your first impression. Make it count — the right person is one swipe away.
                        </p>
                    </div>

                    {/* Middle: Step tracker */}
                    <div className="my-10 lg:my-0 space-y-3">
                        {STEPS.map((s) => {
                            const done = step > s.id;
                            const active = step === s.id;
                            return (
                                <div
                                    key={s.id}
                                    className={`flex items-center gap-4 rounded-2xl px-5 py-4 border transition-all duration-300 ${active
                                            ? "bg-[#C8FF4D]/10 border-[#C8FF4D]/40"
                                            : done
                                                ? "bg-[#1D1829] border-[#2E2640] opacity-60"
                                                : "bg-transparent border-transparent opacity-30"
                                        }`}
                                >
                                    {/* Circle */}
                                    <div
                                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold border-2 transition-all duration-300 ${active
                                                ? "bg-[#C8FF4D] border-[#C8FF4D] text-[#15111F]"
                                                : done
                                                    ? "bg-[#2A2438] border-[#C8FF4D]/40 text-[#C8FF4D]"
                                                    : "bg-[#1D1829] border-[#2E2640] text-[#6E6585]"
                                            }`}
                                    >
                                        {done ? "✓" : s.icon}
                                    </div>
                                    <div>
                                        <p
                                            className={`text-sm font-bold ${active ? "text-[#F4F1FF]" : "text-[#9D93B8]"}`}
                                        >
                                            {s.label}
                                        </p>
                                        <p
                                            className="text-xs text-[#6E6585]"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            Step {s.id} of {STEPS.length}
                                        </p>
                                    </div>
                                    {active && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C8FF4D] animate-pulse" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom: preview card teaser */}
                    <div
                        className="hidden lg:block rounded-2xl bg-[#1D1829] border border-[#2E2640] p-5"
                    >
                        <p
                            className="text-xs uppercase tracking-[0.15em] text-[#6E6585] mb-3"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            Your card preview
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-[#2A2438] border border-[#3A324D] flex items-center justify-center text-2xl">
                                👤
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#F4F1FF]">
                                    {form.name || "Your name"}
                                </p>
                                <p className="text-xs text-[#9D93B8]">
                                    {form.age ? `${form.age} yrs` : "Age"}{form.city ? ` · ${form.city}` : ""}
                                </p>
                            </div>
                            {(form.budget_min || form.budget_max) && (
                                <span
                                    className="ml-auto rounded-xl bg-[#C8FF4D] px-3 py-1.5 text-xs font-bold text-[#15111F]"
                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                >
                                    ₹{form.budget_min || "?"}k–{form.budget_max || "?"}k
                                </span>
                            )}
                        </div>
                        {form.lifestyle_tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {form.lifestyle_tags.slice(0, 4).map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-[#2A2438] border border-[#3A324D] px-2.5 py-1 text-[10px] text-[#C8FF4D]"
                                        style={{ fontFamily: "'Space Mono', monospace" }}
                                    >
                                        {LIFESTYLE_EMOJIS[tag]} {tag}
                                    </span>
                                ))}
                                {form.lifestyle_tags.length > 4 && (
                                    <span className="text-[10px] text-[#6E6585] px-1 py-1">
                                        +{form.lifestyle_tags.length - 4} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ══ RIGHT PANEL — form ══ */}
                <div className="lg:w-[58%] flex items-center justify-center p-6 lg:p-14">
                    <div className="w-full max-w-xl">

                        {/* Step label */}
                        <div className="mb-8">
                            <span
                                className="text-xs uppercase tracking-[0.2em] text-[#6E6585]"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                {STEPS[step - 1].icon} {STEPS[step - 1].label}
                            </span>
                            {/* Progress bar */}
                            <div className="mt-3 h-1 w-full rounded-full bg-[#2A2438] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-[#C8FF4D] transition-all duration-500"
                                    style={{ width: `${(step / STEPS.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="mb-6 rounded-2xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 px-5 py-4 text-sm text-[#FF8A8A]"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                {error}
                            </div>
                        )}

                        {/* ── STEP 1: Basic Info ── */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#F4F1FF] mb-1">
                                        Who are you?
                                    </h2>
                                    <p className="text-sm text-[#9D93B8]">
                                        The basics — name, age, what you do.
                                    </p>
                                </div>

                                <div>
                                    <label className={labelCls}>Full name *</label>
                                    <input
                                        name="name" value={form.name} onChange={handleChange}
                                        placeholder="Rakshand Chhikara" className={inputCls}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Age *</label>
                                        <input
                                            name="age" type="number" min="18" max="99"
                                            value={form.age} onChange={handleChange}
                                            placeholder="23" className={inputCls}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Gender</label>
                                        <select
                                            name="gender" value={form.gender} onChange={handleChange}
                                            className={inputCls + " cursor-pointer"}
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Occupation</label>
                                    <input
                                        name="occupation" value={form.occupation} onChange={handleChange}
                                        placeholder="Software Engineer, Student, Freelancer…"
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>About yourself</label>
                                    <textarea
                                        name="bio" value={form.bio} onChange={handleChange}
                                        placeholder="Your habits, what you're looking for in a flatmate, anything that helps people vibe with you…"
                                        rows={4} className={`${inputCls} resize-none`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: Location ── */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#F4F1FF] mb-1">
                                        Where at?
                                    </h2>
                                    <p className="text-sm text-[#9D93B8]">
                                        We match you with people close to you.
                                    </p>
                                </div>

                                <div>
                                    <label className={labelCls}>City *</label>
                                    <input
                                        name="city" value={form.city} onChange={handleChange}
                                        placeholder="Delhi" className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className={labelCls}>Locality / Neighbourhood *</label>
                                    <input
                                        name="locality" value={form.locality} onChange={handleChange}
                                        placeholder="Pitampura, Sector 62 Noida, Koramangala…"
                                        className={inputCls}
                                    />
                                </div>

                                {/* Map placeholder — decorative */}
                                <div className="rounded-2xl bg-[#1D1829] border border-[#2E2640] p-6 flex flex-col items-center justify-center gap-2 min-h-[140px]">
                                    <span className="text-4xl opacity-40">🗺️</span>
                                    <p
                                        className="text-xs text-[#6E6585] text-center"
                                        style={{ fontFamily: "'Space Mono', monospace" }}
                                    >
                                        {form.locality && form.city
                                            ? `📍 ${form.locality}, ${form.city}`
                                            : "Enter your location above"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: Budget ── */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#F4F1FF] mb-1">
                                        Budget?
                                    </h2>
                                    <p className="text-sm text-[#9D93B8]">
                                        Monthly rent you're comfortable with.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Min ₹ *</label>
                                        <input
                                            name="budget_min" type="number"
                                            value={form.budget_min} onChange={handleChange}
                                            placeholder="8000" className={inputCls}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Max ₹ *</label>
                                        <input
                                            name="budget_max" type="number"
                                            value={form.budget_max} onChange={handleChange}
                                            placeholder="15000" className={inputCls}
                                        />
                                    </div>
                                </div>

                                {/* Budget display */}
                                {(form.budget_min || form.budget_max) && (
                                    <div className="rounded-2xl bg-[#C8FF4D]/10 border border-[#C8FF4D]/30 p-5 text-center">
                                        <p
                                            className="text-xs uppercase tracking-[0.15em] text-[#9D93B8] mb-2"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            Your range
                                        </p>
                                        <p className="text-3xl font-bold text-[#C8FF4D]">
                                            ₹{Number(form.budget_min || 0).toLocaleString()} – ₹{Number(form.budget_max || 0).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-[#9D93B8] mt-1">per month</p>
                                    </div>
                                )}

                                <p
                                    className="text-xs text-[#6E6585]"
                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                >
                                    💡 We'll only show you people within your budget range
                                </p>
                            </div>
                        )}

                        {/* ── STEP 4: Lifestyle ── */}
                        {step === 4 && (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-3xl font-bold text-[#F4F1FF] mb-1">
                                            Vibe check ✨
                                        </h2>
                                        <p className="text-sm text-[#9D93B8]">
                                            Pick everything that describes you.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2.5">
                                        {LIFESTYLE_OPTIONS.map((tag) => {
                                            const active = form.lifestyle_tags.includes(tag);
                                            return (
                                                <button
                                                    key={tag} type="button" onClick={() => toggleTag(tag)}
                                                    className={`flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${active
                                                            ? "bg-[#C8FF4D] border-[#C8FF4D] text-[#15111F] scale-105 shadow-lg shadow-[#C8FF4D]/20"
                                                            : "bg-[#1D1829] border-[#2A2438] text-[#9D93B8] hover:border-[#C8FF4D]/40 hover:text-[#F4F1FF]"
                                                        }`}
                                                >
                                                    <span>{LIFESTYLE_EMOJIS[tag]}</span>
                                                    <span>{tag}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {form.lifestyle_tags.length > 0 && (
                                        <p
                                            className="text-xs text-[#C8FF4D]"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            ✓ {form.lifestyle_tags.length} selected
                                        </p>
                                    )}

                                    {error && (
                                        <div
                                            className="rounded-2xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 px-5 py-4 text-sm text-[#FF8A8A]"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded-2xl bg-[#C8FF4D] py-4 text-sm font-bold text-[#15111F] tracking-wide hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="h-4 w-4 rounded-full border-2 border-[#15111F]/30 border-t-[#15111F] animate-spin" />
                                                Setting up your profile…
                                            </span>
                                        ) : (
                                            "Start swiping →"
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── Nav buttons ── */}
                        {step < 4 && (
                            <div className="mt-8 flex items-center gap-4">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => { setError(""); setStep((s) => s - 1); }}
                                        className="flex-1 rounded-2xl border-2 border-[#2A2438] bg-[#1D1829] py-4 text-sm font-bold text-[#9D93B8] hover:border-[#C8FF4D]/40 hover:text-[#F4F1FF] transition-all duration-200"
                                    >
                                        ← Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={next}
                                    className="flex-1 rounded-2xl bg-[#C8FF4D] py-4 text-sm font-bold text-[#15111F] tracking-wide hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                                >
                                    Continue →
                                </button>
                            </div>
                        )}

                        {/* Skip to browse */}
                        <p className="mt-5 text-center text-xs text-[#6E6585]"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            Already have a profile?{" "}
                            <button
                                type="button" onClick={() => navigate("/browse")}
                                className="text-[#C8FF4D] hover:underline font-bold"
                            >
                                Go to browse →
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}