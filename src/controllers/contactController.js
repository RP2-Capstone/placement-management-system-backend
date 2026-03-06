import Contact from "../models/Contact.js";
import Company from "../models/Company.js";

// Add Contact
export const createContact = async (req, res, next) => {
    try {
        const company = await Company.findById(req.body.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const contact = await Contact.create(req.body);

        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

// Get All Contacts (for table)
export const getAllContacts = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, keyword, companyId } = req.query;

        const queryObject = { isDeleted: false };

        // 🔎 Search by name or email
        if (keyword) {
            queryObject.$or = [
                { name: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
                {companyId: await Company.find({ companyName: { $regex: keyword, $options: "i" } }).distinct("_id") }
            ];
        }

        //  Filter by company
        if (companyId) {
            queryObject.companyId = companyId;
        }

        const skip = (page - 1) * limit;

        const contacts = await Contact.find(queryObject)
            .populate("companyId", "companyName")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Contact.countDocuments(queryObject);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: contacts,
        });
    } catch (error) {
        next(error);
    }
};

// Get Contact by ID (for edit form)
export const getContactById = async (req, res, next) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            isDeleted: false,
        }).populate("companyId", "companyName");

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

// Update Contact
export const updateContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};