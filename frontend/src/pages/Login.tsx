import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!form.email.trim()) {
            setError("Please enter your email.");
            setLoading(false);
            return;
        }
        if (!form.password) {
            setError("Please enter your password.");
            setLoading(false);
            return;
        }

        try {
            const res = await API.post("/user/login", form);

            // ✅ assume your backend returns: { token: "...", has_profile: true/false }
            const { has_profile } = res.data;
            // localStorage.setItem("token", res.data.token);

            // ✅ redirect based on profile status
            if (has_profile) {
                navigate("/browse-page");
            } else {
                navigate("/create-profile");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.msg || "Wrong credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full mx-auto">
                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-orange-500">
                        flatmate<span className="text-gray-900">.</span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">Welcome back!</p>
                </div>

                {/* Card */}
                <div className="rounded-3xl bg-white p-8 shadow-lg shadow-orange-100 ring-1 ring-orange-100">
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@gmail.com"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-400/30 transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in…" : "Log in"}
                        </button>
                    </form>

                    {/* Signup link */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don’t have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-orange-500 font-medium hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}