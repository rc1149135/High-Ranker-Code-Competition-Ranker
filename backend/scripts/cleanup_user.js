import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/users.js';
import Submission from '../models/submission.js';
import Message from '../models/message.js';
import TemperMessage from '../models/temperMessage.js';
import Circle from '../models/circle.js';
import TemperGroup from '../models/temperGroup.js';
import PlatformAccount from '../models/platformAccounts.js';

dotenv.config({ path: './.env' });

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username: 'Yayati' });
    const userId = user ? user._id : null;
    
    if (user) {
      console.log(`Cleaning up user: ${user.username} (${userId})`);

      // 1. Delete Submissions
      const submissionResult = await Submission.deleteMany({ user: userId });
      console.log(`Deleted ${submissionResult.deletedCount} submissions`);

      // 2. Delete Messages
      const messageResult = await Message.deleteMany({ sender: userId });
      console.log(`Deleted ${messageResult.deletedCount} circle messages`);

      const temperMessageResult = await TemperMessage.deleteMany({ sender: userId });
      console.log(`Deleted ${temperMessageResult.deletedCount} temper messages`);

      // 3. Remove from Circles
      const circleResult = await Circle.updateMany(
        { members: userId },
        { $pull: { members: userId } }
      );
      console.log(`Removed from ${circleResult.modifiedCount} circles`);

      // 4. Remove from TemperGroups
      const temperGroups = await TemperGroup.find({ members: userId });
      for (const group of temperGroups) {
        group.members.pull(userId);
        if (group.temperRankings) {
          group.temperRankings.delete(userId.toString());
        }
        if (group.currentChallenger && group.currentChallenger.equals(userId)) {
          group.currentChallenger = null;
          group.isSelectionPhase = true;
          group.activeProblem = null;
        }
        await group.save();
      }
      console.log(`Cleaned up ${temperGroups.length} temper groups`);
    } else {
      console.log('User Yayati document already deleted. Checking for orphans...');
    }

    // 5. Delete Platform Accounts (including orphans)
    const allAccounts = await PlatformAccount.find({});
    let orphanCount = 0;
    for (const acc of allAccounts) {
      const userExists = await User.exists({ _id: acc.user });
      if (!userExists || (userId && acc.user.equals(userId))) {
        await PlatformAccount.deleteOne({ _id: acc._id });
        orphanCount++;
      }
    }
    console.log(`Deleted ${orphanCount} platform accounts (including orphans)`);

    // 6. Final Delete User (if still exists)
    if (userId) {
      await User.deleteOne({ _id: userId });
    }
    console.log('User cleanup finished');

    mongoose.connection.close();
  } catch (err) {
    console.error('Cleanup error:', err);
    process.exit(1);
  }
}

cleanup();
