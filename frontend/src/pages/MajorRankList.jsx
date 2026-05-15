import { useState, useEffect } from "react";
import api from "../api/axios";

function MajorRankList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalLeaderboard = async () => {
    try {
      const res = await api.get("/api/leaderboard/global");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch global leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold uppercase tracking-wider">
            Elite Rankings
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            The Major Board
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Combining results from a varity of coding platforms and local CodeSpace performance to determine whose the best.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Calculating ranks...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-8 font-bold uppercase text-[10px] tracking-[0.2em]">Rank</th>
                  <th className="p-8 font-bold uppercase text-[10px] tracking-[0.2em]">Developer Profile</th>
                  <th className="p-8 font-bold uppercase text-[10px] tracking-[0.2em] text-right">Aggregate Score</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`group transition-all duration-300 hover:bg-slate-50 border-b border-slate-50 last:border-0 ${index === 0 ? "bg-amber-50/20" : ""
                      }`}
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${index === 0 ? "bg-amber-100 text-amber-700" :
                            index === 1 ? "bg-slate-100 text-slate-600" :
                              index === 2 ? "bg-orange-50 text-orange-700" :
                                "text-slate-400"
                          }`}>
                          {index + 1}
                        </span>
                        {index < 3 && (
                          <span className="text-xl">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {user.username}
                        </span>
                        <span className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
                          Active Participant
                        </span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-3xl font-black text-slate-900 group-hover:scale-110 transition-transform origin-right">
                          {user.totalCombinedScore?.toFixed(2) || "0.00"}
                        </span>
                        <div className="w-16 h-1 bg-indigo-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-slate-400 font-medium">No users found on the leaderboard yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MajorRankList;
