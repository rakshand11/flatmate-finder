import { Link } from "react-router-dom";

export default function Navbar() {


    return (
        <nav className="backdrop-blur-xl bg-white/80 sticky top-0 z-50 border-b border-slate-200/50 shadow-sm shadow-slate-200/20">
            <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/browse"
                    className="group relative text-2xl font-black bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
                >
                    .findOne()
                    <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-500" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2">
                    <Link
                        to="/browse"
                        className="group relative px-4 py-2 text-sm font-semibold text-slate-700 hover:text-purple-500 transition-all duration-200"
                    >
                        Browse
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-4/5 transition-all duration-300" />
                    </Link>
                    <Link
                        to="/matches"
                        className="group relative px-4 py-2 text-sm font-semibold text-slate-700 hover:text-purple-500 transition-all duration-200"
                    >
                        Matches
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-4/5 transition-all duration-300" />
                    </Link>
                    <Link
                        to="/create-profile"
                        className="group relative px-4 py-2 text-sm font-semibold text-slate-700 hover:text-purple-500 transition-all duration-200"
                    >
                        Profile
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-4/5 transition-all duration-300" />
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="group relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100/50 rounded-2xl hover:bg-indigo-50/50 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login
                        <span className="absolute -inset-1 group-hover:bg-indigo-500/10 rounded-xl -z-10 scale-75 group-hover:scale-100 transition-all duration-200 blur-sm" />
                    </Link>

                    <Link
                        to="/signup"
                        className="group relative px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-2xl shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:shadow-indigo-400/50 backdrop-blur-sm border-0 transition-all duration-200 flex items-center gap-2 ml-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Sign up
                        <span className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl -z-10 scale-75 group-hover:scale-100 transition-all duration-200 blur-sm" />
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button className="p-2 rounded-xl bg-slate-100/50 hover:bg-slate-200/70 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}