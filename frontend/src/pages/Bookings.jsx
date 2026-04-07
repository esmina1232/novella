import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import api from '../api';
import { getUser } from '../utils/auth';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [user] = useState(() => getUser());
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    fetchBookings();
  }, [navigate, user]);

  const fetchBookings = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api.get('/books');
      const booksList = Array.isArray(response.data) ? response.data : [];
      const userBookings = booksList
        .flatMap((book) =>
          (Array.isArray(book.bookings) ? book.bookings : [])
            .filter((booking) => booking.userId === user.id)
            .map((booking) => ({
              bookId: book.id,
              title: book.title,
              author: book.author,
              cover: book.cover,
              booking
            }))
        )
        .sort((first, second) => new Date(second.booking.createdAt) - new Date(first.booking.createdAt));

      setBookings(userBookings);
    } catch (error) {
      console.error('Ошибка загрузки бронирований:', error);
      setBookings([]);
      setErrorMessage('Не удалось загрузить бронирования. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (bookId) => {
    setActionLoadingId(bookId);
    setErrorMessage('');

    try {
      await api.post(`/books/${bookId}/return`);
      await fetchBookings();
    } catch (error) {
      const message = error.response?.data?.message || 'Не удалось вернуть книгу';
      setErrorMessage(message);
    } finally {
      setActionLoadingId('');
    }
  };

  if (!user) return <Loading message="Переход к авторизации..." />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container py-20 main-gap flex-1">
        <h1 className="text-4xl font-bold heading-font text-center my-10">Мои бронирования</h1>

        {loading ? (
          <Loading message="Загружаем ваши бронирования..." />
        ) : errorMessage ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-700 mb-4">{errorMessage}</p>
            <button onClick={fetchBookings} className="btn">
              Повторить
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">У вас пока нет бронирований</p>
            <button onClick={() => navigate('/catalog')} className="btn">
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((item) => (
              <div key={item.booking.id} className="card">
                <div className="flex gap-6">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-secondary mb-2">Автор: {item.author}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Период: {new Date(item.booking.fromDate).toLocaleDateString()} — {new Date(item.booking.toDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Оформлено: {new Date(item.booking.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`badge ${item.booking.status === 'booked' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {item.booking.status === 'booked' ? 'На руках' : 'Возвращена'}
                      </span>
                      <button
                        onClick={() => navigate(`/book/${item.bookId}`)}
                        className="btn text-sm"
                      >
                        Подробнее
                      </button>
                      {item.booking.status === 'booked' && (
                        <button
                          onClick={() => handleReturnBook(item.bookId)}
                          className="btn text-sm"
                          disabled={actionLoadingId === item.bookId}
                        >
                          {actionLoadingId === item.bookId ? 'Возвращаем...' : 'Вернуть книгу'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Bookings;
