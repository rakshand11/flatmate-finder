// App.tsx
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

// Layout for logged‑in pages (with sidebar)
function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <div className="mx-4 mt-4 lg:mx-8 lg:mt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages (no sidebar) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-profile" element={<CreateProfile />} />

        {/* Private layout (with sidebar) */}
        <Route element={<Layout />}>
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:match_id" element={<ChatPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}