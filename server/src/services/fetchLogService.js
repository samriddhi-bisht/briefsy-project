import pool from '../config/db.js';

export const createFetchLog = async ({
  category,
  status,
  totalFetched = 0,
  insertedCount = 0,
  errorMessage = null,
}) => {
  await pool.query(
    `INSERT INTO fetch_logs 
     (category, status, total_fetched, inserted_count, error_message)
     VALUES ($1, $2, $3, $4, $5)`,
    [category, status, totalFetched, insertedCount, errorMessage]
  );
};