const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Получить все потоки (для store.fetchFlows)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM flows ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching all flows' });
  }
});

// ✅ Получить потоки по courseId (для /flows?courseId=...)
router.get('/:courseId', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM flows WHERE course_id = $1', [req.params.courseId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching flows' });
  }
});

// ✅ Добавить новый поток
router.post('/', async (req, res) => {
  const { name, mentor, startDate, endDate, course_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO flows (name, mentor, start_date, end_date, course_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, mentor, startDate, endDate, course_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error adding flow' });
  }
});

module.exports = router;
