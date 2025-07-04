const express = require('express');
const router = express.Router();
const pool = require('../config/db');

function mapFundingSource(input) {
  if (!input) return null;

  const normalized = input.toLowerCase().trim();

  switch (normalized) {
    case 'грант':
    case 'grant':
      return 'Грант';
    case 'полная оплата':
    case 'full':
      return 'Полная оплата';
    case 'со скидкой 30%':
    case 'discount':
      return 'Со скидкой 30%';
    default:
      return null;
  }
}


router.get('/students/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM courses ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении курсов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});




router.get('/students', async (req, res) => {
  const { search } = req.query;

  try {
    let result;

    const baseQuery = `
      SELECT 
        students.id,
        students.full_name,
        students.iin,
        students.email,
        students.phone,
        students.status,
        students.top_student,
        students.funding_source,
        students.subject,
        students.total_cost,
        students.discount_percent,
        students.paid_amount,
        students.stream_id,
        streams.name AS stream
      FROM students
      LEFT JOIN streams ON students.stream_id = streams.id
    `;

    if (search) {
      result = await pool.query(
        `${baseQuery} WHERE LOWER(full_name) LIKE LOWER($1) ORDER BY students.id`,
        [`%${search}%`]
      );
    } else {
      result = await pool.query(`${baseQuery} ORDER BY students.id`);
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


router.get('/streams', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM streams ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении потоков:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/students', async (req, res) => {
  console.log('Получено:', req.body);
  const {
    full_name, iin, email, phone, status, top_student,
    funding_source, subject, total_cost, discount_percent, paid_amount
  } = req.body;

  const fundingSource = mapFundingSource(funding_source);

  if (!fundingSource) {
    console.log('Некорректный источник финансирования:', funding_source);
    return res.status(400).json({
      error: `Неверный funding_source: "${funding_source}". Ожидается "Грант", "Полная оплата" или "Со скидкой 30%".`
    });
  }


  try {
    const amount_remaining = total_cost - paid_amount;
    await pool.query(
      `INSERT INTO students (
    full_name, iin, email, phone, status, top_student,
    funding_source, subject, total_cost, discount_percent,
    paid_amount
  ) VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10,
    $11
  )`,
      [
        full_name,
        iin,
        email,
        phone,
        status,
        top_student === 'on',
        fundingSource,
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

router.put('/students/:id', async (req, res) => {
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
        full_name, iin, email, phone, status, top_student,
        funding_source, subject, total_cost, discount_percent, paid_amount, id
      ]
    );


    res.status(200).json({ message: 'Студент обновлён' });
  } catch (err) {
    console.error('Ошибка при обновлении (PUT):', err);
    res.status(500).json({ error: 'Ошибка при обновлении' });
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
    paid_amount = $11
  WHERE id = $12`,
      [
        full_name, iin, email, phone, status, top_student,
        funding_source, subject, total_cost, discount_percent, paid_amount, id
      ]
    );


    res.status(200).json({ message: 'Студент обновлён' });
  } catch (err) {
    console.error('Ошибка при обновлении студента:', err);
    res.status(500).json({ error: 'Ошибка при обновлении' });
  }
});

// Получить все платежи студента
router.get('/students/:id/payments', async (req, res) => {
  const studentId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT * FROM student_payments WHERE student_id = $1 ORDER BY date ASC',
      [studentId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении платежей:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавить новый платёж
router.post('/students/:id/payments', async (req, res) => {
  const studentId = req.params.id;
  const { date, amount, comment, paid } = req.body;

  try {
    await pool.query(
      `INSERT INTO student_payments (student_id, date, amount, comment, paid)
       VALUES ($1, $2, $3, $4, $5)`,
      [studentId, date, amount, comment || '', paid || false]
    );
    res.status(201).json({ message: 'Платёж добавлен' });
  } catch (err) {
    console.error('Ошибка при добавлении платежа:', err);
    res.status(500).json({ error: 'Ошибка при добавлении' });
  }
});


module.exports = router;
