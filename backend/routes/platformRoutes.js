import express from "express";
import { 
    addPlatformAccount, 
    getPlatformLeaderboard,
    getGlobalLeaderboard
} from "../controllers/platformAccountController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/leaderboard/global", getGlobalLeaderboard);

router.post("/platform-accounts/add", protect, addPlatformAccount);

router.get("/leaderboard/:platform", getPlatformLeaderboard); 

export default router;