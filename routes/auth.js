const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/auth', (req, res) => {
  res.render('auth_choice');
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Email уже зарегистрирован' });
    }

    await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
      [email, password, 'user']
    );

    console.log(`✅ Зарегистрирован: ${email}`);
    res.status(201).json({ message: 'Регистрация успешна' });
  } catch (err) {
    console.error('❌ Ошибка при регистрации:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || password !== user.password_hash) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    console.log(`✅ Вход: ${user.email}`);
    res.status(200).json({ message: 'Успешный вход', user: req.session.user });
  } catch (err) {
    console.error('❌ Ошибка при входе:', err);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('dashboard', { user: req.session.user });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: 'Вы вышли из системы' });
  });
});

module.exports = router;
