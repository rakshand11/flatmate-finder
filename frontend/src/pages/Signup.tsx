import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        phone: "",
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

        // basic client‑side validation
        if (!form.email.trim()) {
            setError("Please enter your email.");
            setLoading(false);
            return;
        }
        if (!form.password) {
            setError("Please enter a password.");
            setLoading(false);
            return;
        }

        try {
            const res = await API.post("/user/register", form);

            // ✅ auto‑login (or store token in context / localStorage)
            // your backend should return:
            // - { success: true, token: "xyz", has_profile: false }
            // then:
            // setToken(res.data.token);

            // ✅ redirect to create profile, not login
            navigate("/create-profile");
        } catch (err: any) {
            setError(
                err.response?.data?.msg || "Something went wrong. Please try again."
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
                    <p className="mt-2 text-sm text-gray-500">
                        Find your perfect flatmate in your city
                    </p>
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

                        {/* Phone */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="9999999999"
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
                            {loading ? "Creating account…" : "Create account"}
                        </button>
                    </form>

                    {/* Sign in link */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-orange-500 font-medium hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}