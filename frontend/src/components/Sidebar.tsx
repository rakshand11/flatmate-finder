import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

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
        await API.post("http://localhost:5000/user/logout");
        navigate("/login");
    };

    return (
        <aside className="hidden w-64 flex-shrink-0 lg:flex lg:flex-col bg-white/80 backdrop-blur-xl border-r border-orange-100/60 shadow-xl shadow-orange-100/30">

            {/* Logo / Brand */}
            <div className="sticky top-0 z-10 flex h-16 items-center bg-white/90 backdrop-blur-xl border-b border-orange-100/60 px-6 shadow-sm">
                <Link to="/" className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 text-base shadow-md shadow-orange-200/50">
                        🏠
                    </span>
                    <span className="text-lg font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
                        Flatmate
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col px-4 py-6 gap-1">
                {navItems.map((item) => {
                    const isActive =
                        location.pathname === item.to ||
                        (item.to === "/chat" && location.pathname.startsWith("/chat/"));

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200/70 shadow-md shadow-orange-100/60 text-orange-700"
                                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/70 border border-transparent hover:border-orange-100/60"
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-orange-400 to-pink-400 shadow-sm" />
                            )}
                            <span
                                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base transition-all duration-200 ${isActive
                                        ? "bg-gradient-to-br from-orange-100 to-pink-100 shadow-sm shadow-orange-200/50"
                                        : "bg-gray-50 group-hover:bg-orange-100/60"
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                            {isActive && (
                                <span className="ml-auto h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="px-4 pb-6 space-y-3">
                <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100/60 p-4 text-center">
                    <p className="text-xs font-semibold text-orange-500 mb-1">💡 Tip</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Swipe right on profiles you like to find your perfect flatmate!
                    </p>
                </div>
                <button
                    onClick={logout}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-red-100/60 bg-red-50/50 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200/60 hover:shadow-sm transition-all duration-200"
                >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-red-100/60 text-base group-hover:scale-110 transition-transform duration-200">
                        🚪
                    </span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}