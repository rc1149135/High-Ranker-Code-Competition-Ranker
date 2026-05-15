import axios from "axios";

async function fetchGFGStats(username) {
  try {
    const url = `https://www.geeksforgeeks.org/user/${username}/`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    // Extract Coding Score (The big number on the GFG profile)
    const scoreMatch = data.match(/scoreCard_card_left_column_score__[\s\S]*?>(\d+)</);
    const codingScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    // Extract Total Problems Solved
    const solvedMatch = data.match(/scoreCard_card_left_column_score__[\s\S]*?Total Problems Solved[\s\S]*?>(\d+)</);
    const totalSolved = solvedMatch ? parseInt(solvedMatch[1]) : 0;

    // Extract Monthly Score if available
    const monthlyMatch = data.match(/Monthly Coding Score[\s\S]*?>(\d+)</);
    const monthlyScore = monthlyMatch ? parseInt(monthlyMatch[1]) : 0;

    if (!codingScore && !totalSolved) return null;

    return {
      codingScore,
      totalSolved,
      monthlyScore,
      rankTitle: codingScore > 500 ? "Geek Enthusiast" : "Beginner"
    };
  } catch (error) {
    console.error("GFG Fetch Error:", error.message);
    return null;
  }
}

export default fetchGFGStats;