import { useEffect, useState } from "react";
import API from "../api/axios";


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
}

interface Toast {
    msg: string;
    type: "match" | "like" | "pass";
}

export default function BrowsePage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [swiping, setSwiping] = useState(false);
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (msg: string, type: Toast["type"]) => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2800);
    };

    useEffect(() => {
        API.get("/profile/get-all")
            .then((res) => setProfiles(res.data.profiles || []))
            .catch((err) => {
                if (err.response?.status === 401) window.location.href = "/login";
            })
            .finally(() => setLoading(false));
    }, []);

    const swipe = async (direction: "left" | "right") => {
        if (swiping || profiles.length === 0 || current >= profiles.length) return;
        setSwiping(true);
        const swipedProfile = profiles[current];
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
            setSwiping(false);
        }
    };


    if (loading)
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-orange-200/50 blur-2xl animate-pulse" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-pink-400 shadow-xl shadow-orange-300/50">
                        <div className="h-8 w-8 rounded-full border-4 border-white/40 border-t-white animate-spin" />
                    </div>
                </div>
                <p className="text-base font-semibold text-gray-500 tracking-wide">Finding flatmates near you…</p>
            </div>
        );

    const profile = profiles[current];

    const toastStyles: Record<Toast["type"], string> = {
        match: "bg-gradient-to-r from-emerald-500 to-green-500 shadow-emerald-300/60",
        like: "bg-gradient-to-r from-orange-500 to-pink-500 shadow-orange-300/60",
        pass: "bg-gradient-to-r from-gray-400 to-slate-500 shadow-gray-300/40",
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 relative overflow-hidden">
            {/* Soft ambient blobs — matches homepage */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 -right-24 h-72 w-72 animate-pulse rounded-full bg-orange-200/40 blur-3xl" />
                <div className="absolute -bottom-32 -left-24 h-72 w-72 animate-pulse rounded-full bg-pink-100/50 blur-3xl" />
            </div>



            {/* Toast */}
            <div
                className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${toast
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
                    }`}
            >
                {toast && (
                    <div
                        className={`flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-bold text-white shadow-2xl border border-white/30 backdrop-blur-xl ${toastStyles[toast.type]}`}
                    >
                        <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                        {toast.msg}
                    </div>
                )}
            </div>

            {/* ── Main ── */}
            <main className="mx-auto flex max-w-lg flex-col items-center px-4 pb-24 pt-8">

                {/* Page header */}
                <div className="mb-8 w-full flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Browse <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Flatmates</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">Swipe right to like, left to pass</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-white/80 border border-orange-100 shadow-sm px-4 py-2 backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm font-semibold text-gray-700">{profiles.length} left</span>
                    </div>
                </div>

                {/* Hint pill */}
                <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/80 border border-orange-100 shadow-sm px-5 py-2 text-xs font-semibold text-gray-500 backdrop-blur-sm">
                    <span>👈 Pass</span>
                    <div className="h-px w-8 bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
                    <span>Like ❤️ 👉</span>
                </div>

                {/* ── Empty state ── */}
                {!profile ? (
                    <div className="w-full rounded-3xl bg-white/80 border border-orange-100/60 shadow-xl shadow-orange-100/50 backdrop-blur-sm p-12 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-pink-100 shadow-inner">
                            <span className="text-5xl">✨</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">You're all caught up!</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed max-w-xs mx-auto">
                            New flatmates join every day. Check back tomorrow for fresh profiles!
                        </p>
                        <a
                            href="/matches"
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/50 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            See your matches →
                        </a>
                    </div>
                ) : (
                    <>
                        {/* ── Profile Card ── */}
                        <div className="w-full group/card relative">
                            {/* Glow halo */}
                            <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-300/30 to-pink-300/30 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10" />

                            <div className="overflow-hidden rounded-3xl bg-white/90 border border-orange-100/80 shadow-2xl shadow-orange-200/40 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300">

                                {/* ── Photo ── */}
                                <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100">
                                    {profile.photo_url ? (
                                        <img
                                            src={profile.photo_url}
                                            alt={profile.name}
                                            className="h-full w-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <span className="text-8xl">👤</span>
                                        </div>
                                    )}

                                    {/* Top badges */}
                                    <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-between px-5">
                                        <span className="rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 px-4 py-2 text-xs font-bold text-gray-700 shadow-sm">
                                            📍 {profile.locality}, {profile.city}
                                        </span>
                                        <span className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-xs font-bold text-white shadow-lg">
                                            ₹{profile.budget_min}k–{profile.budget_max}k
                                        </span>
                                    </div>

                                    {/* Bottom fade */}
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 to-transparent" />
                                </div>

                                {/* ── Info ── */}
                                <div className="px-7 pt-4 pb-6 space-y-5">
                                    {/* Name row */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                                {profile.name}
                                            </h2>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-sm text-gray-500">{profile.age} yrs</span>
                                                {profile.occupation && (
                                                    <>
                                                        <span className="text-gray-300">·</span>
                                                        <span className="rounded-full bg-orange-50 border border-orange-200/60 px-3 py-0.5 text-xs font-semibold text-orange-600">
                                                            {profile.occupation}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-0.5">Budget / mo</p>
                                            <p className="text-base font-bold text-emerald-600">
                                                ₹{profile.budget_min.toLocaleString()}–{profile.budget_max.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    {profile.bio && (
                                        <p className="text-sm text-gray-600 leading-relaxed rounded-2xl bg-orange-50/60 border border-orange-100/60 p-4">
                                            {profile.bio}
                                        </p>
                                    )}

                                    {/* Lifestyle tags */}
                                    {profile.lifestyle_tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.lifestyle_tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-white border border-orange-200/70 px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm hover:bg-orange-50 hover:border-orange-300 transition-colors duration-150"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ── Swipe Buttons ── */}
                                <div className="border-t border-orange-100/60 bg-orange-50/40 px-7 py-5">
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Pass */}
                                        <button
                                            onClick={() => swipe("left")}
                                            disabled={swiping}
                                            className="group flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white py-4 text-sm font-bold text-gray-500 shadow-sm hover:border-red-300 hover:bg-red-50 hover:text-red-500 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        >
                                            <span className="text-lg group-hover:-rotate-12 transition-transform duration-200">✕</span>
                                            Pass
                                        </button>

                                        {/* Like */}
                                        <button
                                            onClick={() => swipe("right")}
                                            disabled={swiping}
                                            className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/60 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        >
                                            <span className="text-lg group-hover:scale-125 transition-transform duration-200">❤️</span>
                                            Like
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Profile counter ── */}
                        <div className="mt-8 flex items-center gap-5 rounded-2xl bg-white/80 border border-orange-100 shadow-sm px-6 py-3 backdrop-blur-sm">
                            <button
                                disabled={current === 0}
                                onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-white text-gray-500 shadow-sm hover:bg-orange-50 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <span className="text-sm font-bold text-gray-700 min-w-[64px] text-center">
                                {current + 1} <span className="text-gray-400 font-normal">of</span> {profiles.length}
                            </span>

                            <button
                                disabled={current >= profiles.length - 1}
                                onClick={() => setCurrent((prev) => Math.min(prev + 1, profiles.length - 1))}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-white text-gray-500 shadow-sm hover:bg-orange-50 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
