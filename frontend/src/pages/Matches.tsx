import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

interface Match {
    match_id: string;
    name: string;
    age: number;
    city: string;
    occupation: string;
    photo_url?: string;
    matched_at: string;
    lifestyle_tags?: string[];
    last_message_at?: string; 
}

type FilterTab = "all" | "new" | "chatting";

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

function isRecent(dateStr: string, days = 3) {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff <= days * 24 * 60 * 60 * 1000;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<FilterTab>("all");
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/matches/get")
            .then((res) => setMatches(res.data.matches || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const newCount = matches.filter((m) => isRecent(m.matched_at)).length;
    const chattingCount = matches.filter((m) => !!m.last_message_at).length;

    const visibleMatches = matches.filter((m) => {
        if (tab === "new") return isRecent(m.matched_at);
        if (tab === "chatting") return !!m.last_message_at;
        return true;
    });

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
                    Loading your matches…
                </p>
            </div>
        );

    return (
        <div
            className="min-h-screen w-full bg-[#15111F] relative overflow-hidden"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            <style>{FONT_IMPORT}</style>

            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#C8FF4D]/10 blur-[100px]" />
                <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#FF6B6B]/15 blur-[100px]" />
            </div>

            <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10 relative z-10">

                {/* Header */}
                <div className="mb-7">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#C8FF4D] animate-pulse" />
                        <span
                            className="text-xs uppercase tracking-[0.2em] text-[#9D93B8]"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            Matches
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#F4F1FF] leading-tight">
                        People who{" "}
                        <span className="text-[#C8FF4D]">liked you back.</span>
                    </h1>
                    <p className="text-sm text-[#9D93B8] mt-0.5">
                        {matches.length === 0
                            ? "Keep swiping to find your flatmate!"
                            : `${matches.length} match${matches.length > 1 ? "es" : ""} · tap any card to start chatting`}
                    </p>
                </div>

                {/* ── Filter tabs ── */}
                {matches.length > 0 && (
                    <div
                        className="mb-6 flex items-center gap-2 flex-wrap"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        {([
                            { key: "all", label: "All", count: matches.length },
                            { key: "new", label: "New", count: newCount },
                            { key: "chatting", label: "Chatting", count: chattingCount },
                        ] as { key: FilterTab; label: string; count: number }[]).map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-150 ${tab === t.key
                                        ? "bg-[#C8FF4D] text-[#15111F]"
                                        : "bg-[#1D1829] border border-[#2E2640] text-[#9D93B8] hover:border-[#3A324D] hover:text-[#F4F1FF]"
                                    }`}
                            >
                                {t.label} {t.count}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Empty state ── */}
                {matches.length === 0 ? (
                    <div className="rounded-[28px] bg-[#1D1829] border border-[#2E2640] shadow-2xl shadow-black/60 p-16 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#2A2438] border border-[#3A324D]">
                            <span className="text-5xl">💔</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#F4F1FF] mb-3">No matches yet</h2>
                        <p className="text-[#9D93B8] mb-8 leading-relaxed max-w-xs mx-auto text-sm">
                            New flatmates join every day. Keep swiping to find your match!
                        </p>
                        <button
                            onClick={() => navigate("/browse")}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#C8FF4D] px-8 py-4 text-sm font-bold text-[#15111F] hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                        >
                            Browse flatmates →
                        </button>
                    </div>
                ) : visibleMatches.length === 0 ? (
                    <div className="rounded-[28px] bg-[#1D1829] border border-[#2E2640] p-12 text-center">
                        <p className="text-[#9D93B8] text-sm">No matches in this filter yet.</p>
                    </div>
                ) : (
                    /* ── Match list ── */
                    <div className="space-y-3">
                        {visibleMatches.map((match) => {
                            const matchedDate = new Date(match.matched_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                            });
                            const { from, to, initial } = getMonogram(match.name);
                            const isNew = isRecent(match.matched_at);

                            return (
                                <div
                                    key={match.match_id}
                                    onClick={() => navigate(`/chat/${match.match_id}`)}
                                    className="group flex cursor-pointer items-center gap-4 rounded-2xl bg-[#1D1829] border border-[#2E2640] p-4 shadow-lg shadow-black/30 hover:border-[#C8FF4D]/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="h-14 w-14 overflow-hidden rounded-2xl shadow-sm">
                                            {match.photo_url ? (
                                                <img
                                                    src={match.photo_url}
                                                    alt={match.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-full w-full items-center justify-center text-xl font-bold text-[#15111F]/85"
                                                    style={{
                                                        backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
                                                    }}
                                                >
                                                    {initial}
                                                </div>
                                            )}
                                        </div>
                                        {/* Match badge */}
                                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C8FF4D] text-[10px] shadow-sm border-2 border-[#1D1829]">
                                            ❤️
                                        </span>
                                        {isNew && (
                                            <span className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-[#FF6B6B] border-2 border-[#1D1829]" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <h3 className="font-bold text-[#F4F1FF] group-hover:text-[#C8FF4D] transition-colors duration-150 truncate">
                                                {match.name}
                                            </h3>
                                            <span
                                                className="text-sm text-[#9D93B8]"
                                                style={{ fontFamily: "'Space Mono', monospace" }}
                                            >
                                                {match.age}
                                            </span>
                                            {isNew && (
                                                <span
                                                    className="rounded-full bg-[#C8FF4D]/15 border border-[#C8FF4D]/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#C8FF4D]"
                                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                                >
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 truncate text-sm text-[#6E6585]">
                                            {match.occupation}
                                            {match.occupation && match.city ? " · " : ""}
                                            {match.city}
                                        </p>
                                        {match.lifestyle_tags && match.lifestyle_tags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {match.lifestyle_tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full bg-[#211C2E] border border-[#2E2640] px-2.5 py-1 text-[10px] font-semibold text-[#C8FF4D]"
                                                        style={{ fontFamily: "'Space Mono', monospace" }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right side */}
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <span
                                            className="text-xs text-[#6E6585]"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            {matchedDate}
                                        </span>
                                        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#2E2640] bg-[#211C2E] text-[#6E6585] group-hover:bg-[#C8FF4D] group-hover:text-[#15111F] group-hover:border-[#C8FF4D] transition-all duration-200 text-sm font-bold">
                                            →
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}