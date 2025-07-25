const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const reportsRoutes = require('./routes/reports');
const studentPaymentsRoute = require('./routes/studentPayments')

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://alphaeducation.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(session({
  secret: 'alphaSecretKey',
  resave: false,
  saveUninitialized: false
}));

// API routes
app.use('/api', authRoutes);
app.use('/api', studentRoutes);

const flowsRouter = require('./routes/flows');
app.use('/api/flows', flowsRouter);

const coursesRouter = require('./routes/courses');
app.use('/api/courses', coursesRouter);

const streamStudentRoutes = require('./routes/stream_students')
app.use('/api/stream-students', streamStudentRoutes);

app.use('/reports', reportsRoutes);
app.use('/api/student-payments', studentPaymentsRoute)



// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Alpha Education Platform API',
      version: '1.0.0',
      description: 'API документация для управления студентами',
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.static(path.join(__dirname, 'dist')));


app.use((req, res, next) => {
  const isApiRequest = req.originalUrl.startsWith('/api');
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(req.originalUrl);

  if (isApiRequest || hasFileExtension) {
    return next();
  }

  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.get('/api/streams', (req, res) => {
  res.json([{ id: 1, name: 'Test Stream' }]);
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  console.log(`📘 Swagger Docs at http://localhost:${PORT}/api-docs`);
});