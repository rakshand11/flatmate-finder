import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

interface Message {
    id: string;
    content: string;
    sender_id: string;
    sender_name: string;
    sent_at: string;
    is_read: boolean;
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


    if (loading) return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-orange-200/50 blur-2xl animate-pulse" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 shadow-lg shadow-orange-300/50">
                    <div className="h-7 w-7 rounded-full border-4 border-white/40 border-t-white animate-spin" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400 tracking-wide">Loading chat…</p>
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

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-20 -right-20 h-64 w-64 animate-pulse rounded-full bg-orange-200/30 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 animate-pulse rounded-full bg-pink-100/40 blur-3xl" />
            </div>

            {/* ── Header ── */}
            <header className="flex-shrink-0 flex items-center gap-4 bg-white/90 backdrop-blur-xl border-b border-orange-100/60 px-4 py-4 shadow-sm shadow-orange-100/30">
                <button
                    onClick={() => window.history.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200/60 bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors duration-150 text-sm font-bold flex-shrink-0"
                >
                    ←
                </button>

                {/* Avatar */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 text-lg shadow-sm">
                    👤
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-gray-900 truncate">{otherName}</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                        Active now
                    </p>
                </div>

                {/* Match badge */}
                <span className="flex-shrink-0 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200/60 px-3 py-1 text-xs font-semibold text-orange-600">
                    ❤️ Match
                </span>
            </header>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center pt-16">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-pink-100 shadow-inner text-3xl">
                            👋
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 mb-1">Say hello!</p>
                            <p className="text-sm text-gray-400">You matched — start the conversation.</p>
                        </div>
                    </div>
                ) : (
                    groupedMessages.map(({ date, msgs }) => (
                        <div key={date} className="space-y-3">
                            {/* Date divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-orange-100" />
                                <span className="text-xs text-gray-400 font-medium px-2">{date}</span>
                                <div className="flex-1 h-px bg-orange-100" />
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
                                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-pink-100 text-sm mb-1">
                                                👤
                                            </div>
                                        )}

                                        <div className={`flex flex-col gap-1 max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
                                            {!isMe && (
                                                <span className="text-xs font-semibold text-orange-500 px-1">
                                                    {msg.sender_name}
                                                </span>
                                            )}
                                            <div
                                                className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${isMe
                                                    ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-2xl rounded-br-sm shadow-orange-300/40"
                                                    : "bg-white/90 text-gray-800 border border-orange-100/60 rounded-2xl rounded-bl-sm backdrop-blur-sm"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                            <span className={`text-[10px] px-1 ${isMe ? "text-gray-400" : "text-gray-400"}`}>
                                                {time}
                                                {isMe && (
                                                    <span className="ml-1 text-orange-400">
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
            <div className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-orange-100/60 px-4 py-4 shadow-[0_-4px_24px_rgba(251,146,60,0.08)]">
                <form onSubmit={sendMessage} className="flex items-center gap-3">
                    <input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type a message…"
                        className="flex-1 rounded-2xl border border-orange-200/60 bg-orange-50/60 px-5 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300/60 focus:border-orange-300 transition-all duration-150"
                    />
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/50 hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200"
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