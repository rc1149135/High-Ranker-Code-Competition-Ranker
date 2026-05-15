import mongoose from "mongoose";
import slugify from "slugify";

const temperGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, trim: true },
  inviteCode: { type: String, unique: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  
  // Battle State
  currentChallenger: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  activeProblem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  roundStartTime: { type: Date },
  roundEndTime: { type: Date },
  isSelectionPhase: { type: Boolean, default: true },
  
  // Independent Rankings
  temperRankings: {
    type: Map,
    of: Number,
    default: {}
  },
  
  createdAt: { type: Date, default: Date.now }
});

temperGroupSchema.pre("save", async function() {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + "-" + Math.random().toString(36).substring(2, 7);
  }
  if (!this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
});

export default mongoose.model("TemperGroup", temperGroupSchema);
