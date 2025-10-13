import dotenv from 'dotenv';
import { Pool } from 'pg';

// Set environment configuration
dotenv.config();

// Create pool connection for connecting to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  max: process.env.DB_MAX
});

export { pool };