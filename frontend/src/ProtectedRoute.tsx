import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "./api/axios";


export default function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await API.get("/user/me");
                setIsAuth(true);
            } catch {
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}