
import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.post("/", protect('clients'), sendMessage);


router.get("/:chatId", protect('clients'), getMessages);

export default router;