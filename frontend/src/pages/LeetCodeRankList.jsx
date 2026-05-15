import { useEffect, useState } from "react";
import api from "../api/axios";

const LeetCodeRankList = () => {
    const [rankList, setRankList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [platformUsername, setPlatformUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get("/api/leaderboard/leetcode");
            setRankList(response.data);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        } finally {
            setLoading(false);
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
                platformName: "leetcode",
                platformUsername: platformUsername
            });
            setPlatformUsername("");
            alert("Account linked successfully!");
            fetchLeaderboard();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to link account. Make sure the username is correct.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Leaderboard...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">LeetCode Leaderboard</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
                <h2 className="text-lg font-semibold mb-4 text-slate-700">Link your LeetCode Account</h2>
                <form onSubmit={handleLinkAccount} className="flex gap-4">
                    <input 
                        type="text" 
                        placeholder="Enter LeetCode Username" 
                        value={platformUsername}
                        onChange={(e) => setPlatformUsername(e.target.value)}
                        required
                        className="flex-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? "Linking..." : "Link Account"}
                    </button>
                </form>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-4 font-semibold text-slate-600">Rank</th>
                            <th className="p-4 font-semibold text-slate-600">User</th>
                            <th className="p-4 font-semibold text-slate-600">Platform ID</th>
                            <th className="p-4 font-semibold text-slate-600">Easy</th>
                            <th className="p-4 font-semibold text-slate-600">Medium</th>
                            <th className="p-4 font-semibold text-slate-600">Hard</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankList.map((account, index) => (
                            <tr key={account._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-500">#{index + 1}</td>
                                <td className="p-4 font-bold text-slate-800">{account.user?.username}</td>
                                <td className="p-4 text-slate-600">{account.platformUsername}</td>
                                <td className="p-4 text-green-600 font-medium">{account.stats?.easy || 0}</td>
                                <td className="p-4 text-yellow-600 font-medium">{account.stats?.medium || 0}</td>
                                <td className="p-4 text-red-600 font-medium">{account.stats?.hard || 0}</td>
                                <td className="p-4 text-right font-bold text-indigo-600">{account.platformScore}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeetCodeRankList;