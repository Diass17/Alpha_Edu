const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 📊 GET /api/revenue-data
router.get('/revenue-data', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.full_name,
        s.subject,
        s.total_cost,
        s.paid_amount,
        s.discount_percent,
        s.created_at,
        GREATEST(
          ROUND(s.total_cost * (1 - s.discount_percent / 100)) - s.paid_amount,
          0
        ) AS amount_remaining,
        (
          SELECT date 
          FROM payment_schedule 
          WHERE student_id = s.id AND paid = true 
          ORDER BY date DESC 
          LIMIT 1
        ) AS last_payment_date
      FROM students s
      ORDER BY s.id ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении данных о выручке:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
