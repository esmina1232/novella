import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Alert from '../components/Alert';
import api from '../api';
import { setUser } from '../utils/auth';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await api.post('/auth/login', formData);
      setUser(response.data.user, response.data.token);
      setAlert({ type: 'success', message: 'Вход выполнен успешно!' });
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка при входе';
      setAlert({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <main className="container pt-24 pb-20 main-gap">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold heading-font text-center mb-8">Вход</h1>

          {alert && <Alert type={alert.type} message={alert.message} />}

          <form onSubmit={handleSubmit} className="card">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p className="text-center mt-6">
            Нет аккаунта? <Link to="/register" className="text-accent hover:underline">Зарегистрироваться</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
