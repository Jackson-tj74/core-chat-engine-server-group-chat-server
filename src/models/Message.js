import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    receiver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    content: { 
      type: String, 
      required: [true, "Message content cannot be empty"],
      trim: true 
    },
    chatId: { 
      type: String, 
      required: true,
      index: true 
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent"
    }
  },
  { timestamps: true }
);


messageSchema.index({ chatId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;