import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // Note: The SDK doesn't have a direct listModels, but we can try to guess or use the rest API
    // Actually, let's just try gemini-1.5-flash and gemini-pro one by one.
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("test");
            console.log(`Model ${m} is available and working.`);
            return;
        } catch (e) {
            console.log(`Model ${m} failed: ${e.message}`);
        }
    }
  } catch (err) {
    console.error(err);
  }
}

listModels();
