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
        // get current user id
        API.get("http://localhost:5000/profile/get")
            .then((res) => setMyId(res.data.profile?.user_id || ""))
            .catch(console.error);

        // get messages
        API.get(`http://localhost:5000/message/get-message/${match_id}`)
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
            const res = await API.post("http://localhost:5000/message/send-message", { match_id, content });
            setMessages((prev) => [...prev, res.data.message]);
            setContent("");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center">
            <p className="text-gray-400">Loading chat...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-orange-50 flex flex-col">
            <div className="bg-white border-b px-4 py-4 flex items-center gap-3 shadow-sm">
                <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600">←</button>
                <h2 className="font-semibold text-gray-800">Chat</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        No messages yet. Say hi!
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.sender_id === myId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${isMe
                                ? "bg-orange-500 text-white rounded-br-sm"
                                : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                                }`}>
                                {!isMe && (
                                    <p className="text-orange-400 text-xs font-medium mb-1">{msg.sender_name}</p>
                                )}
                                <p>{msg.content}</p>
                                <p className={`text-xs mt-1 ${isMe ? "text-orange-100" : "text-gray-400"}`}>
                                    {new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={sendMessage} className="bg-white border-t px-4 py-3 flex gap-3">
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
                    Send
                </button>
            </form>
        </div>
    );
}