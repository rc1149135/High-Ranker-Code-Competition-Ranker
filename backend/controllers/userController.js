import UserModel from "../models/users.js";
import PlatformAccountModel from "../models/platformAccounts.js";
import SubmissionModel from "../models/submission.js";

export const getCodespaceLeaderboard = async (req, res) => {
    try {
        const leaderboard = await UserModel.find()
            .select("username localScore solvedProblems")
            .sort({ localScore: -1, "solvedProblems.length": -1 })
            .lean();

        const formattedData = leaderboard.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            score: user.localScore || 0,
            problemsSolved: user.solvedProblems?.length || 0
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ error: "Error fetching Codespace leaderboard" });
    }
};

export const getMyStats = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const rank = await UserModel.countDocuments({ 
            totalCombinedScore: { $gt: user.totalCombinedScore } 
        }) + 1;

        const accounts = await PlatformAccountModel.find({ user: userId });
        const leetcode = accounts.find(a => a.platformName === "leetcode");
        const codeforces = accounts.find(a => a.platformName === "codeforces");
        const codechef = accounts.find(a => a.platformName === "codechef");

        res.status(200).json({
            totalScore: user.totalCombinedScore || 0,
            rank: rank,
            codespaceSolved: user.solvedProblems?.length || 0,
            leetcodeSolved: leetcode ? 
                ((leetcode.stats.easy || 0) + (leetcode.stats.medium || 0) + (leetcode.stats.hard || 0)) : 0,
            cfRating: codeforces ? (codeforces.stats.rating || 0) : 0,
            codechefRating: codechef ? (codechef.stats.rating || 0) : 0
        });
    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ error: "Failed to load dashboard data" });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        await PlatformAccountModel.deleteMany({ user: userId });
        await SubmissionModel.deleteMany({ user: userId });
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "Profile and all associated data deleted successfully" });
    } catch (err) {
        console.error("Delete Profile Error:", err);
        res.status(500).json({ error: "Failed to delete profile" });
    }
};