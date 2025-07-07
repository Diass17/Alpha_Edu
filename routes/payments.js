// routes/payments.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 📥 Получить все платежи (для общей выручки)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        to_char(sp.date, 'DD.MM.YYYY') AS date,
        sp.amount::text,
        s.subject AS course,
        s.full_name AS student,
        sp.comment AS payment
      FROM student_payments sp
      JOIN students s ON sp.student_id = s.id
      ORDER BY sp.date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении платежей:', err);
    res.status(500).json({ error: 'Ошибка при получении платежей' });
  }
});

module.exports = router;
