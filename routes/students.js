const express = require('express');
const router = express.Router();
const pool = require('../config/db');


const dayjs = require('dayjs');

function generatePaymentSchedule(discountedPrice, startDate, months = 6) {
  const monthlyAmount = Math.floor(discountedPrice / months);
  const payments = [];
  let total = 0;

  for (let i = 0; i < months; i++) {
    const amount = (i === months - 1)
      ? discountedPrice - total
      : monthlyAmount;

    const date = dayjs(startDate).add(i, 'month').format('YYYY-MM-DD');

    payments.push({ date, amount, paid: false });
    total += amount;
  }

  return payments;
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
    students.payment_period,
    students.stream_id,
    students.created_at,
    streams.name AS stream,

    -- Добавлено: последняя дата оплаты (если была)
    (
      SELECT date
      FROM payment_schedule
      WHERE student_id = students.id AND paid = true
      ORDER BY date DESC
      LIMIT 1
    ) AS last_payment_date

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
  const {
    full_name, iin, email, phone, status, top_student,
    funding_source, subject, total_cost, paid_amount,
    payment_period, paymentPeriod
  } = req.body;

  if (!funding_source) {
    return res.status(400).json({ error: 'Поле "funding_source" обязательно' });
  }

  let fundingSourceText;

  switch (funding_source) {
    case 'TechOrda':
    case 'techorda':
      fundingSourceText = 'TechOrda';
      break;
    case 'Внутренний грант':
    case 'internal_grant':
      fundingSourceText = 'Внутренний грант';
      break;
    case 'Полная оплата':
    case 'full':
      fundingSourceText = 'Полная оплата';
      break;
    case 'Скидка 30%':
    case 'discount_30':
      fundingSourceText = 'Скидка 30%';
      break;
    case 'Скидка 70%':
    case 'discount_70':
      fundingSourceText = 'Скидка 70%';
      break;
    default:
      return res.status(400).json({ error: `Неверный funding_source: "${funding_source}".` });
  }

  try {
    const parsedPeriod = parseInt(payment_period ?? paymentPeriod, 10);
    const finalPaymentPeriod = Number.isFinite(parsedPeriod) ? parsedPeriod : 6;

    // Скидка
    let discountPercent = 0;
    if (fundingSourceText === 'Скидка 30%') discountPercent = 30;
    if (fundingSourceText === 'Скидка 70%') discountPercent = 70;

    const discountedPrice = Math.round((total_cost || 0) * (1 - discountPercent / 100));

    const result = await pool.query(
      `INSERT INTO students (
        full_name, iin, email, phone, status, top_student,
        funding_source, subject, total_cost, paid_amount, payment_period
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11
      ) RETURNING *`,
      [
        full_name,
        iin,
        email,
        phone,
        status,
        top_student === 'on',
        fundingSourceText,
        subject,
        total_cost || 0,
        paid_amount || 0,
        finalPaymentPeriod
      ]
    );

    const newStudent = result.rows[0];

    // Генерация платежей
    const paymentStartDate = new Date();
    const schedule = generatePaymentSchedule(discountedPrice, paymentStartDate, finalPaymentPeriod);

    for (const payment of schedule) {
      try {
        await pool.query(
          `INSERT INTO payment_schedule (student_id, date, amount, paid)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (student_id, date) DO NOTHING`, // чтобы избежать дубликатов
          [newStudent.id, payment.date, payment.amount, payment.paid]
        );
      } catch (insertErr) {
        console.error('Ошибка при вставке платежа:', insertErr);
      }
    }

    res.status(201).json(newStudent);
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
    const studentRes = await pool.query(`
      SELECT * FROM students WHERE id = $1
    `, [id]);


    const student = studentRes.rows[0];
    if (!student) return res.status(404).json({ error: 'Студент не найден' });

    // Преобразование payment_period в строку
    student.payment_period = String(student.payment_period);

    res.status(200).json({ ...student, paymentSchedule: [] });
  } catch (err) {
    console.error('Ошибка при загрузке студента:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});






router.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const {
    full_name, iin, email, phone, status, top_student,
    funding_source, subject, total_cost,
    paid_amount, payment_period
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
    paid_amount = $10,
    payment_period = $11
  WHERE id = $12`,
      [
        full_name, iin, email, phone, status, top_student,
        funding_source, subject, total_cost,
        paid_amount, payment_period, id
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

// PUT /students/:id/schedule — сохранить платежный календарь
router.put('/students/:id/schedule', async (req, res) => {
  const { id } = req.params;
  const { payment_schedule } = req.body;

  try {
    await pool.query(
      'UPDATE students SET payment_schedule = $1 WHERE id = $2',
      [payment_schedule, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении payment_schedule:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /students/:id/payment-schedule
// ✅ Финальный вариант: PUT /students/:id/payment-schedule
// backend/routes/students.js
router.put('/students/:id/payment-schedule', async (req, res) => {
  const studentId = req.params.id;
  const paymentSchedule = req.body.paymentSchedule;

  try {
    // Удаляем старые записи
    await pool.query('DELETE FROM payment_schedule WHERE student_id = $1', [studentId]);

    // Вставляем новые записи
    for (const payment of paymentSchedule) {
      await pool.query(
        `INSERT INTO payment_schedule (student_id, date, paid, amount)
         VALUES ($1, $2, $3, $4)`,
        [studentId, payment.date, payment.paid, payment.amount]
      );
    }

    // 🔁 Обновляем paid_amount на основе новых данных
    const sumResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS total_paid
      FROM payment_schedule
      WHERE student_id = $1 AND paid = true
    `, [studentId]);

    const paidAmount = sumResult.rows[0].total_paid;

    await pool.query(`
      UPDATE students
      SET paid_amount = $1
      WHERE id = $2
    `, [paidAmount, studentId]);

    res.status(200).json({ success: true, paymentSchedule });
  } catch (error) {
    console.error('Ошибка при обновлении графика:', error);
    res.status(500).json({ success: false, error: 'Ошибка при обновлении графика' });
  }
});

router.get('/students/:id/payment-schedule', async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT date, paid, amount FROM payment_schedule WHERE student_id = $1 ORDER BY date',
      [studentId]
    );

    res.json({ success: true, paymentSchedule: result.rows });
  } catch (error) {
    console.error('Ошибка при получении графика:', error);
    res.status(500).json({ success: false, error: 'Ошибка при получении графика' });
  }
});


// POST /students/:id/generate-payment-schedule
router.post('/students/:id/generate-payment-schedule', async (req, res) => {
  const studentId = req.params.id;

  try {
    // Получаем данные студента
    const studentRes = await pool.query(`
      SELECT 
        total_cost,
        discount_percent,
        payment_period,
        COALESCE((
          SELECT SUM(amount)
          FROM payment_schedule
          WHERE student_id = $1 AND paid = true
        ), 0) AS paid_amount
      FROM students
      WHERE id = $1
    `, [studentId]);

    if (studentRes.rowCount === 0) {
      return res.status(404).json({ error: 'Студент не найден' });
    }

    const { total_cost, discount_percent, payment_period, paid_amount } = studentRes.rows[0];

    const discount = (total_cost * (discount_percent || 0)) / 100;
    const amountRemaining = total_cost - discount - paid_amount;

    if (payment_period <= 0) {
      return res.status(400).json({ error: 'Некорректный срок оплаты (payment_period)' });
    }

    const monthlyAmount = Math.round(amountRemaining / payment_period);

    // Удаляем старый график
    await pool.query('DELETE FROM payment_schedule WHERE student_id = $1', [studentId]);

    // Создаём новый график
    const now = new Date();
    const schedule = [];

    for (let i = 0; i < payment_period; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() + i);

      schedule.push({
        student_id: studentId,
        date: date.toISOString().split('T')[0],
        paid: false,
        amount: monthlyAmount
      });

      await pool.query(
        `INSERT INTO payment_schedule (student_id, date, paid, amount)
         VALUES ($1, $2, $3, $4)`,
        [studentId, date.toISOString().split('T')[0], false, monthlyAmount]
      );
    }

    // Обновим paid_amount в students на случай, если что-то изменилось
    await pool.query(`
      UPDATE students SET paid_amount = $1
      WHERE id = $2
    `, [paid_amount, studentId]);

    res.status(200).json({ success: true, paymentSchedule: schedule });
  } catch (error) {
    console.error('Ошибка при генерации графика:', error);
    res.status(500).json({ error: 'Ошибка сервера при генерации графика' });
  }
});





// Получить все платежи студента
router.get('/students/:id/payments', async (req, res) => {
  const studentId = req.params.id;
  try {
    const result = await pool.query(`
  UPDATE students
  SET paid_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM payment_schedule
    WHERE student_id = $1 AND paid = true
  )
  WHERE id = $1
`, [studentId]);

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
