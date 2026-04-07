import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function NotFound() {
  return (
    <div>
      <Header />

      <main className="container py-20">
        <div className="text-center">
          <h1 className="text-8xl font-bold heading-font text-cafe-noir mb-8">404</h1>
          <h2 className="text-4xl font-bold heading-font text-cafe-noir mb-8">Страница не найдена</h2>
          <p className="text-xl text-gray-600 mb-12">
            Извините, но страница, которую вы ищете, не существует.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn">
              На главную
            </Link>
            <Link to="/catalog" className="btn border border-gray-300 hover:border-accent">
              В каталог
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;
