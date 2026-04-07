import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';

function Header() {
  const user = getUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const userName = user?.role === 'admin' ? 'Владелец' : user?.name;

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="nav-top-row">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-book-open text-3xl"></i>
              <Link to="/" className="text-3xl font-bold tracking-wide heading-font" onClick={closeMenu}>
                Novella
              </Link>
            </div>

            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Открыть меню"
            >
              <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>

          <div className={`nav-panel ${isMenuOpen ? 'nav-panel-open' : ''}`}>
            <div className="links">
              <a href="/#about" className="hover:text-tan transition-colors" onClick={closeMenu}>
                О библиотеке
              </a>
              <Link to="/catalog" className="hover:text-tan transition-colors" onClick={closeMenu}>
                Каталог
              </Link>
              {user?.role === 'admin' && (
                <Link to="/owner" className="hover:text-tan transition-colors" onClick={closeMenu}>
                  Владелец
                </Link>
              )}
              {user && (
                <Link to="/bookings" className="hover:text-tan transition-colors" onClick={closeMenu}>
                  Мои бронирования
                </Link>
              )}
            </div>

            <div className="header-actions">
              {user ? (
                <>
                  <span className="text-sm">Привет, {userName}</span>
                  <button onClick={handleLogout} className="btn">
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn border border-bone/70 hover:border-bone" onClick={closeMenu}>
                    Войти
                  </Link>
                  <Link to="/register" className="btn" onClick={closeMenu}>
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
