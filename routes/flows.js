const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Получить все потоки
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM flows ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching all flows' });
  }
});

// ✅ Получить потоки по courseId
router.get('/:courseId', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM flows WHERE course_id = $1',
      [req.params.courseId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching flows' });
  }
});

// ✅ Добавить новый поток + запись в streams
router.post('/', async (req, res) => {
  const { name, mentor, startDate, endDate, course_id } = req.body;

  try {
    // 1. Добавляем поток
    const flowResult = await db.query(
      `INSERT INTO flows (name, mentor, start_date, end_date, course_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, mentor, startDate, endDate, course_id]
    );

    const flow = flowResult.rows[0];

    // 2. Добавляем запись в streams
    await db.query(
      `INSERT INTO streams (id, name)
       VALUES ($1, $2)`,
      [flow.id, flow.name]
    );

    res.status(201).json(flow);
  } catch (err) {
    console.error('❌ Ошибка при добавлении потока и в streams:', err);
    res.status(500).json({ error: 'Error adding flow and stream' });
  }
});

// ❌ Удалить поток
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await db.query('DELETE FROM flows WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Flow not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Ошибка при удалении потока:', err);
    res.status(500).json({ error: 'Error deleting flow' });
  }
});

module.exports = router;
