import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import SquadChat from "../components/SquadChat";

function CircleLeaderboard() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState("major");
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchLeaderboard();
  }, [slug, activePlatform]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/circles/${slug}/leaderboard?platform=${activePlatform}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch circle leaderboard:", err);
      const errorMsg = err.response?.data?.error || "Failed to load squad. Redirecting...";
      alert(errorMsg);
      navigate("/circles");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCircle = async () => {
    if (!window.confirm("Are you sure you want to delete this squad permanently?")) return;
    
    try {
      await api.delete(`/api/circles/${slug}`);
      navigate("/circles");
    } catch (err) {
      alert("Failed to delete circle");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Loading squad rankings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center relative">
          <button 
            onClick={() => navigate("/circles")}
            className="absolute left-0 top-0 text-slate-400 hover:text-indigo-600 font-bold flex items-center gap-2 transition-colors"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Exit Circle
          </button>
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.2em]">
            Private Squad
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            {data?.circleName || "The Circle"}
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold mb-8">
            <span>Invite Code:</span>
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg border border-indigo-100 select-all cursor-pointer" title="Click to copy">
                {data?.inviteCode || "------"}
            </span>
          </div>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto italic font-medium">
            A scoped view of the global board, exclusively for your team.
          </p>

          <div className="mt-10 flex justify-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit mx-auto">
            {["major", "codespace", "leetcode", "codeforces"].map((p) => (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activePlatform === p 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {data?.isAdmin && (
            <div className="mt-8">
                <button 
                  onClick={handleDeleteCircle}
                  className="text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 transition-colors border border-rose-500/20 px-4 py-2 rounded-xl hover:bg-rose-500/5"
                >
                  Delete Squad (Admin Only)
                </button>
            </div>
          )}
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-8 font-bold uppercase text-[10px] tracking-[0.2em]">Rank</th>
                <th className="p-8 font-bold uppercase text-[10px] tracking-[0.2em]">Member</th>
                <th className="p-8 font-bold uppercase text-[10px] tracking-[0.2em] text-center">Local Solves</th>
                <th className="p-8 font-bold uppercase text-[10px] tracking-[0.2em] text-right">
                    {activePlatform === "major" ? "Circle Score" : `${activePlatform} Score`}
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.leaderboard.map((member, index) => (
                <tr 
                  key={member.username} 
                  className={`group transition-all duration-300 hover:bg-slate-50 border-b border-slate-50 last:border-0 ${
                    index === 0 ? "bg-amber-50/20" : ""
                  }`}
                >
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                        index === 0 ? "bg-amber-100 text-amber-700" : 
                        index === 1 ? "bg-slate-100 text-slate-600" :
                        index === 2 ? "bg-orange-50 text-orange-700" :
                        "text-slate-400"
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {member.username}
                      </span>
                      <span className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest">
                        Squad Member
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <span className="font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                        {member.problemsSolved} Solved
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-3xl font-black text-slate-900 group-hover:scale-110 transition-transform origin-right">
                        {member.score.toFixed(2)}
                      </span>
                      <div className="w-16 h-1 bg-indigo-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!data || data.leaderboard.length === 0) && (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-medium italic">Your squad is quiet. Start solving problems to rank up!</p>
            </div>
          )}
        </div>
      </div>
      <SquadChat slug={slug} currentUser={currentUser} />
    </div>
  );
}

export default CircleLeaderboard;
