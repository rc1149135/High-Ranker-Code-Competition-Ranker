import TemperGroup from "../models/temperGroup.js";
import User from "../models/users.js";
import Problem from "../models/problem.js";

export const createTemperGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await TemperGroup.create({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id],
      temperRankings: { [req.user.id]: 0 }
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const joinTemperGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const group = await TemperGroup.findOne({ inviteCode });
    if (!group) return res.status(404).json({ error: "Invalid invite code" });

    if (group.members.includes(req.user.id)) {
      return res.status(200).json(group);
    }

    group.members.push(req.user.id);
    group.temperRankings.set(req.user.id.toString(), 0);
    await group.save();
    res.status(200).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMyTemperGroups = async (req, res) => {
  try {
    const groups = await TemperGroup.find({ members: req.user.id });
    res.status(200).json(groups);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const rotateChallengerInternal = async (group) => {
    // Filter to ensure we only pick from current members
    if (group.members.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * group.members.length);
    group.currentChallenger = group.members[randomIndex];
    group.isSelectionPhase = true;
    group.activeProblem = null;
    group.roundStartTime = null;
    group.roundEndTime = null;
    
    // Reset rankings for the new round
    group.members.forEach(memberId => {
        group.temperRankings.set(memberId.toString(), 0);
    });
    
    await group.save();
};

export const getTemperBattleState = async (req, res) => {
  try {
    const { slug } = req.params;
    const group = await TemperGroup.findOne({ slug })
      .populate("members", "username")
      .populate("currentChallenger", "username")
      .populate("activeProblem", "title difficulty points slug");

    if (!group) return res.status(404).json({ error: "Group not found" });

    // 1. Ghost Challenger Fix: Ensure challenger is still in the group
    const challengerInGroup = group.members.some(m => m._id.toString() === group.currentChallenger?._id?.toString());
    if (group.members.length > 0 && (!group.currentChallenger || !challengerInGroup)) {
        await rotateChallengerInternal(group);
    }

    // 2. Timeout Check: If round expired, rotate automatically
    if (!group.isSelectionPhase && group.roundEndTime && new Date() > new Date(group.roundEndTime)) {
        await rotateChallengerInternal(group);
    }

    // 3. Early Completion Check: If everyone solved the problem, end round early
    if (!group.isSelectionPhase && group.activeProblem && group.roundStartTime) {
        const Submission = (await import("../models/submission.js")).default;
        
        // Use a Set to count unique solvers (since one user might submit multiple times)
        const uniqueSolvers = await Submission.distinct("user", {
            user: { $in: group.members.map(m => m._id) },
            problem: group.activeProblem._id,
            status: "Accepted",
            createdAt: { $gte: group.roundStartTime }
        });

        if (uniqueSolvers.length >= group.members.length) {
            await rotateChallengerInternal(group);
        }
    }

    let hasSolvedActive = false;
    if (!group.isSelectionPhase && group.activeProblem && group.roundStartTime) {
        const Submission = (await import("../models/submission.js")).default;
        hasSolvedActive = await Submission.exists({
            user: req.user.id,
            problem: group.activeProblem._id,
            status: "Accepted",
            createdAt: { $gte: group.roundStartTime }
        });
    }

    res.status(200).json({ ...group.toObject(), hasSolvedActive: !!hasSolvedActive });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const throwProblem = async (req, res) => {
    try {
        const { slug } = req.params;
        const { problemId, durationMinutes } = req.body;

        const group = await TemperGroup.findOne({ slug });
        
        // Prevent double-throwing or throwing during active round
        if (!group.isSelectionPhase) {
            return res.status(400).json({ error: "Mission already in progress" });
        }

        if (group.currentChallenger.toString() !== req.user.id) {
            return res.status(403).json({ error: "Only the current inquisitor can throw a challenge" });
        }

        const startTime = new Date();
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + parseInt(durationMinutes));

        group.activeProblem = problemId;
        group.roundStartTime = startTime;
        group.roundEndTime = endTime;
        group.isSelectionPhase = false;
        await group.save();

        res.status(200).json(group);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const rotateChallenger = async (req, res) => {
    try {
        const { slug } = req.params;
        const group = await TemperGroup.findOne({ slug });
        if (group.admin.toString() !== req.user.id) {
            return res.status(403).json({ error: "Only admin can manually rotate" });
        }
        await rotateChallengerInternal(group);
        res.status(200).json(group);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteTemperGroup = async (req, res) => {
    try {
        const { slug } = req.params;
        const group = await TemperGroup.findOne({ slug });
        if (!group) return res.status(404).json({ error: "Group not found" });

        if (group.admin.toString() !== req.user.id) {
            return res.status(403).json({ error: "Only the creator can delete this group" });
        }

        await TemperGroup.deleteOne({ slug });
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getTemperMessages = async (req, res) => {
    try {
        const { slug } = req.params;
        const group = await TemperGroup.findOne({ slug });
        if (!group) return res.status(404).json({ error: "Group not found" });

        const messages = await (await import("../models/temperMessage.js")).default.find({ groupId: group._id })
            .sort({ createdAt: 1 })
            .limit(50);
        res.status(200).json(messages);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
