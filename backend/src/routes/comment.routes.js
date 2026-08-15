import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
} from "../controllers/comment.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/:postId", protect, getCommentsByPost);
router.post("/", protect, createComment);
router.delete("/:id", protect, deleteComment);

export default router;
