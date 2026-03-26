import { useEffect, useState } from "react";
import API from "../api/axios";

interface Profile {
    user_id: string;
    name: string;
    age?: number;
    city?: string;
    locality?: string;
    bio?: string;
    occupation?: string;
    budget_min?: number;
    budget_max?: number;
    lifestyle_tags?: string[];
    photo_url?: string;
}

export default function MyProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("http://localhost:5000/profile/get");
                setProfile(res.data.profile);
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.msg || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // ✅ Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-orange-50">
                <p className="text-gray-500">Loading your profile...</p>
            </div>
        );
    }

    // ❌ Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-orange-50">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // ❌ No profile
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-orange-50">
                <p className="text-gray-500">No profile found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">

                {/* Profile Image */}
                <div className="h-56 bg-orange-100 flex items-center justify-center">
                    {profile.photo_url ? (
                        <img
                            src={profile.photo_url}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-6xl">👤</span>
                    )}
                </div>

                {/* Profile Info */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {profile.name}
                            {profile.age && `, ${profile.age}`}
                        </h2>
                        {profile.budget_min !== undefined && profile.budget_max !== undefined && (
                            <span className="text-sm font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                                ₹{profile.budget_min}–{profile.budget_max}
                            </span>
                        )}
                    </div>

                    {(profile.city || profile.locality) && (
                        <p className="text-gray-400 text-sm mb-2">
                            {profile.locality}, {profile.city}
                        </p>
                    )}

                    {profile.occupation && (
                        <p className="text-gray-500 text-sm mb-2">
                            {profile.occupation}
                        </p>
                    )}

                    {profile.bio && (
                        <p className="text-gray-600 text-sm mb-3">
                            {profile.bio}
                        </p>
                    )}

                    {/* Lifestyle Tags */}
                    {profile.lifestyle_tags && profile.lifestyle_tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {profile.lifestyle_tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}