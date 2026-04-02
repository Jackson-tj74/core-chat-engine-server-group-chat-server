import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Please add a name"] 
    },
    email: { 
      type: String, 
      required: [true, "Please add an email"], 
      unique: true,
      lowercase: true 
    },
    password: { 
      type: String, 
      required: [true, "Please add a password"],
      minlength: 6,
      select: false 
    },
    avatar: { 
      type: String, 
      default: "https://ui-avatars.com/api/?background=random" 
    },
    role: { 
      type: String, 
      enum: ["admin", "client", "provider"], 
      default: "client" 
    },
    isOnline: { 
      type: Boolean, 
      default: false 
    },
    lastSeen: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;