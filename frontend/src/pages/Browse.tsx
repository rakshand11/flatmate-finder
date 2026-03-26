import { useEffect, useState } from "react";
import API from "../api/axios";

interface Profile {
    user_id: string;
    name: string;
    age: number;
    city: string;
    locality: string;
    bio: string;
    occupation: string;
    budget_min: number;
    budget_max: number;
    lifestyle_tags: string[];
    photo_url?: string;
}

export default function BrowsePage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [swiping, setSwiping] = useState(false);
    const [matchMsg, setMatchMsg] = useState("");

    useEffect(() => {
        API.get("http://localhost:5000/profile/get-all")
            .then((res) => setProfiles(res.data.profiles || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const swipe = async (direction: "left" | "right") => {
        if (swiping || current >= profiles.length) return;
        setSwiping(true);
        try {
            const res = await API.post("http://localhost:5000/swipes/create", {
                swiped_id: profiles[current].user_id,
                direction,
            });
            if (res.data.msg === "Its a match!") {
                setMatchMsg(`You matched with ${profiles[current].name}!`);
                setTimeout(() => setMatchMsg(""), 3000);
            }
            setCurrent((prev) => prev + 1);
        } catch (err) {
            console.error(err);
        } finally {
            setSwiping(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center">
            <p className="text-gray-400">Loading profiles...</p>
        </div>
    );

    const profile = profiles[current];

    return (
        <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4">
            <h1 className="text-2xl font-bold text-orange-500 mb-6">flatmate.</h1>

            {matchMsg && (
                <div className="bg-green-500 text-white px-6 py-3 rounded-full text-sm font-medium mb-4 animate-bounce">
                    {matchMsg}
                </div>
            )}

            {!profile ? (
                <div className="bg-white rounded-2xl shadow p-10 text-center">
                    <p className="text-4xl mb-3">😴</p>
                    <p className="text-gray-500">No more profiles for now!</p>
                    <p className="text-gray-400 text-sm mt-1">Check back later</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
                    <div className="bg-orange-100 h-48 flex items-center justify-center">
                        {profile.photo_url ? (
                            <img src={profile.photo_url} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-6xl">👤</span>
                        )}
                    </div>

                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{profile.name}, {profile.age}</h2>
                                <p className="text-gray-400 text-sm">{profile.locality}, {profile.city}</p>
                            </div>
                            <span className="text-sm font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                                ₹{profile.budget_min}–{profile.budget_max}
                            </span>
                        </div>

                        {profile.occupation && (
                            <p className="text-gray-500 text-sm mb-2">{profile.occupation}</p>
                        )}

                        {profile.bio && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{profile.bio}</p>
                        )}

                        {profile.lifestyle_tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {profile.lifestyle_tags.map((tag) => (
                                    <span key={tag} className="text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={() => swipe("left")} disabled={swiping}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 font-semibold transition text-lg">
                                ✕
                            </button>
                            <button onClick={() => swipe("right")} disabled={swiping}
                                className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition text-lg">
                                ♥
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-gray-400 text-xs mt-4">
                {profiles.length - current} profiles remaining
            </p>
        </div>
    );
}
