import { GoogleGenerativeAI } from "@google/generative-ai";
import Problem from "../models/problem.js";

export const auditCode = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "Gemini API Key not configured in server environment." });
        }

        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ error: "Problem not found" });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            You are a world-class competitive programming coach and technical interviewer.
            The user is working on the following problem:
            
            Title: ${problem.title}
            Description: ${problem.description}
            Difficulty: ${problem.difficulty}
            
            The user submitted the following code in ${language}:
            
            \`\`\`${language}
            ${code}
            \`\`\`
            
            Please provide a structured audit of this code:
            1. **Time & Space Complexity**: Analyze the Big-O complexity.
            2. **Logic & Correctness**: Briefly mention if the logic is sound or if there are edge cases missed.
            3. **Optimization Tips**: Suggest 2-3 specific ways to make the code faster or more memory-efficient.
            4. **Clean Code**: Suggest 1-2 naming or structural improvements.
            
            Keep the response concise, professional, and formatted in Markdown. Use a tone that is encouraging but technically rigorous.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ audit: text });
    } catch (err) {
        console.error("AI Audit Error:", err);
        res.status(500).json({ error: "Failed to generate AI audit: " + err.message });
    }
};
