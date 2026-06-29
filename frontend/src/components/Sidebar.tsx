import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

// ─── Types ──────────────────────────────────────────────────────────────────

interface NavItem {
    to: string;
    label: string;
    icon: string;
    badge?: number; // unread count — pass 0 or omit to hide
}

interface SidebarProps {
    userName?: string;       // e.g. "Rohan M."
    matchCount?: number;     // new matches badge
    messageCount?: number;   // unread messages badge
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Sidebar({
    userName = "You",
    matchCount = 0,
    messageCount = 0,
}: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems: NavItem[] = [
        { to: "/browse", label: "Browse", icon: "🎯" },
        { to: "/matches", label: "Matches", icon: "💖", badge: matchCount },
        { to: "/chat", label: "Chat", icon: "💬", badge: messageCount },
        { to: "/my-profile", label: "Profile", icon: "👤" },
    ];

    const logout = async () => {
        await API.post("/user/logout");
        navigate("/login");
    };

    // Avatar initials from name
    const initials = userName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <style>{FONT_IMPORT}</style>
            <aside
                className="hidden w-[220px] flex-shrink-0 lg:flex lg:flex-col bg-[#0E0B17] border-r border-[#1A1428]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                {/* ── Logo ── */}
                <div className="px-[18px] pt-[18px] pb-[14px] border-b border-[#1A1428]">
                    <Link to="/" className="flex items-center gap-2.5">
                        {/* Icon with glow */}
                        <div
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#C8FF4D] text-base"
                            style={{ boxShadow: "0 0 16px rgba(200,255,77,0.25)" }}
                        >
                            🏠
                        </div>
                        <div>
                            <div className="text-[17px] font-black tracking-tight text-[#F4F1FF] leading-tight">
                                flat<span className="text-[#C8FF4D]">mate</span>
                            </div>
                            <div
                                className="text-[10px] text-[#6E6585] tracking-[0.1em] mt-0.5"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                FIND YOUR PERSON
                            </div>
                        </div>
                    </Link>
                </div>

                {/* ── Nav ── */}
                <nav className="flex flex-1 flex-col px-2.5 py-3 gap-0.5">
                    {navItems.map((item) => {
                        const isActive =
                            location.pathname === item.to ||
                            (item.to === "/chat" && location.pathname.startsWith("/chat/"));
                        const showBadge = item.badge && item.badge > 0;

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`group relative flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 transition-all duration-150 border ${isActive
                                        ? "bg-[#C8FF4D]/[0.08] border-[#C8FF4D]/[0.18]"
                                        : "border-transparent hover:bg-[#1A1428] hover:border-[#2E2640]"
                                    }`}
                            >
                                {/* Active left bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[#C8FF4D]" />
                                )}

                                {/* Icon pill */}
                                <div
                                    className={`flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] text-[15px] transition-all duration-150 ${isActive
                                            ? "bg-[#C8FF4D]/15"
                                            : "bg-[#1A1428] group-hover:bg-[#231D33]"
                                        }`}
                                >
                                    {item.icon}
                                </div>

                                {/* Label */}
                                <span
                                    className={`flex-1 text-[13px] font-semibold transition-colors duration-150 ${isActive ? "text-[#F4F1FF]" : "text-[#9D93B8] group-hover:text-[#F4F1FF]"
                                        }`}
                                >
                                    {item.label}
                                </span>

                                {/* Right indicator — badge or pulse dot */}
                                {showBadge ? (
                                    <span
                                        className="rounded-full bg-[#C8FF4D] px-1.5 py-px text-[9px] font-bold text-[#15111F] min-w-[18px] text-center"
                                        style={{ fontFamily: "'Space Mono', monospace" }}
                                    >
                                        {item.badge}
                                    </span>
                                ) : isActive ? (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#C8FF4D] animate-pulse" />
                                ) : null}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Divider ── */}
                <div className="mx-2.5 h-px bg-[#1A1428]" />

                {/* ── User section ── */}
                <div className="px-2.5 pt-3 pb-4 flex flex-col gap-2">

                    {/* User identity card */}
                    <div className="flex items-center gap-2.5 rounded-[14px] bg-[#1A1428] border border-[#2E2640] px-3 py-2.5">
                        {/* Avatar */}
                        <div
                            className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] text-[13px] font-bold text-[#15111F]"
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                background: "linear-gradient(135deg, #C8FF4D 0%, #7C3AED 100%)",
                            }}
                        >
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-[#F4F1FF] truncate leading-tight">
                                {userName}
                            </p>
                            <p
                                className="text-[10px] text-[#6E6585] mt-0.5"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                <span className="inline-block h-[5px] w-[5px] rounded-full bg-[#C8FF4D] mr-1 align-middle" />
                                Active now
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="group flex w-full items-center gap-2.5 rounded-[12px] border border-[#2E2640] bg-transparent px-3 py-2.5 text-left transition-all duration-150 hover:bg-[#FF6B6B]/[0.08] hover:border-[#FF6B6B]/30"
                    >
                        <span className="text-[14px]">🚪</span>
                        <span className="text-[12px] font-semibold text-[#6E6585] group-hover:text-[#FF8A8A] transition-colors duration-150">
                            Sign out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}