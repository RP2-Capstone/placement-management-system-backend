import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Both Admin & Coordinator
router.use(protect, authorize("ADMIN", "COORDINATOR"));

router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;