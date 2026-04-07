import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-kombu-green text-bone py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <i className="fa-solid fa-book-open text-3xl"></i>
              <span className="text-2xl font-bold heading-font">Novella</span>
            </div>
            <p className="text-bone/70">Современная библиотека с удобным онлайн-бронированием.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2 text-bone/70">
              <li><Link to="/catalog" className="hover:text-tan">Каталог книг</Link></li>
              <li><Link to="/bookings" className="hover:text-tan">Мои бронирования</Link></li>
              <li><a href="/#faq" className="hover:text-tan">Частые вопросы</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-bone/70">
              <li>ул. Бокейхана, 42, Астана</li>
              <li>+7 (707) 555-88-88</li>
              <li>info@novella.kz</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Мы в соцсетях</h4>
            <div className="flex gap-4 text-2xl">
              <a href="https://youtu.be/dQw4w9WgXcQ?si=NF10Yxkx47fIDu71" target="_blank" rel="noreferrer" className="hover:text-tan"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://youtu.be/dQw4w9WgXcQ?si=NF10Yxkx47fIDu71" target="_blank" rel="noreferrer" className="hover:text-tan"><i className="fa-brands fa-telegram"></i></a>
              <a href="https://youtu.be/dQw4w9WgXcQ?si=NF10Yxkx47fIDu71" target="_blank" rel="noreferrer" className="hover:text-tan"><i className="fa-brands fa-vk"></i></a>
            </div>
          </div>
        </div>

        <div className="border-t border-bone/20 mt-12 pt-8 text-center text-sm text-bone/60">
          © 2026 Библиотека Novella.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
