import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "", phone: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await API.post("http://localhost:5000/user/register", form);
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.msg || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-orange-500 mb-1">flatmate.</h1>
                <p className="text-gray-500 text-sm mb-6">Find your perfect flatmate</p>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@gmail.com"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="9999999999"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-500 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
