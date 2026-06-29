import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

interface Profile {
    user_id: string;
    name: string;
    age?: number;
    city?: string;
    locality?: string;
    bio?: string;
    occupation?: string;
    budget_min?: number;
    budget_max?: number;
    lifestyle_tags?: string[];
    photo_url?: string;
}

const MONOGRAM_GRADIENTS: [string, string][] = [
    ["#C8FF4D", "#7C3AED"],
    ["#FF6B6B", "#7C3AED"],
    ["#4DD0E1", "#7C3AED"],
    ["#C8FF4D", "#FF6B6B"],
    ["#7C3AED", "#4DD0E1"],
    ["#FF6B6B", "#C8FF4D"],
];

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function getMonogram(name: string) {
    const idx = hashString(name || "?") % MONOGRAM_GRADIENTS.length;
    const [from, to] = MONOGRAM_GRADIENTS[idx];
    const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
    return { from, to, initial };
}

export default function MyProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        API.get("/profile/get")
            .then((res) => setProfile(res.data.profile))
            .catch((err) => setError(err.response?.data?.msg || "Failed to load profile"))
            .finally(() => setLoading(false));
    }, []);

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading)
        return (
            <div
                className="min-h-screen bg-[#15111F] flex flex-col items-center justify-center gap-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
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
                <p
                    className="text-sm uppercase tracking-[0.2em] text-[#9D93B8]"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                >
                    Loading your profile…
                </p>
            </div>
        );

    // ── Error ────────────────────────────────────────────────────────────────
    if (error || !profile)
        return (
            <div
                className="min-h-screen bg-[#15111F] flex flex-col items-center justify-center gap-5 px-4 text-center relative overflow-hidden"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                <style>{FONT_IMPORT}</style>
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#C8FF4D]/10 blur-[100px]" />
                    <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#FF6B6B]/15 blur-[100px]" />
                </div>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1D1829] border border-[#2E2640] text-3xl">
                    😕
                </div>
                <p className="font-bold text-[#F4F1FF]">{error || "No profile found"}</p>
                <Link
                    to="/edit-profile"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#C8FF4D] px-6 py-2.5 text-sm font-bold text-[#15111F] shadow-lg hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)] hover:-translate-y-0.5 transition-all duration-200"
                >
                    Create profile →
                </Link>
            </div>
        );

    const monogram = getMonogram(profile.name);

    return (
        <div
            className="min-h-screen bg-[#15111F] relative overflow-hidden"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            <style>{FONT_IMPORT}</style>

            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#C8FF4D]/10 blur-[100px]" />
                <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#FF6B6B]/15 blur-[100px]" />
            </div>

            <div className="mx-auto max-w-lg px-4 sm:px-6 py-10 relative z-10">

                {/* Page title */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#C8FF4D] animate-pulse" />
                            <span
                                className="text-xs uppercase tracking-[0.2em] text-[#9D93B8]"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                Profile
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-[#F4F1FF] leading-tight">
                            My{" "}
                            <span className="text-[#C8FF4D]">profile.</span>
                        </h1>
                        <p className="text-sm text-[#9D93B8] mt-0.5">This is how others see you</p>
                    </div>
                    <Link
                        to="/edit-profile"
                        className="inline-flex items-center gap-2 rounded-2xl border border-[#2E2640] bg-[#1D1829] px-4 py-2 text-sm font-semibold text-[#9D93B8] hover:border-[#C8FF4D]/40 hover:text-[#C8FF4D] transition-all duration-200"
                    >
                        ✏️ Edit
                    </Link>
                </div>

                {/* ── Card ── */}
                <div className="overflow-hidden rounded-[28px] bg-[#1D1829] border border-[#2E2640] shadow-2xl shadow-black/60">

                    {/* Photo / monogram */}
                    <div className="relative h-72 w-full overflow-hidden">
                        {profile.photo_url ? (
                            <img
                                src={profile.photo_url}
                                alt={profile.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div
                                className="relative flex h-full w-full items-center justify-center overflow-hidden"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, ${monogram.from} 0%, ${monogram.to} 100%)`,
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage:
                                            "repeating-linear-gradient(135deg, #15111F 0px, #15111F 2px, transparent 2px, transparent 40px)",
                                    }}
                                />
                                <div className="absolute h-72 w-72 rounded-full bg-[#15111F]/15 blur-3xl" />
                                <span
                                    className="relative text-[140px] font-bold leading-none text-[#15111F]/85 select-none"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    {monogram.initial}
                                </span>
                            </div>
                        )}

                        {/* Budget badge */}
                        {profile.budget_min !== undefined && profile.budget_max !== undefined && (
                            <span
                                className="absolute top-5 right-5 rounded-2xl bg-[#C8FF4D] px-4 py-2 text-xs font-bold text-[#15111F] shadow-lg"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                ₹{profile.budget_min}k–{profile.budget_max}k
                            </span>
                        )}

                        {/* Bottom fade */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1D1829] to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="px-7 pt-4 pb-7 space-y-5">

                        {/* Name row */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#F4F1FF] tracking-tight">
                                    {profile.name}{profile.age ? `, ${profile.age}` : ""}
                                </h2>
                                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    {(profile.city || profile.locality) && (
                                        <span
                                            className="text-sm text-[#9D93B8]"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            📍 {[profile.locality, profile.city].filter(Boolean).join(", ")}
                                        </span>
                                    )}
                                    {profile.occupation && (
                                        <>
                                            <span className="text-[#3A324D]">·</span>
                                            <span
                                                className="rounded-full bg-[#2A2438] border border-[#3A324D] px-3 py-0.5 text-xs font-semibold text-[#C8FF4D]"
                                                style={{ fontFamily: "'Space Mono', monospace" }}
                                            >
                                                {profile.occupation}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[#2E2640]" />

                        {/* Bio */}
                        {profile.bio && (
                            <div>
                                <p
                                    className="text-xs font-semibold uppercase tracking-widest text-[#6E6585] mb-2"
                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                >
                                    About
                                </p>
                                <div className="relative text-sm text-[#9D93B8] leading-relaxed rounded-2xl bg-[#211C2E] border border-[#2A2438] px-5 py-4">
                                    <span
                                        className="absolute -top-1 left-3 text-3xl text-[#C8FF4D]/40 leading-none select-none"
                                        style={{ fontFamily: "Georgia, serif" }}
                                    >
                                        "
                                    </span>
                                    <p className="pl-4">{profile.bio}</p>
                                </div>
                            </div>
                        )}

                        {/* Lifestyle tags */}
                        {profile.lifestyle_tags && profile.lifestyle_tags.length > 0 && (
                            <div>
                                <p
                                    className="text-xs font-semibold uppercase tracking-widest text-[#6E6585] mb-3"
                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                >
                                    Lifestyle
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.lifestyle_tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-[#211C2E] border border-[#2E2640] px-3 py-1.5 text-xs font-semibold text-[#C8FF4D]"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-[#2E2640]" />

                        {/* Edit CTA */}
                        <Link
                            to="/edit-profile"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C8FF4D] py-4 text-sm font-bold text-[#15111F] shadow-lg hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                        >
                            ✏️ Edit Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}