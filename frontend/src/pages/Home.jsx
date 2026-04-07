import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import api from '../api';

function Home() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  const faqItems = [
    {
      question: 'Как забронировать книгу?',
      answer: 'Выберите книгу в каталоге, задайте дату получения и нажмите «Забронировать». Затем подтвердите бронирование в личном кабинете.'
    },
    {
      question: 'Сколько книг можно взять одновременно?',
      answer: 'Вы можете бронировать до 5 книг одновременно, чтобы успеть прочитать и вернуть.'
    },
    {
      question: 'Нужна ли регистрация?',
      answer: 'Да, регистрация обязательна. Она бесплатная и занимает пару минут.'
    },
    {
      question: 'Что делать, если книга уже забронирована?',
      answer: 'Вы можете выбрать иной экземпляр или оставить предварительный заказ. Также мы рекомендуем проверять каталог позже.'
    },
    {
      question: 'Можно ли продлить срок чтения?',
      answer: 'Да, продление доступно в личном кабинете, если книга не зарезервирована другим читателем.'
    }
  ];

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const response = await api.get('/books');
        setPopularBooks(response.data.slice(0, 4)); // Показываем первые 4 книги
      } catch (error) {
        console.error('Ошибка загрузки книг:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  return (
    <div>
      <Header />

      <section className="hero-bg flex items-center text-white">
        <div className="container text-center py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold heading-font leading-tight mb-6">
            Добро пожаловать в<br />Novella
          </h1>
          <p className="text-base sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Современная библиотека Астаны с удобной онлайн-бронью книг
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog" className="btn w-full sm:w-auto bg-tan hover:bg-[#e0c9a8] text-cafe-noir font-semibold px-10 py-4 rounded-3xl text-lg">
              Перейти в каталог
            </Link>
            <a href="/#about" className="btn w-full sm:w-auto border-2 border-white/80 hover:bg-white/10 font-semibold px-10 py-4 rounded-3xl text-lg">
              Узнать больше о нас
            </a>
          </div>
        </div>
      </section>

      {/* Популярные книги */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold heading-font text-cafe-noir">Популярные книги</h2>
              <p className="text-secondary mt-2">Самые востребованные издания этой недели</p>
            </div>
            <Link to="/catalog" className="text-secondary hover:text-cafe-noir font-medium flex items-center gap-2">
              Все книги <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid-4">
              {popularBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-16 sm:py-20 bg-tan scroll-mt-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold heading-font text-cafe-noir mb-8">Наша библиотека</h2>
              <div className="space-y-6 text-lg">
                <p className="text-cafe-noir/80 leading-9">
                  Novella — это современное пространство для любителей чтения в Астане.
                  Более 15 000 книг, уютные читальные залы и удобная система онлайн-бронирования.
                </p>
                <div className="flex items-center gap-8 flex-wrap">
                  <div>
                    <div className="text-3xl font-semibold text-secondary">15 000+</div>
                    <div className="text-sm text-cafe-noir/70">книг в фонде</div>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold text-secondary">450+</div>
                    <div className="text-sm text-cafe-noir/70">читателей в день</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/cover/library.jpg"
                alt="Интерьер библиотеки Novella"
                className="w-full h-[190px] sm:h-[230px] md:h-[280px] lg:h-[320px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold heading-font text-cafe-noir mb-3">Как получить книгу</h2>
            <p className="text-secondary">3 шага в стилистике сервиса Novella</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Найдите книгу',
                text: 'Поиск, автор, жанр — все удобно фильтруется по библиотеке.'
              },
              {
                step: '02',
                title: 'Забронируйте онлайн',
                text: 'Выберите дату получения и оставьте бронь за собой.'
              },
              {
                step: '03',
                title: 'Получите в библиотеке',
                text: 'Приходите точно в срок и забирайте книгу на выдаче.'
              }
            ].map((item) => (
              <div key={item.step} className="feature-card p-8 text-center">
                <div className="feature-step">{item.step}</div>
                <h3 className="text-2xl font-bold heading-font mb-3">{item.title}</h3>
                <p className="text-cafe-noir/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20 bg-[#f4efe6] scroll-mt-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold heading-font text-cafe-noir mb-3">FAQ</h2>
            <p className="text-secondary">Разверните ответы на самые популярные вопросы</p>
          </div>
          <div className="grid gap-4 max-w-4xl mx-auto">
            {faqItems.map((item, index) => {
              const isActive = activeFaqIndex === index;
              return (
                <div key={item.question} className="faq-item">
                  <button
                    className={`faq-question ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveFaqIndex(isActive ? null : index)}
                    aria-expanded={isActive}
                  >
                    <span>{item.question}</span>
                    <i className={`fa-solid ${isActive ? 'fa-xmark' : 'fa-plus'}`}></i>
                  </button>
                  <div className={`faq-answer ${isActive ? 'open' : ''}`}>
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
