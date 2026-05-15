const scoringStrategies = {
  leetcode: (stats) => {
    if (!stats) return 0;
    const { easy = 0, medium = 0, hard = 0 } = stats;
    return (easy * 1) + (medium * 3) + (hard * 5);
  },
  codeforces: (stats) => {
    if (!stats) return 0;
    const { easy = 0, medium = 0, hard = 0, rating = 0 } = stats;
    const problemScore = (easy * 2) + (medium * 5) + (hard * 10);
    const ratingBonus = Math.floor(rating / 10); 
    return problemScore + ratingBonus;
  },
  geeksforgeeks: (stats) => {
    if (!stats) return 0;
    return stats.codingScore || 0;
  },
  atcoder: (stats) => {
    if (!stats) return 0;
    return stats.rating || 0;
}
};


const platformMaxScores = {
  leetcode: 5000,
  codeforces: 8000,
  geeksforgeeks: 6000,
  atcoder: 4000
};


export default function calculateScores(platformName, stats) {
  const platform = platformName.toLowerCase();
  const strategy = scoringStrategies[platform];

  if (!strategy) {
    console.warn(`No scoring strategy found for platform: ${platform}`);
    return { platformScore: 0, normalizedScore: 0 };
  }

  const platformScore = strategy(stats);

  const max = platformMaxScores[platform] || 1000;
  let normalizedScore = (platformScore / max) * 100;

  normalizedScore = Math.min(Math.max(normalizedScore, 0), 100);

  return {
    platformScore,
    normalizedScore: parseFloat(normalizedScore.toFixed(2))
  };
}