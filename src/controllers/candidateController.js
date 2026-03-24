import Candidate from "../models/Candidate.js";
import CandidateHistory from "../models/CandidateHistory.js";
import Company from "../models/Company.js";
import JobOpening from "../models/JobOpening.js";

// Add Candidate(s)
export const createCandidates = async (req, res, next) => {
  try {
    const { jobOpeningId, companyId, interviewRounds, status, interviewDate } = req.body;

    const rawNames =
      req.body.candidateNames ?? [];

    const namesArray = Array.isArray(rawNames)
      ? rawNames
      : typeof rawNames === "string"
        ? [rawNames]
        : [];

    const studentNames = namesArray
      .map((name) => (typeof name === "string" ? name.trim() : ""))
      .filter((name) => name.length > 0);

    if (!jobOpeningId || !companyId) {
      return res.status(400).json({
        success: false,
        message: "jobOpeningId and companyId are required",
      });
    }

    if (!interviewRounds) {
      return res.status(400).json({
        success: false,
        message: "interviewRounds is required",
      });
    }

    if (studentNames.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one student name is required",
      });
    }

    const [jobOpening, company] = await Promise.all([
      JobOpening.findOne({ _id: jobOpeningId, isDeleted: false }),
      Company.findOne({ _id: companyId, isDeleted: false }),
    ]);

    if (!jobOpening || !company) {
      return res.status(404).json({
        success: false,
        message: "Job opening or company not found",
      });
    }

    const docs = studentNames.map((studentName) => ({
      jobOpeningId,
      companyId,
      interviewRounds,
      status,
      interviewDate,
      studentName,
    }));

    const created = await Candidate.insertMany(docs, { ordered: true });

    const historyDocs = created.map((candidate) => ({
      candidateId: candidate._id,
      candidateName: candidate.studentName,
      jobOpeningId: candidate.jobOpeningId,
      companyId: candidate.companyId,
      interviewRounds: candidate.interviewRounds,
      interviewDate: candidate.interviewDate,
      status: candidate.status,
    }));

    if (historyDocs.length > 0) {
      await CandidateHistory.insertMany(historyDocs, { ordered: true });
    }

    res.status(201).json({
      success: true,
      message: "Candidates created successfully",
      count: created.length,
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Candidates (Search + Filters + Pagination)
export const getAllCandidates = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, keyword, role, companyName } = req.query;

    const queryObject = { isDeleted: false };

    if (keyword) {
      queryObject.studentName = { $regex: keyword, $options: "i" };
    }

    if (role) {
      const jobIds = await JobOpening.find({
        role: { $regex: role, $options: "i" },
        isDeleted: false,
      }).distinct("_id");
      queryObject.jobOpeningId = { $in: jobIds };
    }

    if (companyName) {
      const companyIds = await Company.find({
        companyName: { $regex: companyName, $options: "i" },
        isDeleted: false,
      }).distinct("_id");
      queryObject.companyId = { $in: companyIds };
    }

    const skip = (page - 1) * limit;

    const candidates = await Candidate.find(queryObject)
      .populate("jobOpeningId", "role")
      .populate("companyId", "companyName")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Candidate.countDocuments(queryObject);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: candidates,
    });
  } catch (error) {
    next(error);
  }
};

// Update Candidate (limited fields)
export const updateCandidate = async (req, res, next) => {
  try {
    const updates = {};

    if (req.body.interviewRounds !== undefined) {
      updates.interviewRounds = req.body.interviewRounds;
    }
    if (req.body.status !== undefined) {
      updates.status = req.body.status;
    }
    if (req.body.interviewDate !== undefined) {
      updates.interviewDate = req.body.interviewDate;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const candidate = await Candidate.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updates,
      { new: true, runValidators: true }
    )
      .populate("jobOpeningId", "role")
      .populate("companyId", "companyName");

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    await CandidateHistory.create({
      candidateId: candidate._id,
      candidateName: candidate.studentName,
      jobOpeningId: candidate.jobOpeningId,
      companyId: candidate.companyId,
      interviewRounds: candidate.interviewRounds,
      interviewDate: candidate.interviewDate,
      status: candidate.status,
    });

    res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

// Get Candidate History
export const getCandidateHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const candidate = await Candidate.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const [history, total] = await Promise.all([
      CandidateHistory.find({ candidateId: candidate._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      CandidateHistory.countDocuments({ candidateId: candidate._id }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
