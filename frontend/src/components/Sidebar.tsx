// components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { to: "/browse", label: "Browse", icon: "🎯" },
        { to: "/matches", label: "Matches", icon: "💖" },
        { to: "/chat", label: "Chat", icon: "💬" },
        { to: "/my-profile", label: "Profile", icon: "👤" },
    ];

    return (
        <aside className="hidden w-60 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                <span className="text-lg font-bold text-orange-500">
                    .findOne()
                </span>
            </div>

            <nav className="flex flex-col px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        location.pathname === item.to ||
                        (item.to === "/chat" && location.pathname.startsWith("/chat/"));

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                                ? "bg-orange-50 text-orange-500"
                                : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}