import JobOpening from "../models/JobOpening.js";

// In every 6 hours
const DEFAULT_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const expireJobs = async () => {
  try {
    const now = new Date();
    await JobOpening.updateMany(
      {
        isDeleted: false,
        status: "ACTIVE",
        expiryDate: { $lt: now },
      },
      { $set: { status: "EXPIRED" } }
    );
  } catch (error) {
    console.error("Job auto-expire failed:", error.message);
  }
};

const startJobExpiryScheduler = (intervalMs = DEFAULT_INTERVAL_MS) => {
  // Run once on startup
  expireJobs();

  // Then run periodically
  setInterval(expireJobs, intervalMs);
};

export default startJobExpiryScheduler;
