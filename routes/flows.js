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
    console.error('❌ Ошибка при добавлении потока:', err); // ⬅️ Добавь это
    res.status(500).json({ error: 'Error adding flow' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const result = await db.query('DELETE FROM flows WHERE id = $1', [id])
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Flow not found' })
    }
    res.sendStatus(204) // Успешно, но без тела
  } catch (err) {
    console.error('❌ Ошибка при удалении потока:', err)
    res.status(500).json({ error: 'Error deleting flow' })
  }
})

module.exports = router;
