import express from "express";
import {
  getAllUser,
  getUser,
  getUserById,
  login,
  register,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getUser);
router.get("/:id", protect, getUserById);
router.get("/", protect, getAllUser);

export default router;
