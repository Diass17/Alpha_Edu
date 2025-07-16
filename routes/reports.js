const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Маршрут для получения всех студентов (с расчётом задолженности)
router.get('/debts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
  id,
  full_name,
  subject,
  total_cost,
  paid_amount,
  discount_percent,
  created_at,
  GREATEST(
    ROUND(total_cost * (1 - discount_percent / 100)) - paid_amount,
    0
  ) AS amount_remaining
FROM students
ORDER BY id ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении студентов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
