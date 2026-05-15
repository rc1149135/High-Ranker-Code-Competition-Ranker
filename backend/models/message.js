import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  circleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Circle",
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

messageSchema.index({ circleId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
