import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const LIFESTYLE_OPTIONS = [
    "non-smoker", "smoker", "pet-friendly", "no-pets",
    "early riser", "night owl", "vegetarian", "non-vegetarian",
    "introverted", "extroverted", "work from home", "student"
];

export default function CreateProfile() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "", age: "", gender: "", bio: "",
        city: "", locality: "", budget_min: "", budget_max: "",
        occupation: "", lifestyle_tags: [] as string[],
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        try {
            await API.post("http://localhost:5000/profile/create", {
                ...form,
                age: Number(form.age),
                budget_min: Number(form.budget_min),
                budget_max: Number(form.budget_max),
            });
            navigate("/browse-page");
        } catch (err: any) {
            setError(err.response?.data?.msg || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 py-10 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-orange-500 mb-1">Create your profile</h1>
                <p className="text-gray-500 text-sm mb-6">Help others find the perfect flatmate in you</p>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Full name"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />

                    <div className="grid grid-cols-2 gap-3">
                        <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age"
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                        <select name="gender" value={form.gender} onChange={handleChange}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                            <option value="">Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell others about yourself..."
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />

                    <div className="grid grid-cols-2 gap-3">
                        <input name="city" value={form.city} onChange={handleChange} required placeholder="City"
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                        <input name="locality" value={form.locality} onChange={handleChange} required placeholder="Locality"
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input name="budget_min" type="number" value={form.budget_min} onChange={handleChange} placeholder="Min budget (₹)"
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                        <input name="budget_max" type="number" value={form.budget_max} onChange={handleChange} placeholder="Max budget (₹)"
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>

                    <input name="occupation" value={form.occupation} onChange={handleChange} placeholder="Occupation"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Lifestyle</p>
                        <div className="flex flex-wrap gap-2">
                            {LIFESTYLE_OPTIONS.map((tag) => (
                                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${form.lifestyle_tags.includes(tag)
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                                        }`}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                        {loading ? "Saving..." : "Save profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}