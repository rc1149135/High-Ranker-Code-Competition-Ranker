import cron from 'node-cron';
import PlatformAccountModel from '../models/platformAccounts.js';
import * as fetchers from './fetchers/index.js'; 
import calculateScores from './scoring/platformScore.js';

const syncAllPlatforms = async () => {
  console.log('--- Starting Global Sync ---');
  
  try {
    const accounts = await PlatformAccountModel.find({});

    for (const account of accounts) {
      const platform = account.platformName.toLowerCase();
      const username = account.platformUsername;

      const fetcherFunction = fetchers[platform];

      if (!fetcherFunction) {
        console.warn(`No fetcher found for platform: ${platform}`);
        continue;
      }

      try {
        const freshStats = await fetcherFunction(username);

        if (freshStats) {
          const { platformScore, normalizedScore } = calculateScores(platform, freshStats);

          account.stats = freshStats;
          account.platformScore = platformScore;
          account.normalizedScore = normalizedScore;
          account.lastUpdated = new Date();

          await account.save();
          // console.log(`Successfully synced ${platform} for ${username}`);
        }
      } catch (error) {
        console.error(`Failed to sync ${platform} for ${username}:`, error.message);
      }
    }
    console.log('--- Global Sync Finished ---');
  } catch (err) {
    console.error('Critical Sync Error:', err);
  }
};
cron.schedule('* * 6 * *', syncAllPlatforms);
export default syncAllPlatforms;