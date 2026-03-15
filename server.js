import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import startJobExpiryScheduler from "./src/jobs/expireJobs.js";

await connectDB();
startJobExpiryScheduler();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
