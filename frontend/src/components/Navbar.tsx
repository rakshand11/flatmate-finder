import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Navbar() {
    const navigate = useNavigate();
    const logout = async () => {
        await API.post("/logout");
        navigate("/login");
    };
    return (
        <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
            <Link to="/browse" className="text-xl font-bold text-orange-500">flatmate.</Link>
            <div className="flex items-center gap-6 text-sm">
                <Link to="/browse-page" className="text-gray-500 hover:text-orange-500 transition">Browse</Link>
                <Link to="/matches" className="text-gray-500 hover:text-orange-500 transition">Matches</Link>
                <Link to="/create-profile" className="text-gray-500 hover:text-orange-500 transition">Profile</Link>
                <button onClick={logout} className="text-gray-400 hover:text-red-400 transition">Logout</button>
            </div>
        </nav>
    );
}
