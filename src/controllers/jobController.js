import JobOpening from "../models/JobOpening.js";
import Company from "../models/Company.js";
import Contact from "../models/Contact.js";

// Add Job
export const createJob = async (req, res, next) => {
    try {
        const { companyId, contactId } = req.body;

        const company = await Company.findById(companyId);
        const contact = await Contact.findById(contactId);

        if (!company || !contact) {
            return res.status(404).json({
                success: false,
                message: "Company or Contact not found",
            });
        }

        const job = await JobOpening.create(req.body);

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
    } catch (error) {
        next(error);
    }
};


export const getAllJobs = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 5,
            keyword,
            companyId,
            status
        } = req.query;

        const queryObject = { isDeleted: false };

        // 🔎 Search by role
        if (keyword) {
            queryObject.role = { $regex: keyword, $options: "i" };
        }

        // 🏢 Filter by company
        if (companyId) {
            queryObject.companyId = companyId;
        }

        // 📌 Filter by status (ACTIVE / EXPIRED / CLOSED)
        if (status) {
            queryObject.status = status;
        }

        const skip = (page - 1) * limit;

        const jobs = await JobOpening.find(queryObject)
            .populate("companyId", "companyName")
            .populate("contactId", "name email")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await JobOpening.countDocuments(queryObject);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: jobs,
        });
    } catch (error) {
        next(error);
    }
};

export const getJobById = async (req, res, next) => {
    try {
        const job = await JobOpening.findOne({
            _id: req.params.id,
            isDeleted: false,
        })
            .populate("companyId", "companyName")
            .populate("contactId", "name email phone");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

export const updateJob = async (req, res, next) => {
    try {
        const job = await JobOpening.findById(req.params.id);

        if (!job || job.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // 🔴 If expired → cannot edit
        if (job.status === "EXPIRED") {
            return res.status(400).json({
                success: false,
                message: "Expired job cannot be edited",
            });
        }

        // If expiry date changed and already past → mark expired
        if (req.body.expiryDate && new Date(req.body.expiryDate) < new Date()) {
            req.body.status = "EXPIRED";
        }

        const updatedJob = await JobOpening.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteJob = async (req, res, next) => {
    try {
        const job = await JobOpening.findById(req.params.id);

        if (!job || job.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        job.isDeleted = true;
        await job.save();

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};