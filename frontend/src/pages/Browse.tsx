
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
        setTimeout(() => setToast(null), 2500);
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
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-50">
                <div className="flex items-center gap-3 rounded-full bg-white px-5 py-2 shadow-sm">
                    <span className="h-3 w-3 animate-ping rounded-full bg-orange-400" />
                    <p className="text-sm text-gray-500">Loading profiles for you…</p>
                </div>
            </div>
        );

    const profile = profiles[current];

    const toastStyles = {
        match: "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-400/30",
        like: "bg-gradient-to-r from-orange-500 to-pink-500 shadow-orange-400/30",
        pass: "bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-400/20",
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 via-white to-orange-50 px-4 py-4">
            {/* Toast */}
            <div
                className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                {toast && (
                    <div
                        className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-lg ${toastStyles[toast.type]
                            }`}
                    >
                        {toast.msg}
                    </div>
                )}
            </div>

            {/* Top bar */}
            <header className="mx-auto flex w-full max-w-md items-center justify-between pb-4">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        Online
                    </span>
                    <span className="rounded-full bg-white/70 px-3 py-1 shadow-sm">
                        {profiles.length} left
                    </span>
                </div>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center px-4">
                {/* Title + branding */}
                <div className="mb-5 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Find your flatmate

                    </h1>
                    <p className="text-sm text-gray-500">Swipe right to like, left to pass.</p>
                </div>

                {!profile ? (
                    <div className="flex w-full max-w-md flex-col items-center rounded-3xl bg-white/80 p-10 text-center shadow-lg shadow-orange-100">
                        <p className="mb-3 text-4xl">😴</p>
                        <p className="text-gray-600">You're all caught up!</p>
                        <p className="mt-1 text-xs text-gray-400">
                            No more profiles for now. New people join every day.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Card */}
                        <div className="relative w-full max-w-md mt-4">
                            <div className="pointer-events-none absolute inset-x-6 -bottom-3 -top-3 -z-10 rounded-[32px] bg-gradient-to-b from-orange-200/40 via-transparent to-orange-200/40 blur-xl" />
                            <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-orange-200/60 ring-1 ring-orange-100">
                                {/* Photo */}
                                <div className="relative h-80 w-full bg-orange-100">
                                    {profile.photo_url ? (
                                        <img
                                            src={profile.photo_url}
                                            alt={profile.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <span className="text-6xl">👤</span>
                                        </div>
                                    )}
                                    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 text-[11px] text-white">
                                        <span className="rounded-full bg-black/30 px-3 py-1 backdrop-blur">
                                            {profile.locality}, {profile.city}
                                        </span>
                                        <span className="rounded-full bg-black/30 px-3 py-1 backdrop-blur">
                                            ₹{profile.budget_min}–{profile.budget_max}
                                        </span>
                                    </div>
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="space-y-3 p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {profile.name}, {profile.age}
                                            </h2>
                                            {profile.occupation && (
                                                <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.15em] text-orange-400">
                                                    {profile.occupation}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end text-[11px] text-gray-400">
                                            <span>Budget per month</span>
                                            <span className="font-semibold text-gray-700">
                                                ₹{profile.budget_min.toLocaleString()} – {profile.budget_max.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {profile.bio && (
                                        <p className="text-sm text-gray-600 line-clamp-3">{profile.bio}</p>
                                    )}

                                    {profile.lifestyle_tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {profile.lifestyle_tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-500"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Swipe buttons */}
                                <div className="flex items-center justify-between gap-4 border-t border-orange-50 px-5 py-4">
                                    <button
                                        onClick={() => swipe("left")}
                                        disabled={swiping}
                                        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-xl text-gray-400 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-400 disabled:opacity-60"
                                    >
                                        ✕
                                    </button>
                                    <span className="text-[11px] text-gray-400">
                                        Tap ♥ to like, ✕ to pass
                                    </span>
                                    <button
                                        onClick={() => swipe("right")}
                                        disabled={swiping}
                                        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 text-xl text-white shadow-lg shadow-orange-400/40 transition hover:-translate-y-0.5 hover:shadow-orange-500/50 disabled:opacity-60"
                                    >
                                        ♥
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <button
                                disabled={current === 0}
                                onClick={() => setCurrent((prev) => (prev > 0 ? prev - 1 : prev))}
                                className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm transition hover:border-orange-200 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ← Previous
                            </button>
                            <span className="text-xs text-gray-400">
                                {current + 1} / {profiles.length}
                            </span>
                            <button
                                disabled={current >= profiles.length - 1}
                                onClick={() =>
                                    setCurrent((prev) => (prev < profiles.length - 1 ? prev + 1 : prev))
                                }
                                className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm transition hover:border-orange-200 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next →
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}