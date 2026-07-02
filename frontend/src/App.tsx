import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import CreateProfile from "./pages/CreateProfile";
import BrowsePage from "./pages/Browse";
import MatchesPage from "./pages/Matches";
import ChatPage from "./pages/Chat";
import MyProfilePage from "./pages/MyProfile";
import HomePage from "./pages/Home";
import ChatListPage from "./pages/ChatList";
import ProtectedRoute from "./ProtectedRoute";
import EditProfilePage from "./pages/Editprofile";


function Layout() {
    return (
        <div className="flex min-h-screen bg-[#15111F]">
            <Sidebar />
            <main className="flex-1 min-w-0">
                <Outlet />
            </main>
        </div>
    );
}
export default function App() {
    return (
        <BrowserRouter>
            <Routes>


                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />


                <Route element={<ProtectedRoute />}>


                    <Route path="/create-profile" element={<CreateProfile />} />


                    <Route element={<Layout />}>
                        <Route path="/browse" element={<BrowsePage />} />
                        <Route path="/matches" element={<MatchesPage />} />
                        <Route path="/chat" element={<ChatListPage />} />
                        <Route path="/chat/:match_id" element={<ChatPage />} />
                        <Route path="/my-profile" element={<MyProfilePage />} />
                        <Route path="/edit-profile" element = {<EditProfilePage/>}/>
                    </Route>

                </Route>

            </Routes>
        </BrowserRouter>
    );
}