/** @format */
import User from "../models/User.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ New Socket Connection:", socket.id);

    // 1. INITIAL SETUP
    // When a user logs in, they join a private room named after their User ID.
    // This allows us to send them private notifications.
    socket.on("setup", async (userId) => {
      if (!userId) return;
      socket.join(userId);
      
      // Mark user as Online in MongoDB
      await User.findByIdAndUpdate(userId, { isOnline: true });
      
      // Notify all other users that this person is now online
      socket.broadcast.emit("user_status_changed", { userId, status: "online" });
      
      socket.emit("connected");
      console.log(`User ${userId} joined their personal room.`);
    });

    // 2. JOINING A CONVERSATION
    // Users join a "Room" based on their Chat ID to keep messages private.
    socket.on("join_chat", (room) => {
      socket.join(room);
      console.log("User Joined Chat Room: " + room);
    });

    // 3. TYPING INDICATORS (Professional Touch)
    // Shows "Alice is typing..." in your UI
    socket.on("typing", (room) => socket.in(room).emit("typing", room));
    socket.on("stop_typing", (room) => socket.in(room).emit("stop_typing", room));

    // 4. HANDLING NEW MESSAGES
    // When a message is sent, we broadcast it ONLY to the people in that room.
    socket.on("new_message", (newMessageReceived) => {
      const { chatId, sender, content } = newMessageReceived;

      if (!chatId) return console.log("Chat ID not defined");

      // Send the message to everyone in the room except the sender
      socket.in(chatId).emit("message_received", newMessageReceived);
      
      // Optional: Send a notification to the receiver's personal room
      // if they are not currently looking at this specific chat.
      if (newMessageReceived.receiverId) {
        socket.in(newMessageReceived.receiverId).emit("notification_received", newMessageReceived);
      }
    });

    // 5. DISCONNECT / OFFLINE LOGIC
    socket.on("disconnect", () => {
      console.log("User Disconnected ");
      // Note: You can add logic here to set isOnline: false in DB
      // but usually, it's better to use a 'logout' event for accuracy.
    });
  });
};

export default chatSocket;