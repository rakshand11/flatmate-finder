import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import CreateProfile from "./pages/CreateProfile";
import BrowsePage from "./pages/Browse";
import MatchesPage from "./pages/Matches";
import ChatPage from "./pages/Chat";
import MyProfilePage from "./pages/MyProfile";
import HomePage from "./pages/Home";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/browse-page" element={<BrowsePage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/chat/:match_id" element={<ChatPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />

      </Routes>
    </BrowserRouter>
  );
}
