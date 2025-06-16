const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/students', async (req, res) => {
  const { search } = req.query;

  try {
    let result;

    if (search) {
      result = await pool.query(
        'SELECT id, full_name, iin FROM students WHERE LOWER(full_name) LIKE LOWER($1) ORDER BY id',
        [`%${search}%`]
      );
    } else {
      result = await pool.query(
        'SELECT id, full_name, iin FROM students ORDER BY id'
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/students', async (req, res) => {
  const {
    full_name, iin, email, phone, status, top_student,
    funding_source, subject, total_cost, discount_percent, paid_amount
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO students (
        full_name, iin, email, phone, status, top_student,
        funding_source, subject, total_cost, discount_percent,
        paid_amount, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, NOW()
      )`,
      [
        full_name,
        iin,
        email,
        phone,
        status,
        top_student === 'on',
        funding_source,
        subject,
        total_cost || 0,
        discount_percent || 0,
        paid_amount || 0
      ]
    );

    res.status(201).json({ message: 'Студент добавлен' });
  } catch (err) {
    console.error('Ошибка при добавлении студента:', err);
    res.status(500).json({ error: 'Ошибка при добавлении. Проверьте данные.' });
  }
});

router.post('/students/delete/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    await pool.query('DELETE FROM students WHERE id = $1', [studentId]);
    res.status(200).json({ message: 'Удалено' });
  } catch (err) {
    console.error('Ошибка при удалении студента:', err);
    res.status(500).json({ error: 'Ошибка сервера при удалении' });
  }
});

router.get('/students/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    const student = result.rows[0];
    if (!student) return res.status(404).json({ error: 'Студент не найден' });

    res.status(200).json(student);
  } catch (err) {
    console.error('Ошибка при загрузке студента:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/students/edit/:id', async (req, res) => {
  const id = req.params.id;
  const {
    full_name, iin, email, phone, status, top_student,
    funding_source, subject, total_cost, discount_percent, paid_amount
  } = req.body;

  try {
    await pool.query(
      `UPDATE students SET
        full_name = $1,
        iin = $2,
        email = $3,
        phone = $4,
        status = $5,
        top_student = $6,
        funding_source = $7,
        subject = $8,
        total_cost = $9,
        discount_percent = $10,
        paid_amount = $11,
        updated_at = NOW()
      WHERE id = $12`,
      [
        full_name, iin, email, phone, status, top_student === 'on',
        funding_source, subject, total_cost, discount_percent, paid_amount, id
      ]
    );

    res.status(200).json({ message: 'Студент обновлён' });
  } catch (err) {
    console.error('Ошибка при обновлении студента:', err);
    res.status(500).json({ error: 'Ошибка при обновлении' });
  }
});

module.exports = router;
