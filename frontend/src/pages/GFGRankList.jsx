import { useState, useEffect } from "react";
import api from "../api/axios";

function GFGRankList() {
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/api/leaderboard/geeksforgeeks");
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to fetch GFG leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/api/platform-accounts/add", {
        platformName: "geeksforgeeks",
        platformUsername: username,
      });
      setUsername("");
      fetchLeaderboard();
      alert("GFG Account linked successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to link GFG account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">GeeksforGeeks Leaderboard</h1>
        <p className="text-slate-500 mb-8">Rankings based on GFG Coding Score</p>

        {/* Link Account Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 max-w-2xl">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Link your GFG Account</h2>
          <form onSubmit={handleLinkAccount} className="flex gap-3">
            <input
              type="text"
              value={username}
              placeholder="Enter GFG Username"
              className="flex-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-slate-900"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 disabled:bg-slate-400 transition-all"
            >
              {isSubmitting ? "Scraping..." : "Link Account"}
            </button>
          </form>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-slate-500 font-semibold uppercase text-xs">Rank</th>
                <th className="p-4 text-slate-500 font-semibold uppercase text-xs">Student</th>
                <th className="p-4 text-slate-500 font-semibold uppercase text-xs">GFG Handle</th>
                <th className="p-4 text-slate-500 font-semibold uppercase text-xs">Problems Solved</th>
                <th className="p-4 text-slate-500 font-semibold uppercase text-xs text-right">Coding Score</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={account._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-400">#{index + 1}</td>
                  <td className="p-4 font-bold text-slate-800">{account.user?.username}</td>
                  <td className="p-4 text-slate-600 font-mono text-sm">{account.platformUsername}</td>
                  <td className="p-4 font-semibold text-slate-700">{account.stats?.totalSolved || 0}</td>
                  <td className="p-4 text-right">
                    <span className="text-lg font-bold text-green-600">{account.platformScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GFGRankList;