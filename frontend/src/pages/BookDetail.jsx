import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import api from '../api';
import { getUser } from '../utils/auth';

function BookDetail() {
  const { id } = useParams();  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [bookingForm, setBookingForm] = useState({ fromDate: '', toDate: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Ошибка загрузки книги:', error);
      setAlert({ type: 'error', message: 'Книга не найдена' });
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bookingForm.fromDate || !bookingForm.toDate) {
      setAlert({ type: 'error', message: 'Выберите даты: с какого и по какое число вы берёте книгу.' });
      return;
    }

    if (new Date(bookingForm.toDate) < new Date(bookingForm.fromDate)) {
      setAlert({ type: 'error', message: 'Дата окончания не может быть раньше даты начала.' });
      return;
    }

    setBookingLoading(true);
    setAlert(null);

    try {
      const response = await api.post(`/books/${id}/book`, {
        ...bookingForm,
        userName: user.name
      });
      setBook(response.data.book);
      setBookingForm({ fromDate: '', toDate: '' });
      setAlert({ type: 'success', message: 'Книга успешно забронирована!' });
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка при бронировании';
      setAlert({ type: 'error', message });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReturnBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setReturnLoading(true);
    setAlert(null);

    try {
      const response = await api.post(`/books/${id}/return`);
      setBook(response.data.book);
      setAlert({ type: 'success', message: response.data.message });
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка при возврате книги';
      setAlert({ type: 'error', message });
    } finally {
      setReturnLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setReviewLoading(true);
    setAlert(null);

    try {
      await api.post(`/books/${id}/review`, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      setAlert({ type: 'success', message: 'Отзыв добавлен!' });
      fetchBook(); // Перезагрузить книгу с новым отзывом
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка при добавлении отзыва';
      setAlert({ type: 'error', message });
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!book) {
    return (
      <div>
        <Header />
        <main className="container py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold heading-font mb-8">Книга не найдена</h1>
            <button onClick={() => navigate('/catalog')} className="btn">
              Вернуться в каталог
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const activeBooking = Array.isArray(book.bookings)
    ? [...book.bookings].reverse().find((booking) => booking.status === 'booked')
    : null;

  return (
    <div>
      <Header />

      <main className="container book-detail-main pb-20">  
        {alert && <Alert type={alert.type} message={alert.message} />}

        <div className="grid md:grid-cols-[260px_minmax(0,1fr)] gap-2 md:gap-3 lg:gap-4">
        {/* Изображение книги */}
<div className="flex justify-center md:justify-start">
  <div className="w-full max-w-[240px] md:max-w-[280px] min-h-[420px] md:min-h-[480px] 
                 rounded-2xl overflow-hidden shadow-lg bg-[#f8f4ed]">
    <img
      src={book.cover}
      alt={book.title}
      className="w-full h-full object-cover"
    />
  </div>
</div>

          {/* Информация о книге */}
          <div>
            <h1 className="text-4xl font-bold heading-font mb-4">{book.title}</h1>
            <p className="text-xl text-secondary mb-2">Автор: {book.author}</p>
            <p className="text-lg mb-2">Жанр: {book.genre}</p>
            <p className="text-lg mb-4">Год: {book.year}</p>
            <p className="text-lg mb-6">Статус: {book.status === 'available' ? 'Доступна' : 'Забронирована'}</p>

            <p className="text-gray-700 mb-8">{book.description}</p>

            {book.status === 'available' ? (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Выберите даты бронирования</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">С какого числа</label>
                    <input
                      type="date"
                      value={bookingForm.fromDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, fromDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">По какое число</label>
                    <input
                      type="date"
                      value={bookingForm.toDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, toDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
                <button
                  onClick={handleBook}
                  disabled={bookingLoading}
                  className="btn text-lg px-8 py-4 disabled:opacity-50"
                >
                  {bookingLoading ? 'Бронирование...' : 'Забронировать книгу'}
                </button>
              </div>
            ) : (
              <div className="card">
                <p className="mb-4 text-gray-700">
                  Книга уже на руках
                  {activeBooking ? `: с ${new Date(activeBooking.fromDate).toLocaleDateString()} по ${new Date(activeBooking.toDate).toLocaleDateString()}` : '.'}
                </p>
                {(user?.role === 'admin' || user?.id === activeBooking?.userId) && (
                  <button onClick={handleReturnBook} disabled={returnLoading} className="btn disabled:opacity-50">
                    {returnLoading ? 'Возврат...' : 'Вернуть книгу'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Отзывы */}
        <section className="mt-16 mb-24">
          <h2 className="text-3xl font-bold heading-font mb-8">Отзывы</h2>

          {/* Форма отзыва */}
          {user && (
            <form onSubmit={handleReviewSubmit} className="card mb-8">
              <h3 className="text-xl font-semibold mb-4">Добавить отзыв</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Оценка</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value={5}>5 звезд</option>
                  <option value={4}>4 звезды</option>
                  <option value={3}>3 звезды</option>
                  <option value={2}>2 звезды</option>
                  <option value={1}>1 звезда</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Комментарий</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="btn disabled:opacity-50"
              >
                {reviewLoading ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </form>
          )}

          {/* Список отзывов */}
          <div className="space-y-6">
            {book.reviews && book.reviews.length > 0 ? (
              book.reviews.map(review => (
                <div key={review.id} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{review.userEmail}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-yellow-400"></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Пока нет отзывов</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default BookDetail;
