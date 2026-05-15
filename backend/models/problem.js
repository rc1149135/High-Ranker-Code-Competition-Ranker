import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ["Easy", "Medium", "Hard"], 
    default: "Easy" 
  },
  tags: [String],
  companies: {
    type: [String],
    required: true
  },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
  }],
  
  points: { type: Number, default: 10 },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Problem", problemSchema);