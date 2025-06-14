const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Получить список студентов
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по ФИО
 *     responses:
 *       200:
 *         description: Список студентов
 */
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


/**
 * @swagger
 * /students/add:
 *   get:
 *     summary: Форма добавления студента
 *     responses:
 *       200:
 *         description: HTML-страница формы
 */
router.get('/students/add', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('add_student', { error: null });
});

/**
 * @swagger
 * /students/add:
 *   post:
 *     summary: Добавить нового студента
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: Полное имя студента
 *               iin:
 *                 type: string
 *                 description: Идентификационный номер студента
 *               email:
 *                 type: string
 *                 description: Электронная почта студента
 *               phone:
 *                 type: string
 *                 description: Телефон студента
 *               status:
 *                 type: string
 *                 description: Статус студента
 *               top_student:
 *                 type: string
 *                 description: Признак топового студента
 *               funding_source:
 *                 type: string
 *                 description: Источник финансирования
 *               subject:
 *                 type: string
 *                 description: Специализация студента
 *               total_cost:
 *                 type: number
 *                 description: Общая стоимость обучения
 *               discount_percent:
 *                 type: number
 *                 description: Процент скидки
 *               paid_amount:
 *                 type: number
 *                 description: Сумма, уплаченная студентом
 *     responses:
 *       302:
 *         description: Редирект на список студентов
 */

router.post('/students/add', async (req, res) => {
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

    res.redirect('/students');
  } catch (err) {
    console.error('Ошибка при добавлении студента:', err);
    res.render('add_student', { error: 'Ошибка при добавлении. Проверьте данные.' });
  }
});

/**
 * @swagger
 * /students/delete/{id}:
 *   post:
 *     summary: Удалить студента
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       302:
 *         description: Редирект на список студентов
 */
router.post('/students/delete/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    await pool.query('DELETE FROM students WHERE id = $1', [studentId]);
    res.redirect('/students');
  } catch (err) {
    console.error('Ошибка при удалении студента:', err);
    res.status(500).send('Ошибка сервера при удалении');
  }
});

/**
 * @swagger
 * /students/edit/{id}:
 *   get:
 *     summary: Получить форму редактирования студента
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: HTML-форма
 */
router.get('/students/edit/:id', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const id = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    const student = result.rows[0];
    if (!student) return res.redirect('/students');

    res.render('edit_student', { student, error: null });
  } catch (err) {
    console.error('Ошибка при загрузке студента:', err);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * @swagger
 * /students/edit/{id}:
 *   post:
 *     summary: Обновить данные студента
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               iin:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *               top_student:
 *                 type: string
 *               funding_source:
 *                 type: string
 *               subject:
 *                 type: string
 *               total_cost:
 *                 type: number
 *               discount_percent:
 *                 type: number
 *               paid_amount:
 *                 type: number
 *     responses:
 *       302:
 *         description: Редирект на /students
 */
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
        paid_amount = $11
      WHERE id = $12`,
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
        paid_amount || 0,
        id
      ]
    );
    res.redirect('/students');
  } catch (err) {
    console.error('Ошибка при обновлении:', err);
    res.render('edit_student', { student: req.body, error: 'Ошибка при обновлении. Проверьте данные.' });
  }
});

module.exports = router;
