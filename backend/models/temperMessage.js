import mongoose from "mongoose";

const temperMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TemperGroup",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

temperMessageSchema.index({ groupId: 1, createdAt: 1 });

export default mongoose.model("TemperMessage", temperMessageSchema);
