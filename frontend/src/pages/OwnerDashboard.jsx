import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import api from '../api';
import { getUser, logout } from '../utils/auth';

function OwnerDashboard() {
  const [overview, setOverview] = useState({ totalBooks: 0, availableBooks: 0, activeBookings: 0, rows: [] });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [alert, setAlert] = useState(null);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (user.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }

    fetchOverview();
  }, [navigate]);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const response = await api.get('/books/admin/overview');
      setOverview(response.data);
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.message?.includes('токен')) {
        logout();
        navigate('/login', { replace: true });
        return;
      }
      const message = error.response?.data?.message || 'Не удалось загрузить данные владельца';
      setAlert({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId) => {
    setActionLoadingId(bookId);
    setAlert(null);

    try {
      const response = await api.post(`/books/${bookId}/return`);
      setAlert({ type: 'success', message: response.data.message });
      await fetchOverview();
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка при возврате книги';
      setAlert({ type: 'error', message });
    } finally {
      setActionLoadingId('');
    }
  };

  if (!user) {
    return <Loading message="Переход к авторизации..." />;
  }

  return (
    <div>
      <Header />

      <main className="container py-16 main-gap">
        <div className="mb-8 text-center pt-10">
          <h1 className="text-4xl font-bold heading-font mb-3">Кабинет владельца</h1>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} />}

        {loading ? (
          <Loading message="Загружаем таблицу владельца..." />
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="card">
                <p className="text-sm text-gray-500 mb-2">Всего книг</p>
                <p className="text-3xl font-bold heading-font">{overview.totalBooks}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500 mb-2">Сейчас в наличии</p>
                <p className="text-3xl font-bold heading-font">{overview.availableBooks}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500 mb-2">Активных бронирований</p>
                <p className="text-3xl font-bold heading-font">{overview.activeBookings}</p>
              </div>
            </div>

            <div className="card overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-3 pr-4">Пользователь</th>
                    <th className="py-3 pr-4">Почта</th>
                    <th className="py-3 pr-4">Книга</th>
                    <th className="py-3 pr-4">С</th>
                    <th className="py-3 pr-4">По</th>
                    <th className="py-3 pr-4">Статус</th>
                    <th className="py-3">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.rows.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-6 text-center text-gray-500">
                        Пока нет ни одного бронирования.
                      </td>
                    </tr>
                  ) : (
                    overview.rows.map((row) => (
                      <tr key={row.bookingId} className="border-b border-gray-100">
                        <td className="py-4 pr-4">{row.userName}</td>
                        <td className="py-4 pr-4">{row.userEmail}</td>
                        <td className="py-4 pr-4">{row.bookTitle}</td>
                        <td className="py-4 pr-4">{new Date(row.fromDate).toLocaleDateString()}</td>
                        <td className="py-4 pr-4">{new Date(row.toDate).toLocaleDateString()}</td>
                        <td className="py-4 pr-4">
                          <span className={`badge ${row.status === 'booked' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                            {row.status === 'booked' ? 'На руках' : 'Возвращена'}
                          </span>
                        </td>
                        <td className="py-4">
                          {row.status === 'booked' ? (
                            <button
                              onClick={() => handleReturn(row.bookId)}
                              className="btn text-sm"
                              disabled={actionLoadingId === row.bookId}
                            >
                              {actionLoadingId === row.bookId ? 'Обновляем...' : 'Принять возврат'}
                            </button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default OwnerDashboard;
