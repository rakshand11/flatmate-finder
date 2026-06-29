import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

interface Message {
    id: string;
    content: string;
    sender_id: string;
    sender_name: string;
    sent_at: string;
    is_read: boolean;
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

export default function ChatPage() {
    const { match_id } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [myId, setMyId] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        API.get("/profile/get")
            .then((res) => setMyId(res.data.profile?.user_id || ""))
            .catch(console.error);

        API.get(`/message/get-message/${match_id}`)
            .then((res) => setMessages(res.data.messages || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [match_id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            const res = await API.post("/message/send-message", { match_id, content });
            setMessages((prev) => [...prev, res.data.message]);
            setContent("");
        } catch (err) {
            console.error(err);
        }
    };

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
                    Loading chat…
                </p>
            </div>
        );

    const groupedMessages: { date: string; msgs: Message[] }[] = [];
    messages.forEach((msg) => {
        const date = new Date(msg.sent_at).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });
        const last = groupedMessages[groupedMessages.length - 1];
        if (last && last.date === date) {
            last.msgs.push(msg);
        } else {
            groupedMessages.push({ date, msgs: [msg] });
        }
    });

    const otherName = messages.find((m) => m.sender_id !== myId)?.sender_name || "Chat";
    const monogram = getMonogram(otherName);

    return (
        <div
            className="flex flex-col h-screen bg-[#15111F] relative overflow-hidden"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            <style>{FONT_IMPORT}</style>

            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-[#C8FF4D]/10 blur-[100px]" />
                <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#FF6B6B]/10 blur-[100px]" />
            </div>

            {/* ── Header ── */}
            <header className="flex-shrink-0 relative z-10 flex items-center gap-4 bg-[#1D1829]/95 backdrop-blur-xl border-b border-[#2E2640] px-4 py-4 shadow-lg shadow-black/30">
                <button
                    onClick={() => window.history.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2E2640] bg-[#211C2E] text-[#9D93B8] hover:border-[#C8FF4D]/40 hover:text-[#C8FF4D] transition-colors duration-150 text-sm font-bold flex-shrink-0"
                >
                    ←
                </button>

                {/* Avatar */}
                <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-base font-bold text-[#15111F]/85 shadow-sm"
                    style={{ backgroundImage: `linear-gradient(135deg, ${monogram.from} 0%, ${monogram.to} 100%)` }}
                >
                    {monogram.initial}
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-[#F4F1FF] truncate">{otherName}</h2>
                    <p
                        className="text-xs text-[#9D93B8] flex items-center gap-1.5"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C8FF4D] animate-pulse" />
                        Active now
                    </p>
                </div>

                {/* Match badge */}
                <span
                    className="flex-shrink-0 rounded-full bg-[#C8FF4D]/10 border border-[#C8FF4D]/30 px-3 py-1.5 text-xs font-bold text-[#C8FF4D]"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                >
                    ❤️ Match
                </span>
            </header>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 relative z-10">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center pt-16">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1D1829] border border-[#2E2640] shadow-inner text-3xl">
                            👋
                        </div>
                        <div>
                            <p className="font-bold text-[#F4F1FF] mb-1">Say hello!</p>
                            <p className="text-sm text-[#9D93B8]">You matched — start the conversation.</p>
                        </div>
                    </div>
                ) : (
                    groupedMessages.map(({ date, msgs }) => (
                        <div key={date} className="space-y-3">
                            {/* Date divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-[#2E2640]" />
                                <span
                                    className="text-xs text-[#6E6585] font-medium px-2"
                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                >
                                    {date}
                                </span>
                                <div className="flex-1 h-px bg-[#2E2640]" />
                            </div>

                            {msgs.map((msg) => {
                                const isMe = msg.sender_id === myId;
                                const time = new Date(msg.sent_at).toLocaleTimeString([], {
                                    hour: "2-digit", minute: "2-digit",
                                });

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        {/* Other person avatar */}
                                        {!isMe && (
                                            <div
                                                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#15111F]/85 mb-1"
                                                style={{ backgroundImage: `linear-gradient(135deg, ${monogram.from} 0%, ${monogram.to} 100%)` }}
                                            >
                                                {monogram.initial}
                                            </div>
                                        )}

                                        <div className={`flex flex-col gap-1 max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
                                            {!isMe && (
                                                <span
                                                    className="text-xs font-semibold text-[#C8FF4D] px-1"
                                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                                >
                                                    {msg.sender_name}
                                                </span>
                                            )}
                                            <div
                                                className={`px-4 py-3 text-sm leading-relaxed shadow-md ${isMe
                                                    ? "bg-[#C8FF4D] text-[#15111F] rounded-2xl rounded-br-sm shadow-[#C8FF4D]/10"
                                                    : "bg-[#1D1829] text-[#F4F1FF] border border-[#2E2640] rounded-2xl rounded-bl-sm"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                            <span
                                                className="text-[10px] px-1 text-[#6E6585]"
                                                style={{ fontFamily: "'Space Mono', monospace" }}
                                            >
                                                {time}
                                                {isMe && (
                                                    <span className="ml-1 text-[#C8FF4D]">
                                                        {msg.is_read ? "✓✓" : "✓"}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* ── Input bar ── */}
            <div className="flex-shrink-0 relative z-10 bg-[#1D1829]/95 backdrop-blur-xl border-t border-[#2E2640] px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
                <form onSubmit={sendMessage} className="flex items-center gap-3">
                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type a message…"
                        className="flex-1 rounded-2xl border border-[#2E2640] bg-[#211C2E] px-5 py-3 text-sm text-[#F4F1FF] placeholder-[#6E6585] focus:outline-none focus:ring-2 focus:ring-[#C8FF4D]/40 focus:border-[#C8FF4D]/60 transition-all duration-150"
                    />
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#C8FF4D] text-[#15111F] shadow-lg hover:shadow-[0_0_30px_4px_rgba(200,255,77,0.35)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200"
                    >
                        <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}