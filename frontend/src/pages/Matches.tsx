import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

interface Match {
    match_id: string;
    name: string;
    age: number;
    city: string;
    occupation: string;
    photo_url?: string;
    matched_at: string;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("http://localhost:5000/matches/get")
            .then((res) => setMatches(res.data.matches || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center">
            <p className="text-gray-400">Loading matches...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-orange-50 px-4 py-8">
            <div className="max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-orange-500 mb-1">Your matches</h1>
                <p className="text-gray-400 text-sm mb-6">{matches.length} people liked you back</p>

                {matches.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow p-10 text-center">
                        <p className="text-4xl mb-3">💔</p>
                        <p className="text-gray-500">No matches yet</p>
                        <p className="text-gray-400 text-sm mt-1">Keep swiping!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {matches.map((match) => (
                            <div key={match.match_id}
                                onClick={() => navigate(`/chat/${match.match_id}`)}
                                className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition">
                                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                    {match.photo_url ? (
                                        <img src={match.photo_url} alt={match.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <span className="text-2xl">👤</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800">{match.name}, {match.age}</h3>
                                    <p className="text-gray-400 text-sm truncate">{match.occupation} · {match.city}</p>
                                </div>
                                <span className="text-orange-400 text-xl">→</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}