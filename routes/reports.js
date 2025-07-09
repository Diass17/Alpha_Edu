const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 

// Маршрут для получения задолженностей
router.get('/debts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        full_name,
        subject,
        total_cost,
        paid_amount,
        (total_cost - paid_amount) AS amount_remaining
      FROM students
      WHERE total_cost > paid_amount
      ORDER BY amount_remaining DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении задолженностей:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
