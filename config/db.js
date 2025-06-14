const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
console.log("✅ DATABASE_URL:", process.env.DATABASE_URL);

module.exports = pool;
