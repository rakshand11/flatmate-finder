import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { to: "/browse", label: "Browse", icon: "🎯" },
        { to: "/matches", label: "Matches", icon: "💖" },
        { to: "/chat", label: "Chat", icon: "💬" },
        { to: "/my-profile", label: "Profile", icon: "👤" },
    ];

    const logout = async () => {
        await API.post("/user/logout");
        navigate("/login");
    };

    return (
        <>
            <style>{FONT_IMPORT}</style>
            <aside
                className="hidden w-56 flex-shrink-0 lg:flex lg:flex-col bg-[#0E0B17] border-r border-[#2E2640]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-[#2E2640] px-6">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C8FF4D] text-base shadow-lg shadow-[#C8FF4D]/20">
                            🏠
                        </span>
                        <span className="text-lg font-black text-[#F4F1FF] tracking-tight">
                            flat<span className="text-[#C8FF4D]">mate</span>
                        </span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex flex-1 flex-col px-3 py-5 gap-1">
                    {navItems.map((item) => {
                        const isActive =
                            location.pathname === item.to ||
                            (item.to === "/chat" && location.pathname.startsWith("/chat/"));

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                                        ? "bg-[#C8FF4D]/10 border border-[#C8FF4D]/30 text-[#C8FF4D]"
                                        : "text-[#9D93B8] hover:text-[#F4F1FF] hover:bg-[#1D1829] border border-transparent"
                                    }`}
                            >
                                {/* Active left bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[#C8FF4D]" />
                                )}

                                <span
                                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm transition-all duration-200 ${isActive
                                            ? "bg-[#C8FF4D]/20"
                                            : "bg-[#1D1829] group-hover:bg-[#2A2438]"
                                        }`}
                                >
                                    {item.icon}
                                </span>

                                <span>{item.label}</span>

                                {isActive && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C8FF4D] animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-3 pb-5 space-y-2">
                    {/* Tip */}
                    <div className="rounded-2xl bg-[#1D1829] border border-[#2E2640] p-4">
                        <p
                            className="text-xs text-[#C8FF4D] font-bold mb-1"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            💡 tip
                        </p>
                        <p className="text-xs text-[#6E6585] leading-relaxed">
                            Swipe right on profiles you like to find your perfect flatmate!
                        </p>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="group flex w-full items-center gap-3 rounded-2xl border border-[#2E2640] bg-[#1D1829] px-4 py-3 text-sm font-semibold text-[#6E6585] hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/10 hover:text-[#FF8A8A] transition-all duration-200"
                    >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#211C2E] text-sm group-hover:scale-110 transition-transform duration-200">
                            🚪
                        </span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}