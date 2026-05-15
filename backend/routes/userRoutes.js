import express from "express"

import { getMyStats, getCodespaceLeaderboard, deleteProfile } from "../controllers/userController.js"
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-stats", protect, getMyStats);
router.get("/leaderboard/codespace", protect, getCodespaceLeaderboard);
router.delete("/profile", protect, deleteProfile);

export default router;