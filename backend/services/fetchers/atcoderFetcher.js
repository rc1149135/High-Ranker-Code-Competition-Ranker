import axios from "axios";

async function fetchAtCoderStats(username) {
  try {
    const url = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/info?user=${username}`;
    const { data } = await axios.get(url);

    if (!data || !data.user_id) return null;

    return {
      rating: data.rating || 0,
      highestRating: data.highest_rating || 0,
      rank: data.rank || "N/A",
      acceptedCount: data.accepted_count || 0,
      rankTitle: data.rating >= 2800 ? "Red (Grandmaster)" : "Competitor"
    };
  } catch (error) {
    console.error("AtCoder API Error:", error.message);
    return null;
  }
}

export default fetchAtCoderStats;