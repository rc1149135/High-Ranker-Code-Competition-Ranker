import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { 
    createTemperGroup, 
    joinTemperGroup, 
    getMyTemperGroups, 
    getTemperBattleState,
    throwProblem,
    rotateChallenger,
    deleteTemperGroup,
    getTemperMessages
} from "../controllers/temperController.js";

const router = express.Router();

router.post("/create", protect, createTemperGroup);
router.post("/join", protect, joinTemperGroup);
router.get("/my-groups", protect, getMyTemperGroups);
router.get("/:slug/battle", protect, getTemperBattleState);
router.post("/:slug/throw", protect, throwProblem);
router.post("/:slug/rotate", protect, rotateChallenger);
router.delete("/:slug", protect, deleteTemperGroup);
router.get("/:slug/messages", protect, getTemperMessages);

export default router;
