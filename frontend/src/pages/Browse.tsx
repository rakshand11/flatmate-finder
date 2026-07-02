import { useEffect, useState, useRef } from "react";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

interface Profile {
    user_id: string;
    name: string;
    age: number;
    city: string;
    locality: string;
    bio: string;
    occupation: string;
    budget_min: number;
    budget_max: number;
    lifestyle_tags: string[];
    photo_url?: string;
    compatibility_score: number;
    mutual_lifestyle_tags: string[];
    conflicting_tags?: string[];
}

interface MyProfile {
    name: string;
    age: number;
    bio: string;
    occupation: string;
    budget_min: number;
    budget_max: number;
    lifestyle_tags: string[];
    city: string;
}

interface BioInsight {
    text: string;
    type: "green" | "red" | "neutral";
}

interface Toast {
    msg: string;
    type: "match" | "like" | "pass";
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

// ── AI Bio Insight — only analyses bios, tags already handled server-side ────
async function fetchBioInsights(me: MyProfile, them: Profile): Promise<BioInsight[]> {
    if (!me.bio && !them.bio) return [];

    const prompt = `You are a flatmate compatibility analyst. Analyse ONLY the bio text of these two people and surface personality or lifestyle insights that can't be inferred from tags alone.

MY BIO: "${me.bio || "not provided"}"
MY OCCUPATION: ${me.occupation || "unknown"}

THEIR BIO: "${them.bio || "not provided"}"
THEIR OCCUPATION: ${them.occupation || "unknown"}

Return ONLY a valid JSON array, no markdown, no extra text:
[{"text":"insight here","type":"green"},{"text":"insight here","type":"red"}]

Rules:
- Max 2 green, max 2 red insights
- Each insight max 9 words, punchy and specific
- Only infer from the bio text — do not repeat tag-based facts
- type must be "green" or "red"
- If bios are too short or generic, return []`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 200,
            messages: [{ role: "user", content: prompt }],
        }),
    });

    const data = await response.json();
    const text = data.content?.map((b: { type: string; text?: string }) => b.text || "").join("") || "";
    try {
        const clean = text.replace(/```json|```/g, "").trim();
        return JSON.parse(clean) as BioInsight[];
    } catch {
        return [];
    }
}

export default function BrowsePage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [myProfile, setMyProfile] = useState<MyProfile | null>(null);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [swiping, setSwiping] = useState(false);
    const [toast, setToast] = useState<Toast | null>(null);
    const [stampDir, setStampDir] = useState<"left" | "right" | null>(null);
    const [bioInsights, setBioInsights] = useState<BioInsight[]>([]);
    const [bioLoading, setBioLoading] = useState(false);
    const insightCache = useRef<Record<string, BioInsight[]>>({});
    const cardRef = useRef<HTMLDivElement>(null);

    const showToast = (msg: string, type: Toast["type"]) => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2800);
    };

    useEffect(() => {
        Promise.all([
            API.get("/profile/get-all"),
            API.get("/profile/get"),
        ])
            .then(([allRes, meRes]) => {
                setProfiles(allRes.data.profiles || []);
                setMyProfile(meRes.data.profile || null);
            })
            .catch((err) => {
                if (err.response?.status === 401) window.location.href = "/login";
            })
            .finally(() => setLoading(false));
    }, []);

    // Fetch bio insights when card changes
    useEffect(() => {
        const profile = profiles[current];
        if (!profile || !myProfile) return;

        if (insightCache.current[profile.user_id]) {
            setBioInsights(insightCache.current[profile.user_id]);
            return;
        }

        setBioInsights([]);
        setBioLoading(true);

        fetchBioInsights(myProfile, profile)
            .then((result) => {
                insightCache.current[profile.user_id] = result;
                setBioInsights(result);
            })
            .catch(() => setBioInsights([]))
            .finally(() => setBioLoading(false));
    }, [current, profiles, myProfile]);

    // Keyboard support
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") swipe("left");
            if (e.key === "ArrowRight") swipe("right");
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profiles, current, swiping]);

    const swipe = async (direction: "left" | "right") => {
        if (swiping || profiles.length === 0 || current >= profiles.length) return;
        setSwiping(true);
        setStampDir(direction);
        const swipedProfile = profiles[current];

        setTimeout(async () => {
            try {
                const res = await API.post("/swipes/create", {
                    swiped_id: swipedProfile.user_id,
                    direction,
                });
                if (res.data.msg === "Its a match!") {
                    showToast(`🎉 You matched with ${swipedProfile.name}!`, "match");
                } else if (direction === "right") {
                    showToast(`❤️ You liked ${swipedProfile.name}`, "like");
                } else {
                    showToast(`👋 Passed on ${swipedProfile.name}`, "pass");
                }
                setProfiles((prev) => prev.filter((_, i) => i !== current));
                setCurrent((prev) => (prev >= 1 ? prev - 1 : 0));
            } catch (err) {
                console.error(err);
            } finally {
                setStampDir(null);
                setSwiping(false);
            }
        }, 500);
    };

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
                    Finding flatmates near you…
                </p>
            </div>
        );

    const profile = profiles[current];
    const compat = profile?.compatibility_score ?? 0;
    const mutualTags = profile?.mutual_lifestyle_tags ?? [];
    const conflictingTags = profile?.conflicting_tags ?? [];
    const monogram = profile ? getMonogram(profile.name) : null;

    const toastStyles: Record<Toast["type"], string> = {
        match: "bg-[#C8FF4D] text-[#15111F]",
        like: "bg-[#C8FF4D] text-[#15111F]",
        pass: "bg-[#2A2438] border border-[#3A324D] text-[#9D93B8]",
    };

    // Combine server conflicting tags + AI bio insights into one unified list
    const allRedFlags: string[] = [
        ...conflictingTags.map((pair) => `Lifestyle clash: ${pair}`),
        ...bioInsights.filter((i) => i.type === "red").map((i) => i.text),
    ];
    const allGreenFlags: string[] = bioInsights.filter((i) => i.type === "green").map((i) => i.text);
    const hasVibeData = allRedFlags.length > 0 || allGreenFlags.length > 0;

    return (
        <div className="min-h-screen w-full bg-[#15111F] relative overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <style>{FONT_IMPORT}</style>

            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#C8FF4D]/10 blur-[100px]" />
                <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#FF6B6B]/15 blur-[100px]" />
            </div>

            {/* Toast */}
            <div className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${toast ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"}`}>
                {toast && (
                    <div className={`flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-bold shadow-2xl ${toastStyles[toast.type]}`} style={{ fontFamily: "'Space Mono', monospace" }}>
                        <span className="h-2 w-2 rounded-full bg-current animate-ping opacity-70" />
                        {toast.msg}
                    </div>
                )}
            </div>

            {/* ── Main ── */}
            <main className="w-full flex flex-col items-center px-4 sm:px-6 pb-10 pt-6 relative z-10">

                {/* Page header */}
                <div className="mb-6 w-full max-w-2xl flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#C8FF4D] animate-pulse" />
                            <span className="text-xs uppercase tracking-[0.2em] text-[#9D93B8]" style={{ fontFamily: "'Space Mono', monospace" }}>Browse</span>
                        </div>
                        <h1 className="text-3xl font-bold text-[#F4F1FF] leading-tight">
                            Find your <span className="text-[#C8FF4D]">person.</span>
                        </h1>
                        <p className="text-sm text-[#9D93B8] mt-0.5">Swipe right to like · left to pass · use ← → keys</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-[#1D1829] border border-[#2E2640] px-5 py-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                        <span className="h-2 w-2 rounded-full bg-[#C8FF4D] animate-pulse" />
                        <span className="text-sm font-bold text-[#F4F1FF]">{profiles.length}</span>
                        <span className="text-xs text-[#6E6585]">left</span>
                    </div>
                </div>

                {/* ── Empty state ── */}
                {!profile ? (
                    <div className="w-full max-w-2xl rounded-[28px] bg-[#1D1829] border border-[#2E2640] shadow-2xl shadow-black/60 p-16 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#2A2438] border border-[#3A324D]">
                            <span className="text-5xl">✨</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#F4F1FF] mb-3">You're all caught up!</h2>
                        <p className="text-[#9D93B8] mb-8 leading-relaxed max-w-xs mx-auto text-sm">New flatmates join every day. Check back tomorrow for fresh profiles!</p>
                        <a href="/matches" className="inline-flex items-center gap-2 rounded-2xl bg-[#C8FF4D] px-8 py-4 text-sm font-bold text-[#15111F] hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)] hover:-translate-y-0.5 transition-all duration-200">
                            See your matches →
                        </a>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl">
                        {/* Hint pill */}
                        <div className="mb-5 w-fit mx-auto flex items-center gap-3 rounded-full bg-[#1D1829] border border-[#2E2640] px-5 py-2 text-xs text-[#9D93B8]" style={{ fontFamily: "'Space Mono', monospace" }}>
                            <span>👈 Pass</span>
                            <div className="h-px w-8 bg-[#3A324D]" />
                            <span>Like ❤️ 👉</span>
                        </div>

                        {/* ── Card stack ── */}
                        <div className="relative w-full">
                            <div className="absolute inset-0 top-4 rounded-[28px] bg-[#2A2438] rotate-[3deg] opacity-50 -z-10" />
                            <div className="absolute inset-0 top-2 rounded-[28px] bg-[#211C2E] rotate-[-2deg] opacity-70 -z-10" />

                            {/* ── Main Profile Card ── */}
                            <div
                                ref={cardRef}
                                className={`relative rounded-[28px] bg-[#1D1829] border border-[#2E2640] shadow-2xl shadow-black/60 overflow-hidden transition-transform duration-150 ${stampDir === "right" ? "rotate-[3deg] translate-x-1" : stampDir === "left" ? "-rotate-[3deg] -translate-x-1" : ""}`}
                            >
                                {/* LIKE stamp */}
                                <div className={`pointer-events-none absolute top-7 right-6 z-20 border-[3px] border-[#C8FF4D] text-[#C8FF4D] rounded-lg px-4 py-1 text-xl font-bold -rotate-12 transition-opacity duration-200 ${stampDir === "right" ? "opacity-100" : "opacity-0"}`} style={{ fontFamily: "'Space Mono', monospace" }}>
                                    LIKE
                                </div>

                                {/* NOPE stamp */}
                                <div className={`pointer-events-none absolute top-7 left-6 z-20 border-[3px] border-[#FF6B6B] text-[#FF6B6B] rounded-lg px-4 py-1 text-xl font-bold rotate-12 transition-opacity duration-200 ${stampDir === "left" ? "opacity-100" : "opacity-0"}`} style={{ fontFamily: "'Space Mono', monospace" }}>
                                    NOPE
                                </div>

                                {/* ── Photo / monogram ── */}
                                <div className="relative h-[400px] w-full overflow-hidden">
                                    {profile.photo_url ? (
                                        <img src={profile.photo_url} alt={profile.name} className="h-full w-full object-cover" />
                                    ) : (() => {
                                        const { from, to, initial } = monogram!;
                                        return (
                                            <div className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}>
                                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(135deg, #15111F 0px, #15111F 2px, transparent 2px, transparent 40px)" }} />
                                                <div className="absolute h-72 w-72 rounded-full bg-[#15111F]/15 blur-3xl" />
                                                <style>{`@keyframes floatLetter { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }`}</style>
                                                <span className="relative text-[160px] font-bold leading-none text-[#15111F]/85 select-none" style={{ fontFamily: "'Space Grotesk', sans-serif", animation: "floatLetter 4s ease-in-out infinite" }}>
                                                    {initial}
                                                </span>
                                                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#15111F]/25 to-transparent" />
                                            </div>
                                        );
                                    })()}

                                    {/* Top badges */}
                                    <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-between px-6">
                                        <span className="rounded-2xl bg-[#15111F]/70 backdrop-blur-md border border-white/10 px-4 py-2 text-xs font-semibold text-[#F4F1FF] shadow-lg" style={{ fontFamily: "'Space Mono', monospace" }}>
                                            📍 {profile.locality}, {profile.city}
                                        </span>
                                        <span className="rounded-2xl bg-[#C8FF4D] px-4 py-2 text-xs font-bold text-[#15111F] shadow-lg" style={{ fontFamily: "'Space Mono', monospace" }}>
                                            ₹{profile.budget_min / 1000}k–{profile.budget_max / 1000}k
                                        </span>
                                    </div>

                                    {/* Compatibility bar */}
                                    <div className="absolute inset-x-0 bottom-0 px-6 pb-4 pt-12 bg-gradient-to-t from-[#1D1829] to-transparent">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[10px] uppercase tracking-widest text-[#9D93B8]" style={{ fontFamily: "'Space Mono', monospace" }}>Compatibility</span>
                                            <span className="text-xs font-bold text-[#C8FF4D]" style={{ fontFamily: "'Space Mono', monospace" }}>{compat}%</span>
                                        </div>
                                        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-[#C8FF4D] to-[#a8e63d] transition-all duration-700" style={{ width: `${compat}%` }} />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Info ── */}
                                <div className="px-7 pt-5 pb-4 space-y-4">

                                    {/* Name row */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h2 className="text-3xl font-bold text-[#F4F1FF] tracking-tight truncate">{profile.name}</h2>
                                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                <span className="text-sm text-[#9D93B8]" style={{ fontFamily: "'Space Mono', monospace" }}>{profile.age} yrs</span>
                                                {profile.occupation && (
                                                    <>
                                                        <span className="text-[#3A324D]">·</span>
                                                        <span className="rounded-full bg-[#2A2438] border border-[#3A324D] px-3 py-1 text-xs font-semibold text-[#C8FF4D]" style={{ fontFamily: "'Space Mono', monospace" }}>{profile.occupation}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs text-[#6E6585] mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Budget / mo</p>
                                            <p className="text-lg font-bold text-[#C8FF4D]">₹{profile.budget_min.toLocaleString()}–{profile.budget_max.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    {profile.bio && (
                                        <div className="relative text-sm text-[#9D93B8] leading-relaxed rounded-2xl bg-[#211C2E] border border-[#2A2438] px-5 py-4">
                                            <span className="absolute -top-1 left-3 text-3xl text-[#C8FF4D]/40 leading-none select-none" style={{ fontFamily: "Georgia, serif" }}>"</span>
                                            <p className="pl-4">{profile.bio}</p>
                                        </div>
                                    )}

                                    {/* Lifestyle tags */}
                                    {profile.lifestyle_tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.lifestyle_tags.map((tag) => {
                                                const isMutual = mutualTags.includes(tag);
                                                const isConflict = conflictingTags.some((pair) => pair.includes(tag.toLowerCase()));
                                                return (
                                                    <span
                                                        key={tag}
                                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 ${
                                                            isConflict
                                                                ? "bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-[#FF8A8A]"
                                                                : isMutual
                                                                    ? "bg-[#C8FF4D]/10 border border-[#C8FF4D]/30 text-[#C8FF4D]"
                                                                    : "bg-[#211C2E] border border-[#2E2640] text-[#C8FF4D]"
                                                        }`}
                                                        style={{ fontFamily: "'Space Mono', monospace" }}
                                                    >
                                                        {isConflict && <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6B6B] flex-shrink-0" />}
                                                        {isMutual && !isConflict && <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C8FF4D] flex-shrink-0" />}
                                                        {tag}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Tag legend */}
                                    {(mutualTags.length > 0 || conflictingTags.length > 0) && (
                                        <div className="flex flex-wrap gap-3 -mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>
                                            {mutualTags.length > 0 && (
                                                <p className="text-[10px] text-[#6E6585]">
                                                    ● {mutualTags.length} trait{mutualTags.length > 1 ? "s" : ""} in common
                                                </p>
                                            )}
                                            {conflictingTags.length > 0 && (
                                                <p className="text-[10px] text-[#FF6B6B]/70">
                                                    ● {conflictingTags.length} lifestyle conflict{conflictingTags.length > 1 ? "s" : ""}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* ── AI VIBE CHECK ── */}
                                    <div className="rounded-2xl bg-[#15111F] border border-[#2E2640] overflow-hidden">
                                        {/* Header */}
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2E2640]">
                                            <span className="text-sm">🤖</span>
                                            <span className="text-xs font-bold text-[#F4F1FF] uppercase tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
                                                AI Vibe Check
                                            </span>
                                            {bioLoading && (
                                                <span className="ml-auto flex items-center gap-1.5 text-[10px] text-[#6E6585]" style={{ fontFamily: "'Space Mono', monospace" }}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#C8FF4D] animate-pulse" />
                                                    Reading bio…
                                                </span>
                                            )}
                                        </div>

                                        <div className="px-4 py-3 space-y-2">
                                            {/* Server-side conflicts — shown instantly */}
                                            {conflictingTags.map((pair, i) => (
                                                <div key={`cf-${i}`} className="flex items-start gap-2">
                                                    <span className="mt-0.5 flex-shrink-0 text-sm">🚩</span>
                                                    <span className="text-xs text-[#9D93B8] leading-relaxed capitalize" style={{ fontFamily: "'Space Mono', monospace" }}>
                                                        {pair.replace("/", "vs")} lifestyle clash
                                                    </span>
                                                </div>
                                            ))}

                                            {/* AI bio shimmer */}
                                            {bioLoading && (
                                                <div className="space-y-2 animate-pulse pt-1">
                                                    <div className="h-3.5 rounded-full bg-[#2A2438] w-4/5" />
                                                    <div className="h-3.5 rounded-full bg-[#2A2438] w-3/5" />
                                                </div>
                                            )}

                                            {/* AI bio insights */}
                                            {!bioLoading && allGreenFlags.map((flag, i) => (
                                                <div key={`g-${i}`} className="flex items-start gap-2">
                                                    <span className="mt-0.5 flex-shrink-0 text-sm">✅</span>
                                                    <span className="text-xs text-[#9D93B8] leading-relaxed" style={{ fontFamily: "'Space Mono', monospace" }}>{flag}</span>
                                                </div>
                                            ))}
                                            {!bioLoading && bioInsights.filter(i => i.type === "red").map((insight, i) => (
                                                <div key={`br-${i}`} className="flex items-start gap-2">
                                                    <span className="mt-0.5 flex-shrink-0 text-sm">🚩</span>
                                                    <span className="text-xs text-[#9D93B8] leading-relaxed" style={{ fontFamily: "'Space Mono', monospace" }}>{insight.text}</span>
                                                </div>
                                            ))}

                                            {/* Nothing to show */}
                                            {!bioLoading && !hasVibeData && (
                                                <p className="text-xs text-[#6E6585] py-1" style={{ fontFamily: "'Space Mono', monospace" }}>
                                                    Not enough data to analyse yet.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Swipe Buttons ── */}
                                <div className="border-t border-[#2E2640] bg-[#15111F] px-7 py-5">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => swipe("left")}
                                            onMouseEnter={() => setStampDir("left")}
                                            onMouseLeave={() => !swiping && setStampDir(null)}
                                            disabled={swiping}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[#2E2640] bg-[#1D1829] py-4 text-sm font-bold text-[#9D93B8] hover:border-[#FF6B6B]/60 hover:bg-[#FF6B6B]/10 hover:text-[#FF8A8A] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            <span className="text-lg">✕</span>
                                            Pass
                                        </button>
                                        <button
                                            onClick={() => swipe("right")}
                                            onMouseEnter={() => setStampDir("right")}
                                            onMouseLeave={() => !swiping && setStampDir(null)}
                                            disabled={swiping}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#C8FF4D] py-4 text-sm font-bold text-[#15111F] hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            <span className="text-lg">❤️</span>
                                            Like
                                        </button>
                                    </div>
                                    <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-[#6E6585]" style={{ fontFamily: "'Space Mono', monospace" }}>
                                        <span><kbd className="rounded bg-[#211C2E] border border-[#3A324D] px-1.5 py-0.5 text-[#9D93B8]">←</kbd> Pass</span>
                                        <span className="text-[#3A324D]">·</span>
                                        <span>Like <kbd className="rounded bg-[#211C2E] border border-[#3A324D] px-1.5 py-0.5 text-[#9D93B8]">→</kbd></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Profile nav counter ── */}
                        <div className="mt-6 flex items-center justify-center gap-5 rounded-2xl bg-[#1D1829] border border-[#2E2640] px-6 py-3">
                            <button
                                disabled={current === 0}
                                onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2E2640] bg-[#211C2E] text-[#6E6585] hover:border-[#C8FF4D]/40 hover:text-[#C8FF4D] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <span className="text-sm font-bold text-[#F4F1FF] min-w-[64px] text-center" style={{ fontFamily: "'Space Mono', monospace" }}>
                                {current + 1} <span className="text-[#6E6585] font-normal">of</span> {profiles.length}
                            </span>
                            <button
                                disabled={current >= profiles.length - 1}
                                onClick={() => setCurrent((prev) => Math.min(prev + 1, profiles.length - 1))}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2E2640] bg-[#211C2E] text-[#6E6585] hover:border-[#C8FF4D]/40 hover:text-[#C8FF4D] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}