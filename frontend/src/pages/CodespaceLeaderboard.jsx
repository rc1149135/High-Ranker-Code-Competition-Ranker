import React, { useState, useEffect } from "react";
import api from "../api/axios";
import CodeSpaceNav from "../components/CodeSpaceNav";

const CodespaceLeaderboard = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get("/api/user/leaderboard/codespace");
                setRankings(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Leaderboard Fetch Error:", err);
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
            <CodeSpaceNav />

            <div className="max-w-5xl mx-auto py-16 px-6 animate-fade-in">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        Internal Arena
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                        Codespace Elite
                    </h1>
                    <p className="text-slate-500 mt-4 text-lg italic font-medium">You'll reach to the top with your hard work</p>
                </div>

                <div className="bg-slate-900/50 rounded-[2.5rem] border border-slate-800/50 overflow-hidden shadow-2xl backdrop-blur-xl">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/80 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-800">
                            <tr>
                                <th className="p-8 text-center w-24">Rank</th>
                                <th className="p-8">Developer</th>
                                <th className="p-8 text-center">Solved</th>
                                <th className="p-8 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {rankings.map((user, index) => (
                                <tr key={index} className="group hover:bg-indigo-500/5 transition-all">
                                    <td className="p-8">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mx-auto ${user.rank === 1 ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]" :
                                            "bg-slate-800 text-slate-400"
                                            }`}>
                                            #{user.rank}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:border-indigo-500/50 transition-colors">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                {user.username}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <span className="px-4 py-1 rounded-full bg-slate-800/80 text-slate-300 font-mono font-bold border border-slate-700">
                                            {user.problemsSolved}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-3xl font-black text-white group-hover:text-indigo-500 transition-all origin-right">
                                                {user.score}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Local Score</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {rankings.length === 0 && !loading && (
                        <div className="p-20 text-center text-slate-600 italic">
                            The arena is silent. Be the first to strike!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodespaceLeaderboard;