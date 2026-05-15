import UserModel from "../models/users.js";
import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import { executeCode } from "../utils/executor.js";

export const submitCode = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const userId = req.user._id;

        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        let overallStatus = "Accepted";
        for (const testCase of problem.testCases) {
            const result = await executeCode(code, language, testCase.input);
            if (result.status !== "Success" || result.output !== testCase.expectedOutput.trim()) {
                overallStatus = result.status === "Success" ? "Wrong Answer" : result.status;
                break;
            }
        }

        const newSubmission = await Submission.create({
            user: userId,
            problem: problemId,
            code,
            language,
            status: overallStatus
        });

        if (overallStatus === "Accepted") {
            const user = await UserModel.findById(userId);
            
            const alreadySolved = user.solvedProblems.find(
                (p) => p.problemId.toString() === problemId
            );

            if (!alreadySolved) {
                const normalizationFactor = 0.1; 
                const normalizedPoints = (problem.points || 10) * normalizationFactor;

                user.solvedProblems.push({
                    problemId: problemId,
                    bestCode: code,
                    status: "Accepted"
                });

                user.localScore += normalizedPoints;
                user.totalCombinedScore += normalizedPoints; 
                
                user.localScore = parseFloat(user.localScore.toFixed(2));
                user.totalCombinedScore = parseFloat(user.totalCombinedScore.toFixed(2));
                
                await user.save();
            }

            // Award Temper Group points regardless of whether it was solved before globally
            // but ONLY if the round is active and user hasn't gotten points for this round yet
            const TemperGroup = (await import("../models/temperGroup.js")).default;
            const activeTemperGroups = await TemperGroup.find({
                members: userId,
                activeProblem: problemId,
                roundEndTime: { $gt: new Date() },
                isSelectionPhase: false
            });

            for (const group of activeTemperGroups) {
                // Check if user already solved it in THIS round (using a rough check or a specific flag)
                // For now, if the score is already > 0 for this user in this round, we skip?
                // Actually, the user might have solved multiple problems? No, one problem per round.
                // If they have 0 points, we award them.
                const currentScore = group.temperRankings.get(userId.toString()) || 0;
                if (currentScore === 0) {
                    group.temperRankings.set(userId.toString(), problem.points || 10);
                    await group.save();
                }
            }
        }

        res.status(201).json({ status: overallStatus, submission: newSubmission });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};