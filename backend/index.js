require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRouter = require('./routes/auth');
const booksRouter = require('./routes/books');
const { connectDatabase } = require('./config/db');
const { seedDatabase } = require('./seed/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Novella API работает' });
});

app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Ресурс не найден' });
});

app.use((err, req, res, next) => {
  console.error('Серверная ошибка', err);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

async function startServer() {
  try {
    await connectDatabase();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Novella backend запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Не удалось запустить backend:', error);
    process.exit(1);
  }
}

startServer();
