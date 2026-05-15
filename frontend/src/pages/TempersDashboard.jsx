import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function TempersDashboard() {
  const [groups, setGroups] = useState([]);
  const [showCreateJoin, setShowCreateJoin] = useState(false);
  const [mode, setMode] = useState("join");
  const [formData, setFormData] = useState({ name: "", description: "", inviteCode: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get("/api/tempers/my-groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch temper groups", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        const res = await api.post("/api/tempers/create", {
          name: formData.name,
          description: formData.description
        });
        navigate(`/tempers/${res.data.slug}/war-room`);
      } else {
        const res = await api.post("/api/tempers/join", {
          inviteCode: formData.inviteCode
        });
        navigate(`/tempers/${res.data.slug}/war-room`);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  if (showCreateJoin) {
    return (
      <div className="min-h-screen w-full flex bg-[#0a0a0a] font-sans animate-fade-in text-white">
        <div className="hidden lg:flex lg:w-1/2 bg-rose-950/20 p-16 flex-col justify-between relative overflow-hidden border-r border-rose-900/20">
          <div className="relative z-10">
            <button
              onClick={() => setShowCreateJoin(false)}
              className="mb-8 flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors uppercase font-black text-xs tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Abbandon Mission
            </button>
            <h1 className="text-6xl font-black leading-tight tracking-tighter italic">
              ENTER THE <br />
              <span className="text-rose-600 drop-shadow-[0_0_20px_rgba(225,29,72,0.5)]">WAR ROOM.</span>
            </h1>
          </div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setMode("join")}
                className={`flex-1 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${mode === "join" ? "bg-rose-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >Join Squad</button>
              <button
                onClick={() => setMode("create")}
                className={`flex-1 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${mode === "create" ? "bg-rose-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >Found Base</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "create" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] ml-1">Codename</label>
                    <input
                      type="text" placeholder="Operation: Alpha" required
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold text-white"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] ml-1">Access Token</label>
                  <input
                    type="text" placeholder="GHOST-X" required maxLength={6}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-rose-500 transition-all font-black text-center text-3xl tracking-[0.5em] text-rose-500 uppercase"
                    onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value.toUpperCase() })}
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-rose-700 transition-all active:scale-95 shadow-[0_0_30px_rgba(225,29,72,0.3)] disabled:opacity-50 uppercase tracking-widest"
              >
                {loading ? "Engaging..." : (mode === "create" ? "Deploy Group" : "Infiltrate Group")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter">TEMPERS ⚔️</h1>
            <p className="text-rose-500/60 mt-2 text-lg font-bold uppercase tracking-widest">Live Combat Zones</p>
          </div>
          <button
            onClick={() => setShowCreateJoin(true)}
            className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-[0_0_20px_rgba(225,29,72,0.2)] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            New Mission
          </button>
        </header>

        {groups.length === 0 ? (
          <div className="bg-white/5 p-20 rounded-[2.5rem] border-2 border-dashed border-white/10 text-center">
            <h3 className="text-2xl font-black uppercase tracking-widest text-rose-500">No Active Zones</h3>
            <p className="text-slate-500 mt-2 mb-8 font-bold">You are currently offline. Deploy a squad to begin.</p>
            <button
              onClick={() => setShowCreateJoin(true)}
              className="text-rose-500 font-black uppercase tracking-widest hover:underline text-xs"
            >Found your first Base →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              <div
                key={group._id}
                onClick={() => navigate(`/tempers/${group.slug}/war-room`)}
                className="bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:border-rose-500/50 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-500 font-black text-xl border border-rose-500/20">
                    {group.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tight">{group.name}</h3>
                <div className="flex items-center gap-2 text-rose-500/60 font-black text-[10px] uppercase tracking-[0.2em] mt-4">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  Live Combat Area
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-24 border-t border-white/5 pt-16 pb-20">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-12">Battle Protocol</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 group hover:border-rose-500/30 transition-all">
              <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <span className="material-icons-outlined">ads_click</span>
              </div>
              <h3 className="text-lg font-black italic uppercase text-white mb-2">1. Selection</h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-wide">The system randomly selects a 'Challenger' from the squad. It's their turn to pick the battlefield.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 group hover:border-rose-500/30 transition-all">
              <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <span className="material-icons-outlined">bolt</span>
              </div>
              <h3 className="text-lg font-black italic uppercase text-white mb-2">2. The Throw</h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-wide">The Challenger picks a problem from CodeSpace and 'Throws' it. A live countdown starts for everyone.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 group hover:border-rose-500/30 transition-all">
              <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <span className="material-icons-outlined">timer</span>
              </div>
              <h3 className="text-lg font-black italic uppercase text-white mb-2">3. The Sprint</h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-wide">Squad members race to solve the challenge. The first successful submission captures the bounty.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 group hover:border-rose-500/30 transition-all">
              <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <span className="material-icons-outlined">military_tech</span>
              </div>
              <h3 className="text-lg font-black italic uppercase text-white mb-2">4. Spoils</h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-wide">Earn 'Temper Points' to climb the local leaderboard. These points are independent of your global rank.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TempersDashboard;
