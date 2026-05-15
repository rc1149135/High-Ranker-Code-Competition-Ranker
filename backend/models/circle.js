import mongoose from "mongoose";

const circleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },
  inviteCode: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    minlength: 6, 
    maxlength: 6 
  },
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user" 
  }],
  description: {
    type: String,
    default: "A private squad for competitive programming."
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Mongoose automatically creates unique indexes for slug and inviteCode
export default mongoose.model("Circle", circleSchema);
