import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

interface Match {
    match_id: string;
    name: string;
    age: number;
    city: string;
    occupation: string;
    photo_url?: string;
    matched_at: string;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/matches/get")
            .then((res) => setMatches(res.data.matches || []))
            .catch(console.error)
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
            <p className="text-sm font-semibold text-gray-400 tracking-wide">Loading your matches…</p>
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

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Your{" "}
                            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                Matches
                            </span>
                        </h1>
                        {matches.length > 0 && (
                            <span className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-0.5 text-xs font-bold text-white shadow-sm shadow-orange-300/40">
                                {matches.length}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400">
                        {matches.length === 0
                            ? "Keep swiping to find your flatmate!"
                            : `${matches.length} ${matches.length === 1 ? "person" : "people"} liked you back · Tap to chat`}
                    </p>
                </div>

                {/* ── Empty state ── */}
                {matches.length === 0 ? (
                    <div className="rounded-3xl bg-white/90 border border-orange-100/60 shadow-xl shadow-orange-100/40 p-12 text-center backdrop-blur-sm">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-pink-100 shadow-inner">
                            <span className="text-4xl">💔</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">No matches yet</h2>
                        <p className="text-sm text-gray-400 leading-relaxed mb-7">
                            New flatmates join every day.<br />Keep swiping to find your match!
                        </p>
                        <button
                            onClick={() => navigate("/browse")}
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                        >
                            Browse flatmates →
                        </button>
                    </div>
                ) : (
                    /* ── Match list ── */
                    <div className="space-y-3">
                        {matches.map((match) => {
                            const matchedDate = new Date(match.matched_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                            });

                            return (
                                <div
                                    key={match.match_id}
                                    onClick={() => navigate(`/chat/${match.match_id}`)}
                                    className="group flex cursor-pointer items-center gap-4 rounded-2xl bg-white/90 border border-orange-100/60 p-4 shadow-md shadow-orange-100/30 backdrop-blur-sm hover:shadow-xl hover:shadow-orange-200/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 shadow-sm">
                                            {match.photo_url ? (
                                                <img
                                                    src={match.photo_url}
                                                    alt={match.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-2xl">
                                                    👤
                                                </div>
                                            )}
                                        </div>
                                        {/* Match badge */}
                                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-[10px] shadow-sm border-2 border-white">
                                            ❤️
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline gap-1.5">
                                            <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-150">
                                                {match.name}
                                            </h3>
                                            <span className="text-sm text-gray-400">{match.age}</span>
                                        </div>
                                        <p className="mt-0.5 truncate text-sm text-gray-400">
                                            {match.occupation}
                                            {match.occupation && match.city ? " · " : ""}
                                            {match.city}
                                        </p>
                                    </div>

                                    {/* Right side */}
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <span className="text-xs text-gray-300">{matchedDate}</span>
                                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 border border-orange-200/60 text-orange-400 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-200 text-sm font-bold">
                                            →
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
