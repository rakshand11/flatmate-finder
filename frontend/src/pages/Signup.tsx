import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const inputCls =
    "w-full pl-11 pr-4 py-3.5 rounded-2xl border border-orange-100/80 bg-orange-50/40 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-orange-300/60 focus:border-orange-300 focus:bg-white";

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "", phone: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.email.trim()) { setError("Please enter your email."); return; }
        if (!form.password) { setError("Please enter a password."); return; }
        setLoading(true);
        try {
            await API.post("/user/register", form);
            navigate("/create-profile");
        } catch (err: any) {
            setError(err.response?.data?.msg || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 -right-24 h-72 w-72 animate-pulse rounded-full bg-orange-200/40 blur-3xl" />
                <div className="absolute -bottom-32 -left-24 h-72 w-72 animate-pulse rounded-full bg-pink-100/50 blur-3xl" />
            </div>

            <div className="w-full max-w-sm space-y-8">

                {/* Logo & header */}
                <div className="text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-pink-400 shadow-xl shadow-orange-300/50">
                        <span className="text-3xl">🏠</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        Join{" "}
                        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            Flatmate
                        </span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Create your account and start matching
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-3xl bg-white/90 border border-orange-100/60 shadow-2xl shadow-orange-200/40 backdrop-blur-sm p-8">

                    {/* Error */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Email address
                            </label>
                            <div className="relative">
                                <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <input
                                    type="email" name="email" value={form.email}
                                    onChange={handleChange} required
                                    placeholder="you@gmail.com"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Phone number
                            </label>
                            <div className="relative">
                                <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <input
                                    type="tel" name="phone" value={form.phone}
                                    onChange={handleChange}
                                    placeholder="9999999999"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    type="password" name="password" value={form.password}
                                    onChange={handleChange} required
                                    placeholder="••••••••"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 py-4 text-sm font-bold text-white shadow-xl shadow-orange-300/50 hover:shadow-2xl hover:shadow-orange-400/50 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                    Creating account…
                                </span>
                            ) : (
                                "Create account →"
                            )}
                        </button>
                    </form>

                    {/* Sign in link */}
                    <div className="mt-6 pt-6 border-t border-orange-100/60 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-orange-500 hover:text-orange-600 transition-colors duration-150"
                        >
                            Sign in →
                        </Link>
                    </div>
                </div>

                {/* Terms */}
                <p className="text-center text-xs text-gray-400">
                    By signing up, you agree to our{" "}
                    <span className="font-medium text-gray-500 hover:text-orange-500 cursor-pointer transition-colors">Terms</span>
                    {" & "}
                    <span className="font-medium text-gray-500 hover:text-orange-500 cursor-pointer transition-colors">Privacy Policy</span>
                </p>
            </div>
        </div>
    );
}