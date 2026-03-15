import express from "express";
import {
  createCompany,
  getAllCompanies,
  getAllCompanyName,
  getCompanyById,
  getDashboardCounts,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateCompany, validateCompanyUpdate } from "../middleware/validateMiddleware.js";

const router = express.Router();

// View → Both ADMIN & COORDINATOR
router.get("/", protect, authorize("ADMIN", "COORDINATOR"), getAllCompanies);
router.get("/names", protect, authorize("ADMIN", "COORDINATOR"), getAllCompanyName);
router.get("/dashboard-counts", protect, authorize("ADMIN", "COORDINATOR"), getDashboardCounts);
router.get("/:id", protect, authorize("ADMIN", "COORDINATOR"), getCompanyById);

// Modify → ADMIN only
router.post("/", protect, authorize("ADMIN"), validateCompany, createCompany);
router.put("/:id", protect, authorize("ADMIN"), validateCompanyUpdate, updateCompany);
router.delete("/:id", protect, authorize("ADMIN"), deleteCompany);

export default router;
