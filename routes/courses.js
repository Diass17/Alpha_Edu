// routes/courses.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ GET /api/courses
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM courses ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// ✅ POST /api/courses
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO courses (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error adding course' });
  }
});

// ✅ DELETE /api/courses/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM courses WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error deleting course' });
  }
});


// Update course by id
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const courseId = req.params.id;

  try {
    const result = await db.query(
      'UPDATE courses SET name = $1 WHERE id = $2 RETURNING *',
      [name, courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating course' });
  }
});

module.exports = router;
