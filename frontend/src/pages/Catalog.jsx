import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import api from '../api';

function Catalog() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    author: '',
    genre: '',
    status: ''
  });
  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/books?${params}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Ошибка загрузки книг:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ q: '', author: '', genre: '', status: '' });
  };

  return (
    <div>
      <Header />

      <main className="container py-20 main-gap">
        <h1 className="text-4xl font-bold heading-font text-center my-10">Каталог книг</h1>

        {/* Фильтры */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-5 gap-4">
            <input
              type="text"
              name="q"
              placeholder="Поиск по названию или автору"
              value={filters.q}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <input
              type="text"
              name="author"
              placeholder="Автор"
              value={filters.author}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <input
              type="text"
              name="genre"
              placeholder="Жанр"
              value={filters.genre}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Все статусы</option>
              <option value="available">Доступны</option>
              <option value="booked">Забронированы</option>
            </select>

            <button onClick={clearFilters} className="btn">
              Очистить
            </button>
          </div>
        </div>

        {/* Результаты */}
        {loading ? (
          <Loading />
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Книги не найдены</p>
          </div>
        ) : (
          <div className="grid-4">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Catalog;

