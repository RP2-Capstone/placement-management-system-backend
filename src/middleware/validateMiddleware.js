import { body, validationResult } from "express-validator";

export const validateCompany = [
  body("companyName").notEmpty().withMessage("Company name is required"),
  body("website").optional().isURL().withMessage("Invalid website URL"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateCompanyUpdate = [
  body("companyName")
    .optional()
    .notEmpty()
    .withMessage("Company name cannot be empty"),

  body("website")
    .optional()
    .isURL()
    .withMessage("Invalid website URL"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update"
      });
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];


export const validateContactCreate = [
  body("companyId").notEmpty().withMessage("Company is required"),
  body("name").notEmpty().withMessage("Contact name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("phone").notEmpty().withMessage("Phone number required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

export const validateContactUpdate = [
  body("name").optional().notEmpty(),
  body("email").optional().isEmail(),
  body("phone").optional().notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];