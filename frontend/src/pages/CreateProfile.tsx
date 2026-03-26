import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const LIFESTYLE_OPTIONS = [
    "non-smoker",
    "smoker",
    "pet-friendly",
    "no-pets",
    "early riser",
    "night owl",
    "vegetarian",
    "non-vegetarian",
    "introverted",
    "extroverted",
    "work from home",
    "student",
];

export default function CreateProfile() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "",
        bio: "",
        city: "",
        locality: "",
        budget_min: "",
        budget_max: "",
        occupation: "",
        lifestyle_tags: [] as string[],
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleTag = (tag: string) => {
        setForm((prev) => ({
            ...prev,
            lifestyle_tags: prev.lifestyle_tags.includes(tag)
                ? prev.lifestyle_tags.filter((t) => t !== tag)
                : [...prev.lifestyle_tags, tag],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");


        if (
            !form.name.trim() ||
            !form.age ||
            !form.city.trim() ||
            !form.locality.trim() ||
            !form.budget_min ||
            !form.budget_max
        ) {
            setError("Please fill all required fields.");
            setLoading(false);
            return;
        }

        try {
            await API.post("http://localhost:5000/profile/create", {
                ...form,
                age: Number(form.age),
                budget_min: Number(form.budget_min),
                budget_max: Number(form.budget_max),
            });
            navigate("/browse");
        } catch (err: any) {
            setError(
                err.response?.data?.msg || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 py-8 px-4">
            <div className="mx-auto max-w-lg">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-orange-500">Create your profile</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Help others find the perfect flatmate in you
                    </p>
                </div>

                {/* Card */}
                <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg shadow-orange-100 ring-1 ring-orange-100">
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Full name
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                            />
                        </div>

                        {/* Age + Gender */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Age
                                </label>
                                <input
                                    name="age"
                                    type="number"
                                    min="18"
                                    max="99"
                                    value={form.age}
                                    onChange={handleChange}
                                    placeholder="E.g. 23"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                About yourself
                            </label>
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Tell others about your habits, why you need a flatmate, and what you're looking for…"
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300 resize-none"
                            />
                        </div>

                        {/* City + Locality */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    City
                                </label>
                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="E.g. Delhi"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Locality
                                </label>
                                <input
                                    name="locality"
                                    value={form.locality}
                                    onChange={handleChange}
                                    required
                                    placeholder="E.g. South Delhi, Pitampura"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Monthly rent budget
                            </label>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <input
                                        name="budget_min"
                                        type="number"
                                        value={form.budget_min}
                                        onChange={handleChange}
                                        placeholder="Min (₹)"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        name="budget_max"
                                        type="number"
                                        value={form.budget_max}
                                        onChange={handleChange}
                                        placeholder="Max (₹)"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                                    />
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-400">
                                We’ll match you with people in your budget range.
                            </p>
                        </div>

                        {/* Occupation */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Occupation
                            </label>
                            <input
                                name="occupation"
                                value={form.occupation}
                                onChange={handleChange}
                                placeholder="E.g. Software Engineer, Student, Freelancer"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
                            />
                        </div>

                        {/* Lifestyle tags */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Lifestyle & preferences
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {LIFESTYLE_OPTIONS.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`text-xs font-medium rounded-full border px-3 py-2 transition shadow-sm
                      ${form.lifestyle_tags.includes(tag)
                                                ? "bg-orange-500 text-white border-orange-500"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                                            }
                    `}
                                    >
                                        {tag
                                            .replace(/-/g, " ")
                                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-400/30 transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving profile…" : "Save & continue to browse"}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <div className="mt-4 text-center text-sm text-gray-400">
                    Already have a profile?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/browse")}
                        className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                        Go to browse
                    </button>
                </div>
            </div>
        </div>
    );
}