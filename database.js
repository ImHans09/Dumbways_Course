import { Pool } from 'pg';

// Create pool connection for connecting to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  password: 'postgresql9',
  host: 'localhost',
  port: 5432,
  database: 'portfolio_web_db',
  max: 20,
  connectionTimeoutMillis: 0
});

export { pool };