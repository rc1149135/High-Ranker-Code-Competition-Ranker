import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import CodeSpaceNav from "../components/CodeSpaceNav";

const CodespaceProblemSet = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [challengingGroups, setChallengingGroups] = useState([]);
    const [showThrowModal, setShowThrowModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const [probRes, groupRes] = await Promise.all([
                    api.get("/api/problems"),
                    api.get("/api/tempers/my-groups")
                ]);
                setProblems(probRes.data);
                setChallengingGroups(groupRes.data.filter(g => g.currentChallenger === JSON.parse(localStorage.getItem('user'))?.id && g.isSelectionPhase));
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    const handleThrow = async (groupSlug) => {
        try {
            await api.post(`/api/tempers/${groupSlug}/throw`, {
                problemId: selectedProblem._id,
                durationMinutes: 60 // Default 60 mins
            });
            alert("Problem Thrown!");
            setShowThrowModal(false);
            // Refresh groups
            const res = await api.get("/api/tempers/my-groups");
            setChallengingGroups(res.data.filter(g => g.currentChallenger === JSON.parse(localStorage.getItem('user'))?.id && g.isSelectionPhase));
        } catch (err) {
            alert(err.response?.data?.error || "Failed to throw");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans">
            <CodeSpaceNav />
            
            <div className="max-w-6xl mx-auto py-12 px-6">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Training Lab
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">CodeSpace Problem Set</h1>
                        <p className="text-slate-400 mt-2 text-lg">Master technical interviews with our curated challenges.</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700/50">
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Your Progress</p>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-white">
                                {problems.filter(p => p.solved).length} / {problems.length}
                            </span>
                            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-1000" 
                                    style={{ width: `${(problems.filter(p => p.solved).length / (problems.length || 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="overflow-hidden bg-slate-800/30 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold tracking-[0.2em] border-b border-slate-700/50">
                            <tr>
                                <th className="p-6 text-center w-24">Status</th>
                                <th className="p-6">Title</th>
                                <th className="p-6 w-32">Difficulty</th>
                                <th className="p-6 w-24 text-right">Points</th>
                                <th className="p-6 w-32 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="p-6"><div className="w-6 h-6 bg-slate-700 rounded-full mx-auto"></div></td>
                                        <td className="p-6"><div className="w-48 h-4 bg-slate-700 rounded-lg"></div></td>
                                        <td className="p-6"><div className="w-20 h-4 bg-slate-700 rounded-lg"></div></td>
                                        <td className="p-6 text-right"><div className="w-12 h-4 bg-slate-700 rounded-lg ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : (
                                problems.map((prob, index) => (
                                    <tr key={prob._id} className="hover:bg-indigo-500/5 transition-all group">
                                        <td className="p-6 text-center">
                                            {prob.solved ? (
                                                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mx-auto" title="Solved">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full border-2 border-slate-700 group-hover:border-slate-500 flex items-center justify-center mx-auto transition-colors"></div>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <Link
                                                to={`/problem/${prob.slug}`}
                                                className={`text-lg font-bold transition-all ${
                                                    prob.solved ? 'text-slate-400 line-through decoration-slate-600' : 'text-white hover:text-indigo-400'
                                                }`}
                                            >
                                                {index + 1}. {prob.title}
                                            </Link>
                                        </td>
                                        <td className="p-6">
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest ${
                                                prob.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-400/10' :
                                                prob.difficulty === 'Medium' ? 'text-amber-400 bg-amber-400/10' :
                                                'text-rose-500 bg-rose-500/10'
                                            }`}>
                                                {prob.difficulty}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className="font-mono font-bold text-slate-400">{prob.points || 10}</span>
                                        </td>
                                        <td className="p-6 text-right">
                                            {challengingGroups.length > 0 && (
                                                <button 
                                                    onClick={() => { setSelectedProblem(prob); setShowThrowModal(true); }}
                                                    className="bg-rose-600/10 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                                                >Throw ⚔️</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    
                    {!loading && problems.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-slate-500 italic">No problems available in the lab yet.</p>
                        </div>
                    )}
                </div>

                 {/* Throw Modal */}
                 {showThrowModal && (
                    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
                        <div className="bg-[#1a1c23] border border-rose-500/30 p-8 rounded-3xl w-full max-w-sm shadow-2xl relative">
                            <h2 className="text-2xl font-black italic uppercase text-white mb-4">Initialize Strike ⚔️</h2>
                            <p className="text-slate-400 text-xs font-bold mb-6 uppercase tracking-widest">Target: {selectedProblem?.title}</p>
                            
                            <div className="space-y-3">
                                {challengingGroups && challengingGroups.length > 0 ? (
                                    challengingGroups.map(group => (
                                        <button 
                                            key={group._id}
                                            onClick={() => handleThrow(group.slug)}
                                            className="w-full bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-xl font-bold transition-all flex justify-between items-center group"
                                        >
                                            <span className="uppercase italic">{group.name}</span>
                                            <span className="text-[10px] bg-black/20 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">THROW 🚀</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl">
                                        <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                            No active assignments. You must be the designated 'Challenger' in a squad to throw problems.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => setShowThrowModal(false)}
                                className="mt-8 w-full text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
                            >Cancel Operation</button>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default CodespaceProblemSet;