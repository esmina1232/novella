const bcrypt = require('bcrypt');
const User = require('../models/User');
const Book = require('../models/Book');

const COVER_BY_TITLE = {
  'Война и мир': '/cover/voina.jpg',
  'Преступление и наказание': '/cover/prestuplenue.jpg',
  '1984': '/cover/1984.jpg',
  'Мастер и Маргарита': '/cover/master.jpg',
  'Маленький принц': '/cover/malenkiprince.jpg',
  'Гарри Поттер и философский камень': '/cover/harrypotter.jpg',
  'Три товарища': '/cover/tritovatisha.jpg',
  'Унесённые ветром': '/cover/ynesenievetrom.jpg',
  'Мотылек': '/cover/motilek.jpg',
  'Невыносимая лёгкость бытия': '/cover/nevinosimaya.jpg',
  'Алхимик': '/cover/alhimik.jpg',
  'Белая гвардия': '/cover/belayagvardiya.jpg',
  'Приключения Шерлока Холмса': '/cover/sherlockhoms.jpg',
  '451 градус по Фаренгейту': '/cover/451.jpg',
  'Хоббит': '/cover/hobbit.jpg',
  'Преображение': '/cover/preobrazhenie.jpg',
  'Зов предков': '/cover/zovpredcov.jpg',
  'Прежде чем я усну': '/cover/prezhdechemyausnu.jpg',
  'Сто лет одиночества': '/cover/100letodinochestva.jpg',
  'Идиот': '/cover/idiot.jpg',
  'Доктор Живаго': '/cover/doctorzhivago.jpg',
  'Властелин колец: Братство кольца': '/cover/vlastelinkolec.jpg',
  'О дивный новый мир': '/cover/odivniynovimir.jpg',
  'Убить пересмешника': '/cover/ubitperesmeshnika.jpg',
  'Норвежский лес': '/cover/norvezhskiles.jpg',
  'Женщина в белом': '/cover/zhenchinavbelom.jpg',
  'Улисс': '/cover/uliss.jpg',
  'Одиссея': '/cover/odiseya.jpg'
};

const defaultBooks = [
  {
    title: 'Война и мир',
    author: 'Лев Толстой',
    genre: 'Исторический роман',
    year: 1869,
    status: 'available',
    cover: '/cover/война.jpg',
    description: 'Эпический роман о судьбах нескольких семей и эпохе Наполеоновских войн.'
  },
  {
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    genre: 'Психологический роман',
    year: 1866,
    status: 'available',
    cover: 'https://picsum.photos/id/201/300/400',
    description: 'Трагедия молодого студента Раскольникова и его моральный выбор.'
  },
  {
    title: '1984',
    author: 'Джордж Оруэлл',
    genre: 'Антиутопия',
    year: 1949,
    status: 'available',
    cover: 'https://picsum.photos/id/237/300/400',
    description: 'Классика антиутопии о тоталитарном обществе и полном контроле государства.'
  },
  {
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    genre: 'Мистический роман',
    year: 1967,
    status: 'available',
    cover: 'https://picsum.photos/id/870/300/400',
    description: 'Знаковый роман о любви, свободе и борьбе добра со злом.'
  },
  {
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    genre: 'Философская сказка',
    year: 1943,
    status: 'available',
    cover: 'https://picsum.photos/id/1025/300/400',
    description: 'Трогательная история о дружбе, ответственности и взгляде на мир глазами ребёнка.'
  },
  {
    title: 'Гарри Поттер и философский камень',
    author: 'Дж. К. Роулинг',
    genre: 'Фэнтези',
    year: 1997,
    status: 'available',
    cover: 'https://picsum.photos/id/1040/300/400',
    description: 'Первая книга о юном волшебнике, открывающем для себя мир магии.'
  },
  {
    title: 'Три товарища',
    author: 'Эрих Мария Ремарк',
    genre: 'Роман',
    year: 1936,
    status: 'available',
    cover: 'https://picsum.photos/id/1060/300/400',
    description: 'История о дружбе, любви и надежде в непростое послевоенное время.'
  },
  {
    title: 'Унесённые ветром',
    author: 'Маргарет Митчелл',
    genre: 'Исторический роман',
    year: 1936,
    status: 'available',
    cover: 'https://picsum.photos/id/1084/300/400',
    description: 'Эпическая история любви и выживания на фоне Гражданской войны в США.'
  },
  {
    title: 'Мотылек',
    author: 'Арни Шарьер',
    genre: 'Современный роман',
    year: 2024,
    status: 'available',
    cover: 'https://picsum.photos/id/1121/300/400',
    description: 'Новая история про свободу, потерю и встречу с истинным «я».',
  },
  {
    title: 'Невыносимая лёгкость бытия',
    author: 'Милан Кундера',
    genre: 'Философский роман',
    year: 1984,
    status: 'available',
    cover: 'https://picsum.photos/id/163/300/400',
    description: 'Размышления о любви, судьбе и идентичности в Праге 1960-х.'
  },
  {
    title: 'Алхимик',
    author: 'Пауло Коэльо',
    genre: 'Философская притча',
    year: 1988,
    status: 'available',
    cover: 'https://picsum.photos/id/1080/300/400',
    description: 'Поиски своего предназначения на пути к Сахаре.'
  },
  {
    title: 'Белая гвардия',
    author: 'Михаил Булгаков',
    genre: 'Исторический роман',
    year: 1924,
    status: 'available',
    cover: 'https://picsum.photos/id/121/300/400',
    description: 'Семейная драма на фоне Гражданской войны в Украине.'
  },
  {
    title: 'Приключения Шерлока Холмса',
    author: 'Артур Конан Дойл',
    genre: 'Детектив',
    year: 1892,
    status: 'available',
    cover: 'https://picsum.photos/id/250/300/400',
    description: 'Сборник классических расследований легендарного детектива.'
  },
  {
    title: '451 градус по Фаренгейту',
    author: 'Рэй Брэдбери',
    genre: 'Антиутопия',
    year: 1953,
    status: 'available',
    cover: 'https://picsum.photos/id/1045/300/400',
    description: 'Противостояние с системой цензуры и сжигания книг.'
  },
  {
    title: 'Хоббит',
    author: 'Дж. Р. Р. Толкин',
    genre: 'Фэнтези',
    year: 1937,
    status: 'available',
    cover: 'https://picsum.photos/id/1077/300/400',
    description: 'Путешествие Бильбо Бэггинса к Одинокой горе.',
  },
  {
    title: 'Преображение',
    author: 'Франц Кафка',
    genre: 'Модерн',
    year: 1915,
    status: 'available',
    cover: 'https://picsum.photos/id/1044/300/400',
    description: 'Трагическая история превращения человека в насекомое.'
  },
  {
    title: 'Зов предков',
    author: 'Джек Лондон',
    genre: 'Приключенческий роман',
    year: 1903,
    status: 'available',
    cover: 'https://picsum.photos/id/1116/300/400',
    description: 'Борьба собаки за выживание в суровой природе Аляски.'
  },
  {
    title: 'Прежде чем я усну',
    author: 'С. Дж. Уотсон',
    genre: 'Психологический триллер',
    year: 2011,
    status: 'available',
    cover: 'https://picsum.photos/id/1054/300/400',
    description: 'Женщина каждый день просыпается, забыв всё — и пытается восстановить жизнь.'
  },
  {
    title: 'Сто лет одиночества',
    author: 'Габриэль Гарсиа Маркес',
    genre: 'Магический реализм',
    year: 1967,
    status: 'available',
    cover: 'https://picsum.photos/id/1069/300/400',
    description: 'Сказочная семейная сага семьи Буэндиа.'
  },
  {
    title: 'Идиот',
    author: 'Фёдор Достоевский',
    genre: 'Роман',
    year: 1869,
    status: 'available',
    cover: 'https://picsum.photos/id/998/300/400',
    description: 'История князя Мышкина и его доброты в жестоком мире.'
  },
  {
    title: 'Доктор Живаго',
    author: 'Борис Пастернак',
    genre: 'Роман',
    year: 1957,
    status: 'available',
    cover: 'https://picsum.photos/id/1028/300/400',
    description: 'Любовь и судьба на фоне революции и войны.'
  },
  {
    title: 'Властелин колец: Братство кольца',
    author: 'Дж. Р. Р. Толкин',
    genre: 'Фэнтези',
    year: 1954,
    status: 'available',
    cover: 'https://picsum.photos/id/1062/300/400',
    description: 'Начало эпического путешествия по уничтожению кольца.'
  },
  {
    title: 'О дивный новый мир',
    author: 'Олдос Хаксли',
    genre: 'Антиутопия',
    year: 1932,
    status: 'available',
    cover: 'https://picsum.photos/id/1014/300/400',
    description: 'Угроза тотального контроля через манипуляцию счастьем.'
  },
  {
    title: 'Убить пересмешника',
    author: 'Харпер Ли',
    genre: 'Проза',
    year: 1960,
    status: 'available',
    cover: 'https://picsum.photos/id/119/300/400',
    description: 'Борьба за справедливость глазами ребёнка в южных США.'
  },
  {
    title: 'Норвежский лес',
    author: 'Харуки Мураками',
    genre: 'Современный роман',
    year: 1987,
    status: 'available',
    cover: 'https://picsum.photos/id/1046/300/400',
    description: 'Трогательная история взросления и потери в Токио 1960-х.'
  },
  {
    title: 'Женщина в белом',
    author: 'Уилки Коллинз',
    genre: 'Готический детектив',
    year: 1859,
    status: 'available',
    cover: 'https://picsum.photos/id/1136/300/400',
    description: 'Тайна, обман и разоблачение в викторианской Англии.'
  },
  {
    title: 'Улисс',
    author: 'Джеймс Джойс',
    genre: 'Модерн',
    year: 1922,
    status: 'available',
    cover: 'https://picsum.photos/id/1112/300/400',
    description: 'Один день из жизни Дублина в потоке сознания.'
  },
  {
    title: 'Одиссея',
    author: 'Гомер',
    genre: 'Эпос',
    year: -700,
    status: 'available',
    cover: 'https://picsum.photos/id/1051/300/400',
    description: 'Путешествие Одиссея домой после Троянской войны.'
  }
];

async function seedDatabase() {
  const ownerEmail = 'owner@novella.kz';
  const ownerExists = await User.findOne({ email: ownerEmail }).lean();

  if (!ownerExists) {
    const password = await bcrypt.hash('owner12345', 10);
    await User.create({
      name: 'Владелец',
      email: ownerEmail,
      password,
      role: 'admin'
    });
  }

  const booksWithLocalCovers = defaultBooks.map((book) => ({
    ...book,
    cover: COVER_BY_TITLE[book.title] || book.cover
  }));

  const booksCount = await Book.countDocuments();
  if (booksCount < booksWithLocalCovers.length) {
    await Book.deleteMany();
    await Book.insertMany(booksWithLocalCovers);
    return;
  }

  // Keep existing books synced with local covers by title.
  for (const book of booksWithLocalCovers) {
    await Book.updateOne(
      { title: book.title, author: book.author },
      { $set: { cover: book.cover } }
    );
  }
}

module.exports = { seedDatabase };
