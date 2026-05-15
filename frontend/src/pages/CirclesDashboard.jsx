import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function CirclesDashboard() {
  const [circles, setCircles] = useState([]);
  const [showCreateJoin, setShowCreateJoin] = useState(false);
  const [mode, setMode] = useState("join");
  const [formData, setFormData] = useState({ name: "", description: "", inviteCode: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCircles();
  }, []);

  const fetchMyCircles = async () => {
    try {
      const res = await api.get("/api/circles/my-circles");
      setCircles(res.data);
    } catch (err) {
      console.error("Error fetching circles", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        const res = await api.post("/api/circles/create", {
          name: formData.name,
          description: formData.description
        });
        navigate(`/circles/${res.data.slug}/leaderboard`);
      } else {
        const res = await api.post("/api/circles/join", {
          inviteCode: formData.inviteCode
        });
        navigate(`/circles/${res.data.slug}/leaderboard`);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  if (showCreateJoin) {
    return (
      <div className="min-h-screen w-full flex bg-white font-sans animate-fade-in">
        <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] p-16 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <button
              onClick={() => setShowCreateJoin(false)}
              className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Dashboard
            </button>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tighter">
              {mode === "create" ? "Build Your" : "Join Your"} <br />
              <span className="text-indigo-500">Private Circle.</span>
            </h1>
            <p className="text-slate-400 mt-6 text-xl max-w-md font-medium leading-relaxed">
              Squad up with your friends and see who really dominates the rankings.
            </p>
          </div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="flex bg-slate-200 p-1 rounded-2xl">
              <button
                onClick={() => setMode("join")}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === "join" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >Join Circle</button>
              <button
                onClick={() => setMode("create")}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === "create" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >Create Circle</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "create" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Circle Name</label>
                    <input
                      type="text" placeholder="The Elite Squad" required
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
                    <input
                      type="text" placeholder="Only for the top 1% developers."
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">6-Digit Invite Code</label>
                  <input
                    type="text" placeholder="ABCDEF" required maxLength={6}
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-center text-3xl tracking-[0.5em] text-indigo-600 uppercase"
                    onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value.toUpperCase() })}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                {loading ? "Processing..." : mode === "create" ? "Create My Circle" : "Join Circle"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Your Circles ⭕</h1>
            <p className="text-slate-500 mt-2 text-lg">Manage your private squads and competitions.</p>
          </div>
          <button
            onClick={() => setShowCreateJoin(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Create or Join
          </button>
        </header>

        {circles.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Circles Found</h3>
            <p className="text-slate-500 mt-2 mb-8">You haven't joined any private squads yet.</p>
            <button
              onClick={() => setShowCreateJoin(true)}
              className="text-indigo-600 font-bold hover:underline"
            >Create or Join your first Circle →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {circles.map((circle) => (
              <div
                key={circle._id}
                onClick={() => navigate(`/circles/${circle.slug}/leaderboard`)}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:border-indigo-500 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors uppercase">
                    {circle.name.charAt(0)}
                  </div>
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {circle.members?.length || 0} Members
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{circle.name}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{circle.description}</p>
                <Link
                  to={`/circles/${circle.slug}/leaderboard`}
                  className="flex items-center text-indigo-600 font-bold text-sm hover:underline"
                >
                  View Leaderboard
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 border-t border-slate-200 pt-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">How it Works :</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <span className="material-icons-outlined">groups</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1. Build your Base</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Create a private Circle for your college, friend group, or organization. Give it a name and a mission statement.</p>
              <div className="absolute top-0 right-0 p-4 font-black text-slate-100 text-6xl">01</div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <span className="material-icons-outlined">vpn_key</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">2. Secure Invite</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Share your unique 6-digit invite code with your squad. Only those with the token can infiltrate your private leaderboard.</p>
              <div className="absolute top-0 right-0 p-4 font-black text-slate-100 text-6xl">02</div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <span className="material-icons-outlined">leaderboard</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">3. Dominate Ranks</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Once joined, you'll see a specialized leaderboard showing only your squad's performance across LeetCode, CodeForces, and CodeSpace.</p>
              <div className="absolute top-0 right-0 p-4 font-black text-slate-100 text-6xl">03</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CirclesDashboard;
