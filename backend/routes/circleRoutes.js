import express from "express";
import { createCircle, joinCircle, getMyCircles, getCircleLeaderboard, deleteCircle, getChatHistory } from "../controllers/circleController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createCircle);
router.post("/join", protect, joinCircle);
router.get("/my-circles", protect, getMyCircles);
router.get("/:slug/leaderboard", protect, getCircleLeaderboard);
router.get("/:slug/messages", protect, getChatHistory);
router.delete("/:slug", protect, deleteCircle);

export default router;
