import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import ProtectedRoute from './components/ProtectedRoute';
import Menu from './components/Sidebar';

import MajorRankList from './pages/MajorRankList';
import LeetCodeRankList from './pages/LeetCodeRankList';
import CodeForcesRankList from './pages/CodeForcesRankList';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Error404 from './pages/Error404';

import CodespaceProblemSet from "./pages/CodespaceProblemSet";
import CodeSpace from "./pages/CodeSpace";
import CodespaceLeaderboard from "./pages/CodespaceLeaderboard";

import CirclesDashboard from './pages/CirclesDashboard';
import CircleLeaderboard from './pages/CircleLeaderboard';
import TempersDashboard from './pages/TempersDashboard';
import TemperWarRoom from './pages/TemperWarRoom';

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();
  const normalizedPathname = location.pathname.replace(/\/$/, "") || "/";

  const isAuthPage = ["/login", "/signup"].includes(normalizedPathname);

  const isCodeSpaceZone =
    normalizedPathname.startsWith("/codespaceproblemset") ||
    normalizedPathname.startsWith("/problem") ||
    normalizedPathname.startsWith("/rankList/CodeSpaceRanking");

  const isCircleZone = normalizedPathname.startsWith("/circles/") &&
    normalizedPathname.includes("/leaderboard");

  const isTemperZone = normalizedPathname.startsWith("/tempers/") &&
    normalizedPathname.includes("/war-room");

  const definedPaths = [
    "/codespaceproblemset",
    "/rankList/CodeSpaceRanking",
    "/dashboard",
    "/rankList/MajorRanking",
    "/rankList/LeetCodeRanking",
    "/rankList/CodeForcesRanking",
    "/circles",
    "/tempers",
    "/login",
    "/signup",
    "/"
  ];

  const isDynamicProblemPath = normalizedPathname.startsWith("/problem/");
  const isDynamicCirclePath = normalizedPathname.startsWith("/circles/");
  const isDynamicTemperPath = normalizedPathname.startsWith("/tempers/");

  const isErrorPage = !definedPaths.includes(normalizedPathname) &&
    !isDynamicProblemPath &&
    !isDynamicCirclePath &&
    !isDynamicTemperPath;

  const showSidebar = !isAuthPage && !isErrorPage && !isCodeSpaceZone && !isCircleZone && !isTemperZone;

  const marginClass = !showSidebar
    ? "ml-0"
    : (isMenuOpen ? "ml-64" : "ml-20");

  return (
    <div className={`flex w-full min-h-screen ${isCodeSpaceZone ? "bg-[#1a1a1a]" : "bg-slate-50"}`}>

      {showSidebar && <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}

      <main className={`flex-1 transition-all duration-300 ease-in-out ${marginClass}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/rankList/MajorRanking" element={
            <ProtectedRoute><MajorRankList /></ProtectedRoute>
          } />

          <Route path="/rankList/LeetCodeRanking" element={
            <ProtectedRoute><LeetCodeRankList /></ProtectedRoute>
          } />

          <Route path="/rankList/CodeForcesRanking" element={
            <ProtectedRoute><CodeForcesRankList /></ProtectedRoute>
          } />

          <Route path="/circles" element={
            <ProtectedRoute><CirclesDashboard /></ProtectedRoute>
          } />
          <Route path="/circles/:slug/leaderboard" element={
            <ProtectedRoute><CircleLeaderboard /></ProtectedRoute>
          } />
          
          <Route path="/tempers" element={
            <ProtectedRoute><TempersDashboard /></ProtectedRoute>
          } />
          <Route path="/tempers/:slug/war-room" element={
            <ProtectedRoute><TemperWarRoom /></ProtectedRoute>
          } />

          <Route path="/codespaceproblemset" element={
            <ProtectedRoute><CodespaceProblemSet /></ProtectedRoute>
          } />

          <Route path="/problem/:slug" element={
            <ProtectedRoute><CodeSpace /></ProtectedRoute>
          } />

          <Route path="/rankList/CodeSpaceRanking" element={
            <ProtectedRoute><CodespaceLeaderboard /></ProtectedRoute>
          } />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;