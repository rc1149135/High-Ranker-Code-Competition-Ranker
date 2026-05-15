import { useState, useEffect } from "react";
import api from "../api/axios";

function CodeForcesRankList() {
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/api/leaderboard/codeforces");
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to fetch Codeforces leaderboard:", err);
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
        platformName: "codeforces",
        platformUsername: username,
      });
      setUsername("");
      fetchLeaderboard();
      alert("Account linked successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to link account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">CodeForces Leaderboard</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 max-w-2xl">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">Link your Codeforces Account</h2>
        <form onSubmit={handleLinkAccount} className="flex gap-3">
          <input
            type="text"
            value={username}
            placeholder="Enter Codeforces Handle"
            className="flex-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-400 transition-all"
          >
            {isSubmitting ? "Linking..." : "Link Account"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-slate-500 font-semibold uppercase text-xs">Rank</th>
              <th className="p-4 text-slate-500 font-semibold uppercase text-xs">User</th>
              <th className="p-4 text-slate-500 font-semibold uppercase text-xs">Handle</th>
              <th className="p-4 text-slate-500 font-semibold uppercase text-xs">Rating</th>
              <th className="p-4 text-slate-500 font-semibold uppercase text-xs">Rank Title</th>
              <th className="p-4 text-slate-500 font-semibold uppercase text-xs text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={account._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-400">#{index + 1}</td>
                <td className="p-4 font-bold text-slate-800">{account.user?.username}</td>
                <td className="p-4 text-slate-600">{account.platformUsername}</td>
                <td className="p-4 font-mono text-indigo-600 font-bold">{account.stats?.rating || 0}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold capitalize">
                    {account.stats?.rankTitle || "Unrated"}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-slate-900">{account.platformScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CodeForcesRankList;