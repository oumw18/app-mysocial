import express from "express";
import {
  LikePost,
  UnlikePost,
  getLikesByPost,
} from "../controllers/like.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/", protect, LikePost);
router.get("/:postId", protect, getLikesByPost);
router.delete("/:id", protect, UnlikePost);

export default router;
