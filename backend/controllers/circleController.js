import Circle from "../models/circle.js";
import User from "../models/users.js";
import Message from "../models/message.js";
import crypto from "crypto";

const generateInviteCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

export const createCircle = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        let slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        
        const existingSlug = await Circle.findOne({ slug });
        if (existingSlug) {
            slug = `${slug}-${crypto.randomBytes(2).toString('hex')}`;
        }

        const inviteCode = generateInviteCode();

        const newCircle = await Circle.create({
            name,
            slug,
            description,
            inviteCode,
            admin: userId,
            members: [userId]
        });

        res.status(201).json(newCircle);
    } catch (err) {
        res.status(500).json({ error: "Failed to create circle" });
    }
};

export const joinCircle = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const userId = req.user.id;

        const circle = await Circle.findOne({ inviteCode: inviteCode.toUpperCase() });
        if (!circle) return res.status(404).json({ error: "Invalid invite code" });

        if (circle.members.includes(userId)) {
            return res.status(400).json({ error: "You are already a member of this circle" });
        }

        circle.members.push(userId);
        await circle.save();

        res.status(200).json({ message: "Joined circle successfully", slug: circle.slug });
    } catch (err) {
        res.status(500).json({ error: "Failed to join circle" });
    }
};

export const getMyCircles = async (req, res) => {
    try {
        const userId = req.user.id;
        const circles = await Circle.find({ members: userId }).select("name slug description members");
        res.status(200).json(circles);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your circles" });
    }
};

export const getCircleLeaderboard = async (req, res) => {
    try {
        const { slug } = req.params;
        const { platform } = req.query;
        const userId = req.user.id;

        const circle = await Circle.findOne({ slug }).populate({
            path: "members",
            select: "username localScore totalCombinedScore solvedProblems leetcodeScore codeforcesScore"
        });

        if (!circle) return res.status(404).json({ error: "Circle not found" });

        const activeMembers = circle.members.filter(m => m !== null);

        let sortedMembers = [...activeMembers];
        if (platform === "leetcode") {
            sortedMembers.sort((a, b) => (b.leetcodeScore || 0) - (a.leetcodeScore || 0));
        } else if (platform === "codeforces") {
            sortedMembers.sort((a, b) => (b.codeforcesScore || 0) - (a.codeforcesScore || 0));
        } else if (platform === "codespace") {
            sortedMembers.sort((a, b) => (b.localScore || 0) - (a.localScore || 0));
        } else {
            sortedMembers.sort((a, b) => (b.totalCombinedScore || 0) - (a.totalCombinedScore || 0));
        }

        const leaderboard = sortedMembers.map((member, index) => ({
            rank: index + 1,
            username: member.username,
            score: platform === "leetcode" ? (member.leetcodeScore || 0) :
                   platform === "codeforces" ? (member.codeforcesScore || 0) :
                   platform === "codespace" ? (member.localScore || 0) :
                   (member.totalCombinedScore || 0),
            problemsSolved: member.solvedProblems?.length || 0
        }));

        res.status(200).json({
            circleName: circle.name,
            inviteCode: circle.inviteCode,
            isAdmin: circle.admin.toString() === userId,
            leaderboard
        });
    } catch (err) {
        console.error("Circle Leaderboard Error:", err);
        res.status(500).json({ error: "Failed to fetch circle leaderboard" });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const { slug } = req.params;
        const circle = await Circle.findOne({ slug });
        if (!circle) return res.status(404).json({ error: "Circle not found" });

        const messages = await Message.find({ circleId: circle._id })
            .sort({ createdAt: 1 })
            .limit(50);

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};

export const deleteCircle = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user.id;
        const circle = await Circle.findOne({ slug });
        if (!circle) return res.status(404).json({ error: "Circle not found" });
        if (circle.admin.toString() !== userId) {
            return res.status(403).json({ error: "Only the squad admin can delete this circle" });
        }
        await Circle.deleteOne({ slug });
        res.status(200).json({ message: "Circle deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete circle" });
    }
};
