import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyStats = async () => {
      try {
        const res = await api.get("/api/user/my-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchMyStats();
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back, <span className="text-indigo-600">{currentUser.username || "Coder"}</span>!
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Here's a look at your current progress across all platforms.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-2">Global Ranking Score</p>
              <h2 className="text-6xl font-black mb-4">{stats?.totalScore?.toFixed(2) || "0.00"}</h2>
              <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                <span className="text-sm font-medium">Ranked #{stats?.rank || 'N/A'} Overall</span>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Resume Solving</h3>
              <p className="text-slate-500 text-sm mb-6">Continue your journey in the CodeSpace environment.</p>
            </div>
            <button
              onClick={() => navigate("/codespaceproblemset")}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              Go to CodeSpace
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#475569"><path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm0-80q125 0 212.5-87.5T760-480q0-125-87.5-212.5T480-760q-125 0-212.5 87.5T180-480q0 125 87.5 212.5T480-200Zm0-280Z" /></svg>
          Platform Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">CS</div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-tight">CodeSpace</p>
            </div>
            <h2 className="text-3xl font-black text-slate-800">{stats?.codespaceSolved || 0}</h2>
            <p className="text-xs text-slate-400 mt-1">Problems Solved</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-yellow-400 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-xl">🟡</div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-tight">LeetCode</p>
            </div>
            <h2 className="text-3xl font-black text-slate-800">{stats?.leetcodeSolved || 0}</h2>
            <p className="text-xs text-slate-400 mt-1">Total Solved</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">🔵</div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-tight">Codeforces</p>
            </div>
            <h2 className="text-3xl font-black text-slate-800">{stats?.cfRating || 0}</h2>
            <p className="text-xs text-slate-400 mt-1">Current Rating</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-orange-400 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">🟠</div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-tight">AtCoders</p>
            </div>
            <h2 className="text-3xl font-black text-slate-800">{stats?.codechefRating || 0}</h2>
            <p className="text-xs text-slate-400 mt-1">Current Rating</p>
          </div>
        </div>

        <div className="mt-12 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Platform Analytics</h3>
            <button
              onClick={() => navigate("/rankList/MajorRanking")}
              className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1"
            >
              View Full Leaderboard
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" /></svg>
            </button>
          </div>
          <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center">
            <p className="text-slate-400 italic">Advanced activity charts and platform insights coming soon!</p>
          </div>
        </div>

        <div className="mt-12 mb-20 bg-red-50 p-8 rounded-[2rem] border border-red-100">
          <h3 className="text-2xl font-bold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-red-600 mb-6">Delete your account, permanently. Please be certain.</p>
          <button
            onClick={async () => {
              if (window.confirm("Are you ABSOLUTELY sure? This will delete your scores, submissions, and linked accounts permanently.")) {
                try {
                  await api.delete("/api/user/profile");
                  localStorage.removeItem("token");
                  navigate("/signup");
                } catch (err) {
                  alert("Failed to delete profile. Please try again.");
                }
              }
            }}
            className="bg-white text-red-600 border border-red-200 px-8 py-3 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;