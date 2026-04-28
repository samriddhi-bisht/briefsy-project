import cron from 'node-cron';
import { fetchAndStoreNews } from '../services/newsService.js';
import { createFetchLog } from '../services/fetchLogService.js';

const categories = ['technology', 'business', 'sports', 'science', 'health', 'entertainment'];

export const startNewsFetchJob = () => {
  cron.schedule('*/30 * * * *', async () => {
    console.log('Background job started: fetching latest news');

    for (const category of categories) {
      try {
        const result = await fetchAndStoreNews(category);

        await createFetchLog({
          category,
          status: 'SUCCESS',
          totalFetched: result.totalFetched,
          insertedCount: result.insertedCount,
        });

        console.log(
          `Fetched ${category}: total=${result.totalFetched}, inserted=${result.insertedCount}`
        );
      } catch (error) {
        await createFetchLog({
          category,
          status: 'FAILED',
          errorMessage: error.message,
        });

        console.error(`Background fetch failed for ${category}:`, error.message);
      }
    }

    console.log('Background job completed');
  });
};