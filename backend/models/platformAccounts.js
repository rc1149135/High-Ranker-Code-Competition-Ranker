import mongoose from "mongoose";

const platformAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  platformName: {
    type: String,
    lowercase: true,
    required: true,
    enum: ["leetcode", "codeforces", "github", "codechef"]
  },
  platformUsername: {
    type: String,
    required: true
  },

  stats: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  platformScore: {
    type: Number,
    default: 0
  },

  normalizedScore: {
    type: Number,
    default: 0
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

platformAccountSchema.index({ platformName: 1, platformScore: -1 });

const PlatformAccountModel = mongoose.model("platformAccount", platformAccountSchema);
export default PlatformAccountModel;