import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

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

export default function MyProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        API.get("http://localhost:5000/profile/get")
            .then((res) => setProfile(res.data.profile))
            .catch((err) => setError(err.response?.data?.msg || "Failed to load profile"))
            .finally(() => setLoading(false));
    }, []);

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-orange-200/50 blur-2xl animate-pulse" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 shadow-lg shadow-orange-300/50">
                    <div className="h-7 w-7 rounded-full border-4 border-white/40 border-t-white animate-spin" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400">Loading your profile…</p>
        </div>
    );

    // ── Error ────────────────────────────────────────────────────────────────
    if (error || !profile) return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 border border-red-100 text-3xl">
                😕
            </div>
            <p className="font-semibold text-gray-700">{error || "No profile found"}</p>
            <Link
                to="/edit-profile"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-300/50 hover:-translate-y-0.5 transition-all duration-200"
            >
                Create profile →
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 -right-24 h-72 w-72 animate-pulse rounded-full bg-orange-200/40 blur-3xl" />
                <div className="absolute -bottom-32 -left-24 h-72 w-72 animate-pulse rounded-full bg-pink-100/50 blur-3xl" />
            </div>

            <div className="mx-auto max-w-lg px-4 py-10">

                {/* Page title */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            My{" "}
                            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                Profile
                            </span>
                        </h1>
                        <p className="text-sm text-gray-400 mt-0.5">This is how others see you</p>
                    </div>
                    <Link
                        to="/edit-profile"
                        className="inline-flex items-center gap-2 rounded-2xl border border-orange-200/70 bg-white/90 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm hover:bg-orange-50 hover:shadow-md transition-all duration-200"
                    >
                        ✏️ Edit
                    </Link>
                </div>

                {/* ── Card ── */}
                <div className="overflow-hidden rounded-3xl bg-white/90 border border-orange-100/60 shadow-2xl shadow-orange-200/40 backdrop-blur-sm">

                    {/* Photo */}
                    <div className="relative h-72 w-full bg-gradient-to-br from-orange-100 to-pink-100 overflow-hidden">
                        {profile.photo_url ? (
                            <img
                                src={profile.photo_url}
                                alt={profile.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <span className="text-8xl">👤</span>
                            </div>
                        )}

                        {/* Budget badge */}
                        {profile.budget_min !== undefined && profile.budget_max !== undefined && (
                            <span className="absolute top-5 right-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-xs font-bold text-white shadow-lg">
                                ₹{profile.budget_min}k–{profile.budget_max}k
                            </span>
                        )}

                        {/* Bottom fade */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/90 to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="px-7 pt-4 pb-7 space-y-5">

                        {/* Name row */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                    {profile.name}{profile.age ? `, ${profile.age}` : ""}
                                </h2>
                                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    {(profile.city || profile.locality) && (
                                        <span className="text-sm text-gray-400">
                                            📍 {[profile.locality, profile.city].filter(Boolean).join(", ")}
                                        </span>
                                    )}
                                    {profile.occupation && (
                                        <>
                                            <span className="text-gray-200">·</span>
                                            <span className="rounded-full bg-orange-50 border border-orange-200/60 px-3 py-0.5 text-xs font-semibold text-orange-600">
                                                {profile.occupation}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-orange-100/60" />

                        {/* Bio */}
                        {profile.bio && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-2">About</p>
                                <p className="text-sm text-gray-600 leading-relaxed rounded-2xl bg-orange-50/60 border border-orange-100/60 p-4">
                                    {profile.bio}
                                </p>
                            </div>
                        )}

                        {/* Lifestyle tags */}
                        {profile.lifestyle_tags && profile.lifestyle_tags.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3">Lifestyle</p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.lifestyle_tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-white border border-orange-200/70 px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-orange-100/60" />

                        {/* Edit CTA */}
                        <Link
                            to="/edit-profile"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                        >
                            ✏️ Edit Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}