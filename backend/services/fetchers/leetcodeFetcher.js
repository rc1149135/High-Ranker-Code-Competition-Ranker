import axios from "axios";

export default async function fetchLeetCodeStats(username) {
    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query: `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        submitStats: submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                    }
                }
            `,
            variables: { username }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            }
        });
        const data = response.data;
        if (data.errors) {
            throw new Error("User not found on LeetCode");
        }
        const stats = data.data.matchedUser.submitStats.acSubmissionNum;        
        const easy = stats.find(s => s.difficulty === 'Easy').count;
        const medium = stats.find(s => s.difficulty === 'Medium').count;
        const hard = stats.find(s => s.difficulty === 'Hard').count;
        return { easy, medium, hard };
    } catch (error) {
        console.error("LeetCode Fetch Error:", error.message);
        return null;
    }
}