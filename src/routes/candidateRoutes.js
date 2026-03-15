import express from "express";
import {
  createCandidates,
  getAllCandidates,
  updateCandidate,
} from "../controllers/candidateController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Both Admin & Coordinator
router.use(protect, authorize("ADMIN", "COORDINATOR"));

router.post("/", createCandidates);
router.get("/", getAllCandidates);
router.put("/:id", updateCandidate);

export default router;
