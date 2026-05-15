import express from "express";
import { submitCode } from "../controllers/submissionController.js"

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/submit", protect, submitCode);

export default router;