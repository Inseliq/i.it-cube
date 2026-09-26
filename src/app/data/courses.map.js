export const courses = [
  {
    id: 1,
    title: '1 курс',
    repo: 1,
    description:
      'Первый курс обучения веб-разработке',

    lessons: [
      {
        id: 1,
        title: 'Дизайн',
        slug: 'design',
        path: '/lesson/design',
        description:
          'Основы дизайна и работа с изображениями',
        reference: '',
      },
      {
        id: 2,
        title: 'HTML',
        slug: 'html',
        path: '/lesson/html',
        description: 'Основы HTML',
        reference: '',
      }
    ],
  },

  {
    id: 2,
    title: '2 курс',
    repo: 2,
    description:
      'Второй курс обучения веб-разработке',

    lessons: [
      {
        id: 1,
        title: 'Клиент-сервер',
        slug: 'server',
        path: '/lesson/server',
        description:
          'Основы клиент-серверной архитектуры',
        reference: '',
      },
    ],
  },
]