
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
            .catch((err) => {
                console.error("Failed to load chat list", err);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-80 items-center justify-center text-gray-500">
                Loading your chats...
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className="flex min-h-80 flex-col items-center justify-center text-center text-gray-500">
                <span className="text-4xl mb-2">💬</span>
                <h2 className="text-lg font-medium mb-1">No chats yet</h2>
                <p className="text-sm">You’ll see chat list here after messaging matches.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Chats</h2>
            {chats.map((chat) => (
                <Link
                    key={`chat-${chat.match_id}`}
                    to={`/chat/${chat.match_id}`}
                    className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm hover:bg-orange-50 transition"
                >
                    <span className="text-2xl">👤</span>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{chat.other_user_name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                            Last message at {new Date(chat.last_message_time).toLocaleTimeString()}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}