import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import TemperChat from "../components/TemperChat";

function TemperWarRoom() {
  const { slug } = useParams();
  const [group, setGroup] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, [slug]);

  useEffect(() => {
    if (group?.roundEndTime) {
      const timer = setInterval(() => {
        const diff = Math.max(0, Math.floor((new Date(group.roundEndTime) - new Date()) / 1000));
        setTimeLeft(diff);
        if (diff === 0) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [group?.roundEndTime]);

  const fetchState = async () => {
    try {
      const res = await api.get(`/api/tempers/${slug}/battle`);
      setGroup(res.data);
    } catch (err) {
      console.error("Failed to fetch battle state", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this combat zone? All ranking data will be lost.")) return;
    try {
      await api.delete(`/api/tempers/${slug}`);
      navigate("/tempers");
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  if (loading) return (
    <div className="bg-[#050505] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const isAdmin = group?.admin === JSON.parse(localStorage.getItem('user'))?.id;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-rose-600 selection:text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Battle Info */}
        <div className="lg:col-span-8 space-y-8">
          <header className="flex items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-600"></div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">{group.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="bg-rose-600/10 text-rose-500 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border border-rose-500/20 uppercase">
                    Squad Token: {group.inviteCode}
                </span>
              </div>
            </div>
            {isAdmin && (
                <button 
                    onClick={handleDelete}
                    className="bg-white/5 text-rose-500 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 transition-all"
                >Delete Zone</button>
            )}
          </header>

          {/* Active Battle Card */}
          <div className={`relative p-8 rounded-[3rem] border-4 overflow-hidden transition-all ${group.isSelectionPhase ? 'border-white/5 bg-white/5' : 'border-rose-600 bg-rose-950/20 shadow-[0_0_50px_rgba(225,29,72,0.2)]'}`}>
            {group.isSelectionPhase ? (
              <div className="text-center py-20 relative z-10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tight mb-2">Intermission</h2>
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">
                    Next Challenger: <span className="text-rose-500">{group.currentChallenger?.username || 'Selecting...'}</span>
                </p>
                {group.currentChallenger?._id === JSON.parse(localStorage.getItem('user'))?.id && (
                    <button 
                        onClick={() => navigate('/codespaceproblemset')}
                        className="mt-8 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >Choose Challenge ⚔️</button>
                )}
              </div>
            ) : (
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <span className="text-rose-500 font-black text-[10px] uppercase tracking-[0.5em] mb-2 block">Incoming Challenge</span>
                        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            {group.activeProblem?.title}
                        </h2>
                    </div>
                    <div className="text-right">
                        <div className="text-7xl font-black tabular-nums tracking-tighter italic text-rose-600">
                            {formatTime(timeLeft)}
                        </div>
                        <span className="text-rose-500/40 font-black text-[10px] uppercase tracking-widest">Time Remaining</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                        <span className="block text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Target</span>
                        <span className="text-xl font-black italic uppercase">{group.activeProblem?.difficulty}</span>
                    </div>
                    <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                        <span className="block text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Bounty</span>
                        <span className="text-xl font-black italic uppercase">{group.activeProblem?.points} PTS</span>
                    </div>
                    <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                        <span className="block text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Inquisitor</span>
                        <span className="text-xl font-black italic uppercase text-rose-500">{group.currentChallenger?.username}</span>
                    </div>
                </div>

                {group.hasSolvedActive ? (
                    <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-center py-6 rounded-[2rem] font-black text-2xl uppercase tracking-[0.1em] shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                        Mission Accomplished ✅
                    </div>
                ) : (
                    <a 
                        href={`/problem/${group.activeProblem?.slug}`}
                        target="_blank" rel="noreferrer"
                        className="block w-full bg-rose-600 text-white text-center py-6 rounded-[2rem] font-black text-2xl uppercase tracking-[0.1em] hover:bg-rose-700 transition-all shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Engage Mission
                    </a>
                )}
              </div>
            )}
            {/* Background Decorative Text */}
            <div className="absolute -bottom-10 -right-10 text-[15rem] font-black text-white/[0.02] italic select-none leading-none pointer-events-none z-0">
                {group.isSelectionPhase ? 'VOID' : 'WAR'}
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 h-full">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 bg-rose-600 rounded-xl flex items-center justify-center text-white not-italic">🏆</span>
                    Temper Ranks
                </h3>
                <div className="space-y-4">
                    {group.members.map((member, idx) => (
                        <div key={member._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/40'}`}>
                                    {idx + 1}
                                </span>
                                <span className="font-black italic uppercase tracking-tight group-hover:text-rose-500 transition-colors">
                                    {member.username}
                                </span>
                            </div>
                            <span className="text-rose-500 font-black tabular-nums">
                                {group.temperRankings?.[member._id] || 0}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
      <TemperChat 
        slug={slug} 
        currentUser={JSON.parse(localStorage.getItem('user'))} 
      />
    </div>
  );
}

export default TemperWarRoom;
