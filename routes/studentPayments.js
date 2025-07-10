const express = require('express')
const router = express.Router()
const pool = require('../config/db')

// Получить все платежи студента
router.get('/:studentId', async (req, res) => {
  const { studentId } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM student_payments WHERE student_id = $1 ORDER BY date ASC',
      [studentId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при загрузке платежей' })
  }
})

// Обновить статус оплаты
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { paid } = req.body
  try {
    await pool.query(
      'UPDATE student_payments SET paid = $1 WHERE id = $2',
      [paid, id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении' })
  }
})

// Добавить новый платёж
router.post('/', async (req, res) => {
  const { student_id, date, amount, paid, comment } = req.body
  try {
    await pool.query(
      'INSERT INTO student_payments (student_id, date, amount, paid, comment) VALUES ($1, $2, $3, $4, $5)',
      [student_id, date, amount, paid, comment]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при добавлении платежа' })
  }
})

module.exports = router
