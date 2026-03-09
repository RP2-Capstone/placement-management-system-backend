import express from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  validateContactCreate,
  validateContactUpdate,
} from "../middleware/validateMiddleware.js";

const router = express.Router();

// Both ADMIN & COORDINATOR
router.use(protect, authorize("ADMIN", "COORDINATOR"));

router.post("/", validateContactCreate, createContact);
router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.put("/:id", validateContactUpdate, updateContact);
router.delete("/:id", deleteContact);

export default router;