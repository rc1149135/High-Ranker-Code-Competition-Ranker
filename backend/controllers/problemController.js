import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import UserModel from "../models/users.js";

export const getAllProblems = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select("solvedProblems");
        const problems = await Problem.find().select("-testCases").lean();

        const solvedIds = user ? user.solvedProblems.map(p => p.problemId.toString()) : [];

        const problemsWithStatus = problems.map(p => ({
            ...p,
            solved: solvedIds.includes(p._id.toString())
        }));

        res.status(200).json(problemsWithStatus);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

export const getProblemBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const problem = await Problem.findOne({ slug });

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({ message: "Error fetching problem details", error: error.message });
    }
};