import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

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


const inputCls =
    "w-full rounded-2xl border border-orange-100/80 bg-orange-50/40 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-orange-300/60 focus:border-orange-300 focus:bg-white";

export default function CreateProfile() {
    const navigate = useNavigate();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.name.trim() || !form.age || !form.city.trim() || !form.locality.trim() || !form.budget_min || !form.budget_max) {
            setError("Please fill all required fields.");
            return;
        }
        setLoading(true);
        try {
            await API.post("http://localhost:5000/profile/create", {
                ...form,
                age: Number(form.age),
                budget_min: Number(form.budget_min),
                budget_max: Number(form.budget_max),
            });
            navigate("/browse");
        } catch (err: any) {
            setError(err.response?.data?.msg || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const filled = [form.name, form.age, form.city, form.locality, form.budget_min, form.budget_max].filter(Boolean).length;
    const progress = Math.round((filled / 6) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 relative overflow-hidden py-10 px-4">
            {/* Ambient blobs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 -right-24 h-72 w-72 animate-pulse rounded-full bg-orange-200/40 blur-3xl" />
                <div className="absolute -bottom-32 -left-24 h-72 w-72 animate-pulse rounded-full bg-pink-100/50 blur-3xl" />
            </div>

            <div className="mx-auto max-w-lg">

                {/* Header */}
                <div className="mb-8 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100/80 border border-orange-200/50 px-4 py-1.5 text-xs font-semibold text-orange-600 mb-4 shadow-sm">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                        Step 1 of 1
                    </span>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Create your{" "}
                        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            profile
                        </span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Help others find the perfect flatmate in you
                    </p>

                    {/* Progress bar */}
                    <div className="mt-5 mx-auto max-w-xs">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-400">Required fields</span>
                            <span className="text-xs font-bold text-orange-500">{progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-orange-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-400 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Card */}
                <div className="overflow-hidden rounded-3xl bg-white/90 border border-orange-100/60 shadow-2xl shadow-orange-200/40 backdrop-blur-sm p-8">

                    {/* Error */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                            <span className="text-base">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* ── Section: Basic Info ── */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">Basic Info</p>
                            <div className="space-y-4">

                                {/* Name */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                        Full name <span className="text-orange-400">*</span>
                                    </label>
                                    <input
                                        name="name" value={form.name} onChange={handleChange}
                                        required placeholder="Enter your full name"
                                        className={inputCls}
                                    />
                                </div>

                                {/* Age + Gender */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                            Age <span className="text-orange-400">*</span>
                                        </label>
                                        <input
                                            name="age" type="number" min="18" max="99"
                                            value={form.age} onChange={handleChange}
                                            placeholder="E.g. 23" className={inputCls}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                            Gender
                                        </label>
                                        <select
                                            name="gender" value={form.gender} onChange={handleChange}
                                            className={inputCls}
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Occupation */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Occupation</label>
                                    <input
                                        name="occupation" value={form.occupation} onChange={handleChange}
                                        placeholder="E.g. Software Engineer, Student, Freelancer"
                                        className={inputCls}
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">About yourself</label>
                                    <textarea
                                        name="bio" value={form.bio} onChange={handleChange}
                                        placeholder="Tell others about your habits, why you need a flatmate, and what you're looking for…"
                                        rows={3} className={`${inputCls} resize-none`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-orange-100/60" />

                        {/* ── Section: Location ── */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">Location</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                        City <span className="text-orange-400">*</span>
                                    </label>
                                    <input
                                        name="city" value={form.city} onChange={handleChange}
                                        required placeholder="E.g. Delhi"
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                        Locality <span className="text-orange-400">*</span>
                                    </label>
                                    <input
                                        name="locality" value={form.locality} onChange={handleChange}
                                        required placeholder="E.g. Pitampura"
                                        className={inputCls}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-orange-100/60" />

                        {/* ── Section: Budget ── */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4">Monthly Rent Budget</p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <input
                                        name="budget_min" type="number" value={form.budget_min}
                                        onChange={handleChange} placeholder="Min ₹"
                                        className={inputCls}
                                    />
                                </div>
                                <div className="flex-shrink-0 text-gray-300 font-bold">—</div>
                                <div className="flex-1">
                                    <input
                                        name="budget_max" type="number" value={form.budget_max}
                                        onChange={handleChange} placeholder="Max ₹"
                                        className={inputCls}
                                    />
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-400">
                                We'll match you with people in your budget range.
                            </p>
                        </div>

                        <div className="h-px bg-orange-100/60" />

                        {/* ── Section: Lifestyle ── */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">Lifestyle & Preferences</p>
                            <p className="text-xs text-gray-400 mb-4">Pick all that apply</p>
                            <div className="flex flex-wrap gap-2">
                                {LIFESTYLE_OPTIONS.map((tag) => {
                                    const active = form.lifestyle_tags.includes(tag);
                                    return (
                                        <button
                                            key={tag} type="button" onClick={() => toggleTag(tag)}
                                            className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-150 ${active
                                                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-orange-500 shadow-md shadow-orange-300/40 scale-105"
                                                : "bg-white text-gray-600 border-orange-200/60 hover:border-orange-300 hover:bg-orange-50"
                                                }`}
                                        >
                                            <span>{LIFESTYLE_EMOJIS[tag]}</span>
                                            {tag.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </button>
                                    );
                                })}
                            </div>
                            {form.lifestyle_tags.length > 0 && (
                                <p className="mt-3 text-xs text-orange-500 font-medium">
                                    ✓ {form.lifestyle_tags.length} selected
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 py-4 text-sm font-bold text-white shadow-xl shadow-orange-300/50 hover:shadow-2xl hover:shadow-orange-400/50 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                    Saving profile…
                                </span>
                            ) : (
                                "Save & continue to browse →"
                            )}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <p className="mt-5 text-center text-sm text-gray-400">
                    Already have a profile?{" "}
                    <button
                        type="button" onClick={() => navigate("/browse")}
                        className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        Go to browse →
                    </button>
                </p>
            </div>
        </div>
    );
}