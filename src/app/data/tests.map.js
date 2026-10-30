export const testGroups = [
  {
    id: '1web-26',
    group: '1WEB-26',
    title: '1WEB-26',
    description: 'Тесты первого курса: web-дизайн, HTML, CSS и основы JavaScript.',
    tests: [
      {
        id: 'design',
        slug: 'design',
        path: '/test/design',
        title: 'Пробный тест',
        description: 'Пробный тест платформы, как работает, баги лаги и тп.',
        visible: true,
        showAnswersAfterFinish: true,
        repeat: true, // устаревший параметр для совместимости: используйте maxAttempts
        maxAttempts: 3, // 0 или null − бесконечно; 1–3 − лимит; 4+ = 3
        resultMode: 'best', // 'best' − лучшая попытка, 'last' − последняя
        timeLimitSeconds: 180, // время на одну попытку, секунды; 0 − без таймера
        passingPercent: 45, // тест зачтён при достижении этого процента
        difficulty: 2,
        questions: [
          {
            id: 'design-input-1',
            type: 'input',
            question: 'Как зовут преподавателя?',
            answers: ['Никита', 'Кошкаровский Никита', 'Никита Алексеевич'],
            points: 2,
          },
          {
            id: 'design-radio-1',
            type: 'radio',
            question: 'Какая вы группа?',
            options: [
              { id: '1', text: '2WEB-25' },
              { id: '2', text: '2WEB-26' },
              { id: '3', text: '1WEB-25' },
              { id: '4', text: '1WEB-26' },
            ],
            correctAnswer: '4',
            points: 2,
          },
          {
            id: 'design-checkbox-1',
            type: 'checkbox',
            question: 'Вам нравится тест?',
            options: [
              { id: '1', text: 'Да' },
              { id: '2', text: 'Очень' },
              { id: '3', text: 'Супер супер' },
              { id: '4', text: 'Нет((' },
            ],
            correctAnswers: ['1', '2', '3'],
            points: 2,
          },
        ],
      },
    ],
  },
  {
    id: '2web-25',
    group: '2WEB-25',
    title: '2WEB-25',
    description: 'Тесты второго курса: клиент-сервер, PHP, базы данных и серверная разработка.',
    tests: [
      {
        id: 'server',
        slug: 'server',
        path: '/test/server',
        title: 'Основы PHP',
        description: 'Клиент–сервер и основы PHP.',
        visible: true,
        showAnswersAfterFinish: true,
        repeat: true,
        maxAttempts: 0, // 0 − бесконечное количество попыток
        resultMode: 'last', // при бесконечном лимите каждая попытка оценивается отдельно
        timeLimitSeconds: 600, // 10 минут
        passingPercent: 45,
        difficulty: 2,
        questions: [
          {
            id: 'server-input-1',
            type: 'input',
            question: 'Кто отправляет запрос к серверу?',
            answers: ['клиент', 'браузер', 'фронтенд'],
            points: 2,
          },
          {
            id: 'server-radio-1',
            type: 'radio',
            question: 'Что означает localhost?',
            options: [
              { id: '1', text: 'Удалённый сервер' },
              { id: '2', text: 'Пароль' },
              { id: '3', text: 'Локальный владелец' },
              { id: '4', text: 'Чужой сайт' },
              { id: '5', text: 'Локальный сервер' },
            ],
            correctAnswer: '5',
            points: 2,
          },
          {
            id: 'server-radio-2',
            type: 'radio',
            question: 'Что делает HTTP?',
            options: [
              { id: '1', text: 'Хранит фото' },
              { id: '2', text: 'Передаёт запросы и ответы' },
              { id: '3', text: 'Рисует кнопки' },
            ],
            correctAnswer: '2',
            points: 3,
          },
          {
            id: 'server-radio-3',
            type: 'radio',
            question: 'Где выполняется PHP?',
            options: [
              { id: '1', text: 'На кухне' },
              { id: '2', text: 'На сервере' },
              { id: '3', text: 'Только в браузере' },
              { id: '4', text: 'В CSS' },
            ],
            correctAnswer: '2',
            points: 2,
          },
          {
            id: 'server-radio-4',
            type: 'radio',
            question: 'С какого символа начинается переменная в PHP?',
            options: [
              { id: '1', text: '#' },
              { id: '2', text: '$' },
              { id: '3', text: '@' },
              { id: '4', text: '&' },
            ],
            correctAnswer: '2',
            points: 3,
          },
          {
            id: 'server-input-2',
            type: 'input',
            question: 'Какая команда выводит текст на страницу?',
            answers: ['эхо', 'echo'],
            points: 4,
          },
          {
            id: 'server-radio-5',
            type: 'radio',
            question: 'Что склеивает строки в PHP?',
            options: [
              { id: '1', text: 'Точка .' },
              { id: '2', text: 'Слэш /' },
              { id: '3', text: 'Плюс +' },
              { id: '4', text: 'Равно =' },
            ],
            correctAnswer: '1',
            points: 3,
          },
          {
            id: 'server-radio-6',
            type: 'radio',
            question: 'Что означает ошибка 404?',
            options: [
              { id: '1', text: 'Всё отлично' },
              { id: '2', text: 'Файл/адрес не найден' },
              { id: '3', text: 'Переменная создана' },
              { id: '4', text: 'Ошибка в коде' },
            ],
            correctAnswer: '2',
            points: 3,
          },
          {
            id: 'server-radio-7',
            type: 'radio',
            question: 'Что такое Parse error?',
            options: [
              { id: '1', text: 'Ошибка синтаксиса' },
              { id: '2', text: 'Успешный запуск' },
              { id: '3', text: 'Картинка не загрузилась' },
              { id: '4', text: 'Сервер не доступен' },
            ],
            correctAnswer: '1',
            points: 3,
          },
          {
            id: 'server-checkbox-1',
            type: 'checkbox',
            question: 'Что получает браузер после выполнения PHP?',
            options: [
              { id: '1', text: 'Готовый HTML' },
              { id: '2', text: 'Результат выполнения функции' },
              { id: '3', text: 'Весь секретный код PHP' },
              { id: '4', text: 'Файл базы данных' },
              { id: '5', text: 'Все пароли пользователей' },
              { id: '6', text: 'Информацию из баз данных' },
            ],
            correctAnswers: ['1', '2', '6'],
            points: 4,
          },
        ],
      },
    ],
  },
]

export const tests = testGroups.flatMap((group) =>
  group.tests.map((test) => ({
    ...test,
    group: group.group,
    groupDescription: group.description,
  })),
)

export function getVisibleTests() {
  return tests.filter((test) => test.visible)
}

export function getTestBySlug(slug) {
  return tests.find((test) => test.slug === slug && test.visible) ?? null
}
