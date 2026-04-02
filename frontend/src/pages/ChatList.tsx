import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

interface Chat {
    match_id: string;
    user1_id: string;
    user2_id: string;
    other_user_name: string;
    last_message_time: string;
}

export default function ChatListPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/message/chat-list")
            .then((res) => setChats(res.data.chats || []))
            .catch((err) => console.error("Failed to load chat list", err))
            .finally(() => setLoading(false));
    }, []);


    if (loading) return (
        <div className="flex min-h-80 flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-orange-200/50 blur-2xl animate-pulse" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 shadow-lg shadow-orange-300/50">
                    <div className="h-6 w-6 rounded-full border-4 border-white/40 border-t-white animate-spin" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400">Loading your chats…</p>
        </div>
    );


    if (chats.length === 0) return (
        <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-100 to-pink-100 shadow-inner text-3xl">
                💬
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">No chats yet</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Start chatting with your matches<br />and they'll show up here.
                </p>
            </div>
            <Link
                to="/matches"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
                See matches →
            </Link>
        </div>
    );


    return (
        <div className="flex flex-col gap-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                        Messages
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{chats.length} active conversation{chats.length !== 1 ? "s" : ""}</p>
                </div>
                <span className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-0.5 text-xs font-bold text-white shadow-sm shadow-orange-300/40">
                    {chats.length}
                </span>
            </div>

            {/* List */}
            <div className="space-y-2">
                {chats.map((chat) => {
                    const msgTime = new Date(chat.last_message_time);
                    const now = new Date();
                    const isToday = msgTime.toDateString() === now.toDateString();
                    const timeLabel = isToday
                        ? msgTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : msgTime.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

                    // Generate a consistent avatar color from name
                    const colors = [
                        "from-orange-200 to-pink-200",
                        "from-blue-100 to-purple-100",
                        "from-green-100 to-emerald-100",
                        "from-yellow-100 to-orange-100",
                    ];
                    const colorIdx = chat.other_user_name.charCodeAt(0) % colors.length;

                    return (
                        <Link
                            key={`chat-${chat.match_id}`}
                            to={`/chat/${chat.match_id}`}
                            className="group flex items-center gap-4 rounded-2xl bg-white/90 border border-orange-100/60 px-4 py-3.5 shadow-md shadow-orange-100/30 backdrop-blur-sm hover:shadow-xl hover:shadow-orange-200/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colors[colorIdx]} text-xl shadow-sm`}>
                                    👤
                                </div>
                                {/* Online dot */}
                                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-400 border-2 border-white" />
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-150 truncate">
                                    {chat.other_user_name}
                                </p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                    Tap to continue the conversation
                                </p>
                            </div>

                            {/* Right */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <span className="text-[10px] text-gray-300 font-medium">{timeLabel}</span>
                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-50 border border-orange-200/60 text-orange-400 text-xs font-bold group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-200">
                                    →
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
