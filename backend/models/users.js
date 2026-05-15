import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { 
    type: String,
    unique: true,
    trim: true
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String,
    required: true,
    minlength: 6
  },
  localScore: { 
    type: Number,
    default: 0
  },
  totalCombinedScore: { 
    type: Number,
    default: 0
  },
  solvedProblems: [{
    problemId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Problem' 
    },
    bestCode: String,
    status: {
      type: String,
      enum: ["Accepted", "Solved"]
    }
  }],
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const UserModel = mongoose.model("user", userSchema);
export default UserModel;