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
        repeat: true,
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
            correctAnswer: '1',
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
    tests: [],
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
