
import express from "express";
import { registerUser, loginUser,getAllUsers } from "../controllers/authController.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();


router.post("/signup", registerUser);


router.post("/login", loginUser);
router.get("/users",protect('client'), getAllUsers);

export default router;