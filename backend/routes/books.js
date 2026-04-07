const express = require('express');
const Book = require('../models/Book');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q, author, genre, year, status } = req.query;
    const query = {};

    if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [{ title: regex }, { author: regex }, { genre: regex }];
    }

    if (author) {
      query.author = new RegExp(author, 'i');
    }

    if (genre) {
      query.genre = new RegExp(genre, 'i');
    }

    if (year) {
      query.year = Number(year);
    }

    if (status) {
      query.status = status;
    }

    const books = await Book.find(query).sort({ createdAt: 1 });
    res.json(books);
  } catch (error) {
    console.error('Ошибка получения книг', error);
    res.status(500).json({ message: 'Не удалось получить книги' });
  }
});

router.get('/admin/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: 1 });

    const rows = books.flatMap((book) =>
      (book.bookings || []).map((booking) => ({
        bookingId: booking.id,
        userId: booking.userId,
        userName: booking.userName,
        userEmail: booking.userEmail,
        bookId: book.id,
        bookTitle: book.title,
        author: book.author,
        fromDate: booking.fromDate,
        toDate: booking.toDate,
        status: booking.status,
        returnedAt: booking.returnedAt || null
      }))
    );

    res.json({
      totalBooks: books.length,
      availableBooks: books.filter((book) => book.status === 'available').length,
      activeBookings: rows.filter((row) => row.status === 'booked').length,
      rows
    });
  } catch (error) {
    console.error('Ошибка панели владельца', error);
    res.status(500).json({ message: 'Не удалось загрузить обзор владельца' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    res.json(book);
  } catch (error) {
    console.error('Ошибка получения книги', error);
    res.status(404).json({ message: 'Книга не найдена' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, author, genre, year, cover, description } = req.body;

    if (!title || !author || !genre || !year || !cover || !description) {
      return res.status(400).json({ message: 'Все поля книги обязательны для заполнения' });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      year: Number(year),
      cover: cover.trim(),
      description: description.trim(),
      status: 'available'
    });

    res.status(201).json({ message: 'Книга успешно добавлена', book });
  } catch (error) {
    console.error('Ошибка добавления книги', error);
    res.status(500).json({ message: 'Не удалось добавить книгу' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.year) {
      updates.year = Number(updates.year);
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    res.json({ message: 'Книга обновлена', book });
  } catch (error) {
    console.error('Ошибка обновления книги', error);
    res.status(500).json({ message: 'Не удалось обновить книгу' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    const activeBooking = book.bookings.find((booking) => booking.status === 'booked');
    if (activeBooking) {
      return res.status(400).json({ message: 'Нельзя удалить книгу, пока она находится на руках у читателя' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Книга удалена' });
  } catch (error) {
    console.error('Ошибка удаления книги', error);
    res.status(500).json({ message: 'Не удалось удалить книгу' });
  }
});

router.post('/:id/book', authenticateToken, async (req, res) => {
  try {
    const { fromDate, toDate, userName } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: 'Укажите даты бронирования: с какого и по какое число' });
    }

    if (new Date(toDate) < new Date(fromDate)) {
      return res.status(400).json({ message: 'Дата окончания не может быть раньше даты начала' });
    }

    const activeBooking = book.bookings.find((booking) => booking.status === 'booked');
    if (activeBooking || book.status !== 'available') {
      return res.status(400).json({ message: 'Книга уже забронирована другим читателем' });
    }

    book.bookings.push({
      userId: req.user.id,
      userName: req.user.name || userName || 'Читатель',
      userEmail: req.user.email,
      fromDate,
      toDate,
      createdAt: new Date().toISOString(),
      status: 'booked'
    });
    book.status = 'booked';

    await book.save();
    const booking = book.bookings[book.bookings.length - 1];

    res.json({ message: 'Книга успешно забронирована', booking, book });
  } catch (error) {
    console.error('Ошибка бронирования книги', error);
    res.status(500).json({ message: 'Ошибка при бронировании книги' });
  }
});

router.post('/:id/return', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    const activeBooking = [...book.bookings].reverse().find((booking) =>
      booking.status === 'booked' && (req.user.role === 'admin' || booking.userId === req.user.id)
    );

    if (!activeBooking) {
      return res.status(404).json({ message: 'Активное бронирование не найдено' });
    }

    activeBooking.status = 'returned';
    activeBooking.returnedAt = new Date().toISOString();
    book.status = 'available';

    await book.save();

    res.json({ message: 'Книга возвращена, статус изменён на «в наличии»', booking: activeBooking, book });
  } catch (error) {
    console.error('Ошибка возврата книги', error);
    res.status(500).json({ message: 'Ошибка при возврате книги' });
  }
});

router.post('/:id/review', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Оценка и комментарий обязательны' });
    }

    book.reviews.push({
      userId: req.user.id,
      userEmail: req.user.email,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    });

    await book.save();
    const review = book.reviews[book.reviews.length - 1];

    res.status(201).json({ message: 'Отзыв добавлен', review });
  } catch (error) {
    console.error('Ошибка добавления отзыва', error);
    res.status(500).json({ message: 'Ошибка при добавлении отзыва' });
  }
});

router.use((req, res) => {
  res.status(404).json({ message: 'Некорректный адрес API книги' });
});

module.exports = router;
