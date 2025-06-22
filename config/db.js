// db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Необходимо для Neon
  }
});

console.log("✅ DATABASE_URL:", process.env.DATABASE_URL);

// Оборачиваем pool.query, чтобы использовать в других модулях
module.exports = {
  query: (text, params) => pool.query(text, params),
};
