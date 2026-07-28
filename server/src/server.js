import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { startNewsFetchJob } from './jobs/newsFetchJob.js';

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  startNewsFetchJob();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();