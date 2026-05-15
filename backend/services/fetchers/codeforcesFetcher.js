import axios from "axios";

export default async function fetchCodeforcesStats(handle) {
    try {
        const infoResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        if (infoResponse.data.status !== "OK") throw new Error("User not found");
        const info = infoResponse.data.result[0];
        const statusResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        const submissions = statusResponse.data.result || [];
        const solvedProblems = new Set();
        let easy = 0, medium = 0, hard = 0;

        submissions.forEach(sub => {
            if (sub.verdict === "OK" && sub.problem.rating) {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                if (!solvedProblems.has(problemId)) {
                    solvedProblems.add(problemId);
                    const r = sub.problem.rating;
                    if (r < 1200) easy++;
                    else if (r >= 1200 && r < 1600) medium++;
                    else hard++;
                }
            }
        });
        return {
            rating: info.rating || 0,
            maxRating: info.maxRating || 0,
            rankTitle: info.rank || "unrated",
            avatar: info.titlePhoto || "",
            easy,
            medium,
            hard
        };

    } catch (error) {
        console.error("CF Fetch Error:", error.message);
        return null;
    }
}