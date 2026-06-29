import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

interface NavItem {
    to: string;
    label: string;
    icon: string;
    badge?: number;
    description?: string;
}

interface SidebarProps {
    userName?: string;
    matchCount?: number;
    messageCount?: number;
}

export default function Sidebar({
    userName = "You",
    matchCount = 0,
    messageCount = 0,
}: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems: NavItem[] = [
        { to: "/browse", label: "Browse", icon: "🎯", description: "Find flatmates" },
        { to: "/matches", label: "Matches", icon: "💖", badge: matchCount, description: "Your connections" },
        { to: "/chat", label: "Chat", icon: "💬", badge: messageCount, description: "Messages" },
        { to: "/my-profile", label: "Profile", icon: "👤", description: "Edit your info" },
    ];

    const logout = async () => {
        await API.post("/user/logout");
        navigate("/login");
    };

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
                className="hidden w-72 flex-shrink-0 lg:flex lg:flex-col bg-[#0E0B17] border-r border-[#1A1428]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                {/* ── Logo ── */}
                <div className="px-6 pt-6 pb-5 border-b border-[#1A1428]">
                    <Link to="/" className="flex items-center gap-3">
                        <div
                            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#C8FF4D] text-xl"
                            style={{ boxShadow: "0 0 20px rgba(200,255,77,0.3)" }}
                        >
                            🏠
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-tight text-[#F4F1FF] leading-tight">
                                flat<span className="text-[#C8FF4D]">mate</span>
                            </div>
                            <div
                                className="text-[10px] text-[#6E6585] tracking-[0.15em] mt-0.5"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                FIND YOUR PERSON
                            </div>
                        </div>
                    </Link>
                </div>

                {/* ── Nav ── */}
                <nav className="flex flex-1 flex-col px-4 py-5 gap-1">

                    <p
                        className="px-2 mb-2 text-[10px] uppercase tracking-[0.18em] text-[#3A324D]"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Navigation
                    </p>

                    {navItems.map((item) => {
                        const isActive =
                            location.pathname === item.to ||
                            (item.to === "/chat" && location.pathname.startsWith("/chat/"));
                        const showBadge = item.badge && item.badge > 0;

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`group relative flex items-center gap-3.5 rounded-2xl px-4 py-3.5 transition-all duration-150 border ${isActive
                                        ? "bg-[#C8FF4D]/[0.08] border-[#C8FF4D]/[0.2]"
                                        : "border-transparent hover:bg-[#1A1428] hover:border-[#2E2640]"
                                    }`}
                            >
                                {/* Active left bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-[#C8FF4D]" />
                                )}

                                {/* Icon */}
                                <div
                                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg transition-all duration-150 ${isActive
                                            ? "bg-[#C8FF4D]/15"
                                            : "bg-[#1A1428] group-hover:bg-[#231D33]"
                                        }`}
                                >
                                    {item.icon}
                                </div>

                                {/* Label + description */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={`text-sm font-semibold leading-tight transition-colors duration-150 ${isActive ? "text-[#F4F1FF]" : "text-[#9D93B8] group-hover:text-[#F4F1FF]"
                                            }`}
                                    >
                                        {item.label}
                                    </p>
                                    {item.description && (
                                        <p
                                            className="text-[11px] text-[#3A324D] mt-0.5 group-hover:text-[#6E6585] transition-colors duration-150"
                                            style={{ fontFamily: "'Space Mono', monospace" }}
                                        >
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                {/* Badge or pulse */}
                                {showBadge ? (
                                    <span
                                        className="rounded-full bg-[#C8FF4D] px-2 py-0.5 text-[10px] font-bold text-[#15111F] min-w-[20px] text-center"
                                        style={{ fontFamily: "'Space Mono', monospace" }}
                                    >
                                        {item.badge}
                                    </span>
                                ) : isActive ? (
                                    <span className="h-2 w-2 rounded-full bg-[#C8FF4D] animate-pulse" />
                                ) : null}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Stats strip ── */}
                <div className="mx-4 mb-4 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-[#1A1428] border border-[#2E2640] px-4 py-3">
                        <p
                            className="text-[10px] text-[#3A324D] mb-1"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            Profiles seen
                        </p>
                        <p className="text-lg font-bold text-[#F4F1FF]">24</p>
                    </div>
                    <div className="rounded-2xl bg-[#1A1428] border border-[#2E2640] px-4 py-3">
                        <p
                            className="text-[10px] text-[#3A324D] mb-1"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            Match rate
                        </p>
                        <p className="text-lg font-bold text-[#C8FF4D]">38%</p>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="mx-4 h-px bg-[#1A1428]" />

                {/* ── User section ── */}
                <div className="px-4 pt-4 pb-5 flex flex-col gap-2">

                    {/* User card */}
                    <div className="flex items-center gap-3 rounded-2xl bg-[#1A1428] border border-[#2E2640] px-4 py-3">
                        <div
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-[#15111F]"
                            style={{
                                fontFamily: "'Space Mono', monospace",
                                background: "linear-gradient(135deg, #C8FF4D 0%, #7C3AED 100%)",
                            }}
                        >
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#F4F1FF] truncate leading-tight">
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
                        <Link
                            to="/my-profile"
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#2E2640] bg-[#211C2E] text-[#6E6585] hover:border-[#C8FF4D]/40 hover:text-[#C8FF4D] transition-all duration-150"
                            title="Edit profile"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                            </svg>
                        </Link>
                    </div>

                    {/* Sign out */}
                    <button
                        onClick={logout}
                        className="group flex w-full items-center gap-3 rounded-xl border border-[#2E2640] bg-transparent px-4 py-2.5 text-left transition-all duration-150 hover:bg-[#FF6B6B]/[0.08] hover:border-[#FF6B6B]/30"
                    >
                        <span className="text-base">🚪</span>
                        <span className="text-sm font-semibold text-[#6E6585] group-hover:text-[#FF8A8A] transition-colors duration-150">
                            Sign out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}