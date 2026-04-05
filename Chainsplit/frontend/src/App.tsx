import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GroupDetail from "./pages/GroupDetail";
import CreateGroup from "./pages/CreateGroup";
import ProfileSettings from "./pages/ProfileSettings";
import SettleUp from "./pages/SettleUp";
import ActivityFeed from "./pages/ActivityFeed";
import Groups from "./pages/Groups";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/groups/create" element={<CreateGroup />} />
      <Route path="/groups/:address" element={<GroupDetail />} />
      <Route path="/groups/:address/settle" element={<SettleUp />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/activity" element={<ActivityFeed />} />
    </Routes>
  );
}
