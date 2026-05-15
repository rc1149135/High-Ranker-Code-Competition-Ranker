import * as fetchers from "../services/fetchers/index.js";
import calculateScores from "../services/scoring/platformScore.js";
import PlatformAccountModel from "../models/platformAccounts.js";
import UserModel from "../models/users.js";

export const addPlatformAccount = async (req, res) => {
    const { platformName, platformUsername } = req.body;
    const userId = req.user.id; 

    try {
        const fetcher = fetchers[platformName.toLowerCase()];
        if (!fetcher) return res.status(400).json({ error: "Platform not supported" });

        const rawStats = await fetcher(platformUsername);
        if (!rawStats) return res.status(404).json({ error: "Account not found" });

        const { platformScore, normalizedScore } = calculateScores(platformName, rawStats);

        await PlatformAccountModel.findOneAndUpdate(
            { user: userId, platformName: platformName.toLowerCase() },
            { platformUsername, stats: rawStats, platformScore, normalizedScore },
            { upsert: true, returnDocument: 'after' }
        );

        const allAccounts = await PlatformAccountModel.find({ user: userId });
        const totalExternal = allAccounts.reduce((sum, acc) => sum + acc.normalizedScore, 0);
        
        const user = await UserModel.findById(userId);
        const currentLocalScore = user.localScore || 0;

        const finalGlobalScore = parseFloat((totalExternal + currentLocalScore).toFixed(2));
        
        await UserModel.findByIdAndUpdate(userId, { totalCombinedScore: finalGlobalScore });

        res.status(201).json({ 
            message: `${platformName} linked successfully`, 
            totalCombinedScore: finalGlobalScore 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getPlatformLeaderboard = async (req, res) => {
    const { platform } = req.params;
    try {
        const list = await PlatformAccountModel.find({ platformName: platform.toLowerCase() })
            .sort({ platformScore: -1 }) 
            .populate("user", "username") 
            .limit(50);

        res.status(200).json(list);
    } catch (err) {
        res.status(500).json({ error: `${platform} fetch failed` });
    }
};

export const getGlobalLeaderboard = async (req, res) => {
    try {
        const globalList = await UserModel.find()
            .sort({ totalCombinedScore: -1 })
            .select("username totalCombinedScore")
            .limit(50);

        res.status(200).json(globalList);
    } catch (err) {
        res.status(500).json({ error: "Global leaderboard fetch failed" });
    }
};