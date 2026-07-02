import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

const LIFESTYLE_TAGS = [
    "non-smoker", "smoker",
    "early riser", "night owl",
    "vegetarian", "non-vegetarian",
    "pet-friendly", "no-pets",
    "introverted", "extroverted",
    "minimalist", "adventurous",
    "work from home", "gym enthusiast",
    "social", "quiet",
    "clean freak", "chill about mess",
];

interface FormState {
    name: string;
    age: string;
    city: string;
    locality: string;
    bio: string;
    occupation: string;
    budget_min: string;
    budget_max: string;
    lifestyle_tags: string[];
}

const EMPTY_FORM: FormState = {
    name: "",
    age: "",
    city: "",
    locality: "",
    bio: "",
    occupation: "",
    budget_min: "",
    budget_max: "",
    lifestyle_tags: [],
};

function InputField({
    label, value, onChange, placeholder, type = "text", hint,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    hint?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#6E6585]" style={{ fontFamily: "'Space Mono', monospace" }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-[#2E2640] bg-[#211C2E] px-4 py-3 text-sm text-[#F4F1FF] placeholder-[#6E6585] focus:outline-none focus:ring-2 focus:ring-[#C8FF4D]/40 focus:border-[#C8FF4D]/60 transition-all duration-150"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            />
            {hint && <p className="text-[10px] text-[#6E6585] pl-1" style={{ fontFamily: "'Space Mono', monospace" }}>{hint}</p>}
        </div>
    );
}

export default function EditProfilePage() {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/profile/get")
            .then((res) => {
                const p = res.data.profile;
                setForm({
                    name: p.name || "",
                    age: p.age?.toString() || "",
                    city: p.city || "",
                    locality: p.locality || "",
                    bio: p.bio || "",
                    occupation: p.occupation || "",
                    budget_min: p.budget_min?.toString() || "",
                    budget_max: p.budget_max?.toString() || "",
                    lifestyle_tags: p.lifestyle_tags || [],
                });
            })
            .catch((err) => setError(err.response?.data?.msg || "Failed to load profile"))
            .finally(() => setLoading(false));
    }, []);

    const toggleTag = (tag: string) => {
        setForm((prev) => ({
            ...prev,
            lifestyle_tags: prev.lifestyle_tags.includes(tag)
                ? prev.lifestyle_tags.filter((t) => t !== tag)
                : [...prev.lifestyle_tags, tag],
        }));
    };

    const set = (field: keyof FormState) => (value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSave = async () => {
        setError("");
        if (!form.name.trim()) { setError("Name is required."); return; }
        if (!form.city.trim()) { setError("City is required."); return; }
        if (!form.locality.trim()) { setError("Locality is required."); return; }
        if (form.age && Number(form.age) < 18) { setError("Age must be at least 18."); return; }
        if (form.budget_min && form.budget_max && Number(form.budget_min) > Number(form.budget_max)) {
            setError("Minimum budget can't be greater than maximum."); return;
        }

        setSaving(true);
        try {
            await API.put("/profile/update", {
                name: form.name.trim(),
                age: form.age ? Number(form.age) : undefined,
                city: form.city.trim(),
                locality: form.locality.trim(),
                bio: form.bio.trim(),
                occupation: form.occupation.trim(),
                budget_min: form.budget_min ? Number(form.budget_min) : undefined,
                budget_max: form.budget_max ? Number(form.budget_max) : undefined,
                lifestyle_tags: form.lifestyle_tags,
            });
            setSuccess(true);
            setTimeout(() => {window.location.href=/my-profile},1200)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { msg?: string } } };
            setError(e.response?.data?.msg || "Failed to save. Try again.");
        } finally {
            setSaving(false);
        }
    };

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading)
        return (
            <div className="min-h-screen bg-[#15111F] flex flex-col items-center justify-center gap-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <style>{FONT_IMPORT}</style>
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#C8FF4D]/10 blur-[100px]" />
                    <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#FF6B6B]/15 blur-[100px]" />
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-[#C8FF4D]/20 blur-2xl animate-pulse" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#1D1829] border border-[#2E2640] shadow-xl">
                        <div className="h-8 w-8 rounded-full border-4 border-[#C8FF4D]/30 border-t-[#C8FF4D] animate-spin" />
                    </div>
                </div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#9D93B8]" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Loading your profile…
                </p>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#15111F] relative overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <style>{FONT_IMPORT}</style>

            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#C8FF4D]/10 blur-[100px]" />
                <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#FF6B6B]/15 blur-[100px]" />
            </div>

            <div className="mx-auto max-w-lg px-4 sm:px-6 py-10 relative z-10">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#C8FF4D] animate-pulse" />
                            <span className="text-xs uppercase tracking-[0.2em] text-[#9D93B8]" style={{ fontFamily: "'Space Mono', monospace" }}>
                                Edit Profile
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-[#F4F1FF] leading-tight">
                            Update your <span className="text-[#C8FF4D]">info.</span>
                        </h1>
                        <p className="text-sm text-[#9D93B8] mt-0.5">Changes affect how others see and match with you</p>
                    </div>
                    <button
                        onClick={() => navigate("/my-profile")}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2E2640] bg-[#1D1829] text-[#9D93B8] hover:border-[#C8FF4D]/40 hover:text-[#C8FF4D] transition-all duration-150 text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Form Card ── */}
                <div className="rounded-[28px] bg-[#1D1829] border border-[#2E2640] shadow-2xl shadow-black/60 overflow-hidden">

                    <div className="px-7 py-7 space-y-6">

                        {/* ── Basic Info ── */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#6E6585] mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                                Basic Info
                            </p>
                            <div className="space-y-4">
                                <InputField label="Full Name *" value={form.name} onChange={set("name")} placeholder="Rakshand Chhikara" />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Age" value={form.age} onChange={set("age")} placeholder="22" type="number" hint="Must be 18+" />
                                    <InputField label="Occupation" value={form.occupation} onChange={set("occupation")} placeholder="Student / Developer" />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-[#2E2640]" />

                        {/* ── Location ── */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#6E6585] mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                                Location
                            </p>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="City *" value={form.city} onChange={set("city")} placeholder="Delhi" />
                                    <InputField label="Locality *" value={form.locality} onChange={set("locality")} placeholder="Pitampura" />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-[#2E2640]" />

                        {/* ── Budget ── */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#6E6585] mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                                Budget / month (₹)
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Minimum" value={form.budget_min} onChange={set("budget_min")} placeholder="8000" type="number" />
                                <InputField label="Maximum" value={form.budget_max} onChange={set("budget_max")} placeholder="15000" type="number" />
                            </div>
                            {form.budget_min && form.budget_max && (
                                <p className="mt-2 text-xs text-[#C8FF4D]" style={{ fontFamily: "'Space Mono', monospace" }}>
                                    ₹{Number(form.budget_min).toLocaleString()} – ₹{Number(form.budget_max).toLocaleString()} / mo
                                </p>
                            )}
                        </div>

                        <div className="h-px bg-[#2E2640]" />

                        {/* ── Bio ── */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#6E6585] mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                                About You
                            </p>
                            <div className="space-y-1.5">
                                <textarea
                                    value={form.bio}
                                    onChange={(e) => set("bio")(e.target.value)}
                                    placeholder="Tell potential flatmates a bit about yourself — your routine, what you value in a shared space, etc."
                                    rows={4}
                                    maxLength={300}
                                    className="w-full rounded-2xl border border-[#2E2640] bg-[#211C2E] px-4 py-3 text-sm text-[#F4F1FF] placeholder-[#6E6585] focus:outline-none focus:ring-2 focus:ring-[#C8FF4D]/40 focus:border-[#C8FF4D]/60 transition-all duration-150 resize-none"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                />
                                <p className="text-[10px] text-[#6E6585] text-right pr-1" style={{ fontFamily: "'Space Mono', monospace" }}>
                                    {form.bio.length}/300
                                </p>
                            </div>
                        </div>

                        <div className="h-px bg-[#2E2640]" />

                        {/* ── Lifestyle Tags ── */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-[#6E6585]" style={{ fontFamily: "'Space Mono', monospace" }}>
                                    Lifestyle Tags
                                </p>
                                {form.lifestyle_tags.length > 0 && (
                                    <span className="text-[10px] text-[#C8FF4D]" style={{ fontFamily: "'Space Mono', monospace" }}>
                                        {form.lifestyle_tags.length} selected
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-[#6E6585] mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                                Tap to select — these help match you with compatible flatmates
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {LIFESTYLE_TAGS.map((tag) => {
                                    const selected = form.lifestyle_tags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                                                selected
                                                    ? "bg-[#C8FF4D]/15 border border-[#C8FF4D]/50 text-[#C8FF4D] scale-105"
                                                    : "bg-[#211C2E] border border-[#2E2640] text-[#6E6585] hover:border-[#3A324D] hover:text-[#9D93B8]"
                                            }`}
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            {selected && <span className="mr-1">✓</span>}
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="border-t border-[#2E2640] bg-[#15111F] px-7 py-5 space-y-3">

                        {/* Error */}
                        {error && (
                            <div className="rounded-2xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 px-4 py-3 text-xs text-[#FF8A8A]" style={{ fontFamily: "'Space Mono', monospace" }}>
                                ⚠ {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="rounded-2xl bg-[#C8FF4D]/10 border border-[#C8FF4D]/30 px-4 py-3 text-xs text-[#C8FF4D]" style={{ fontFamily: "'Space Mono', monospace" }}>
                                ✓ Profile updated! Redirecting…
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={saving || success}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C8FF4D] py-4 text-sm font-bold text-[#15111F] shadow-lg hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200"
                        >
                            {saving ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-[#15111F]/30 border-t-[#15111F] animate-spin" />
                                    Saving…
                                </>
                            ) : success ? "✓ Saved!" : "Save Changes"}
                        </button>

                        <button
                            onClick={() => navigate("/my-profile")}
                            disabled={saving}
                            className="flex w-full items-center justify-center rounded-2xl border border-[#2E2640] bg-[#1D1829] py-3.5 text-sm font-bold text-[#9D93B8] hover:border-[#3A324D] hover:text-[#F4F1FF] disabled:opacity-40 transition-all duration-200"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}