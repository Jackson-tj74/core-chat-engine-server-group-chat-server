
import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.post("/", protect('user'), sendMessage);


router.get("/:chatId", protect('user'), getMessages);

export default router;