import express from "express";
import { getAllProblems, getProblemBySlug } from "../controllers/problemController.js";
import { auditCode } from "../controllers/aiController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllProblems);
router.post("/audit", protect, auditCode);
router.get("/:slug", protect, getProblemBySlug);

export default router;