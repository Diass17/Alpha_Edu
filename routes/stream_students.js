const express = require('express')
const router = express.Router()
const pool = require('../config/db')

// Получить всех студентов потока
router.get('/:stream_id', async (req, res) => {
  const streamId = req.params.stream_id
  try {
    const result = await pool.query(`
      SELECT students.*
      FROM stream_students
      JOIN students ON students.id = stream_students.student_id
      WHERE stream_students.stream_id = $1
      ORDER BY students.id
    `, [streamId])
    res.json(result.rows)
  } catch (error) {
    console.error('Ошибка при получении студентов потока:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Добавить студента в поток
router.post('/', async (req, res) => {
  const { stream_id, student_id } = req.body
  if (!stream_id || !student_id) {
    return res.status(400).json({ error: 'stream_id и student_id обязательны' })
  }

  try {
    await pool.query(`
      INSERT INTO stream_students (stream_id, student_id)
      VALUES ($1, $2)
      ON CONFLICT (stream_id, student_id) DO NOTHING
    `, [stream_id, student_id])
    res.status(201).json({ message: 'Студент добавлен в поток' })
  } catch (error) {
    console.error('Ошибка при добавлении студента в поток:', error)
    res.status(500).json({ error: 'Ошибка при добавлении студента' })
  }
})

// Удалить студента из потока
router.delete('/:stream_id/:student_id', async (req, res) => {
  const { stream_id, student_id } = req.params
  try {
    await pool.query(`
      DELETE FROM stream_students
      WHERE stream_id = $1 AND student_id = $2
    `, [stream_id, student_id])
    res.status(200).json({ message: 'Студент удалён из потока' })
  } catch (error) {
    console.error('Ошибка при удалении:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router
