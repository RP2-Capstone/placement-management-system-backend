import Company from "../models/Company.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import Contact from "../models/Contact.js";


// Create Company
export const createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Companies (Search + Pagination)
export const getAllCompanies = async (req, res, next) => {
  try {
    const resultPerPage = 5;

    // 🔹 Build search filter first
    const apiFeature = new ApiFeatures(
      Company.find({ isDeleted: false }),
      req.query
    ).search();

    // 🔹 Get total count BEFORE pagination
    const totalCompanies = await Company.countDocuments(
      apiFeature.query.getFilter()
    );

    // 🔹 Apply pagination
    apiFeature.pagination(resultPerPage);

    const companies = await apiFeature.query;

    res.status(200).json({
      success: true,
      count: totalCompanies, // ✅ total documents
      page: Number(req.query.page) || 1,
      pages: Math.ceil(totalCompanies / resultPerPage),
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Company Names (for dropdowns)
export const getAllCompanyName = async (req, res, next) => {
  try {
    const companies = await Company.find({
      isDeleted: false,
      status: "ACTIVE",
    })
      .select("_id companyName")
      .sort({ companyName: 1 });

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// Get Company By ID
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate({
      path: "contacts",
      match: { isDeleted: false , isPrimary: true}, // Only get primary contacts
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// Update Company
export const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// Soft Delete Company
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
