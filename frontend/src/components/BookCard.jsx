import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <div className="overflow-hidden h-full transition-transform duration-200 hover:-translate-y-1 flex flex-col shadow-lg rounded-2xl">
      <div className="w-full h-72 overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-white p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-secondary text-sm">{book.author}</p>
        <p className="text-sm text-gray-600 mb-3">{book.genre}</p>
        <div className="flex items-center justify-between mt-auto gap-3 min-h-[60px]">
          <span className={`badge ${book.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-center py-2 px-3 min-w-[100px]`}>
            {book.status === 'available' ? 'Доступна' : 'Забронирована'}
          </span>
          <Link to={`/book/${book.id}`} className="btn text-sm px-4 py-2 min-w-[120px] text-center">
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
