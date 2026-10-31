import { getColloquiumCardForYear } from '../utils/colloquium.js'

const regularTestGroups = [
  {
    id: '1web-26',
    group: '1WEB-26',
    title: '1WEB-26',
    description: 'Тесты первого курса: web-дизайн, HTML, CSS и основы JavaScript.',
    tests: [
      {
        id: 'case-1',
        type: 'test',
        slug: 'case-1',
        path: '/test/case-1',
        title: 'Тест по первому кейсу',
        description: 'Материалы уроков 1–5: web-дизайн, Photopea, изображения для web, GIF, основы сайта и Figma.',
        visible: true,
        showAnswersAfterFinish: true, // при двух попытках разбор после второй
        repeat: true,
        maxAttempts: 3,
        resultMode: 'best',
        timeLimitSeconds: 2700, // 45 минут в секундах
        passingPercent: 50,
        difficulty: 3,
        questions: [
          // Урок 1, слайд 5
          {
            id: 'case1-radio-01',
            type: 'radio',
            question: 'Из чего состоит растровое изображение?',
            options: [
              { id: '1', text: 'Из пикселей' },
              { id: '2', text: 'Из линий и фигур, описанных формулами' },
              { id: '3', text: 'Из отдельных страниц документа' },
              { id: '4', text: 'Только из текста' },
            ],
            correctAnswer: '1',
            points: 1,
          },
          // Урок 1, слайд 2
          {
            id: 'case1-checkbox-02',
            type: 'checkbox',
            question: 'Что относится к хорошему web-дизайну? Выберите все подходящие варианты.',
            options: [
              { id: '1', text: 'Удобная и понятная навигация' },
              { id: '2', text: 'Продуманные цвета и шрифты' },
              { id: '3', text: 'Качественные, но не слишком тяжёлые изображения' },
              { id: '4', text: 'Обязательная анимация каждого элемента' },
            ],
            correctAnswers: ['1', '2', '3'],
            points: 1,
          },
          // Урок 1, слайды 6–7
          {
            id: 'case1-radio-03',
            type: 'radio',
            question: 'Какой формат лучше выбрать для логотипа, который должен оставаться чётким при изменении размера?',
            options: [
              { id: '1', text: 'JPG' },
              { id: '2', text: 'GIF' },
              { id: '3', text: 'SVG' },
              { id: '4', text: 'WebP' },
            ],
            correctAnswer: '3',
            points: 1,
          },
          // Урок 2, слайд 9
          {
            id: 'case1-radio-04',
            type: 'radio',
            question: 'Для чего используют маску при редактировании изображения?',
            options: [
              { id: '1', text: 'Чтобы навсегда удалить часть фотографии' },
              { id: '2', text: 'Чтобы скрыть часть изображения без окончательного удаления' },
              { id: '3', text: 'Чтобы сделать все слои одним слоем' },
              { id: '4', text: 'Чтобы автоматически изменить формат файла' },
            ],
            correctAnswer: '2',
            points: 1,
          },
          // Урок 2, слайд 10
          {
            id: 'case1-radio-05',
            type: 'radio',
            question: 'Какая настройка коррекции делает изображение светлее или темнее?',
            options: [
              { id: '1', text: 'Насыщенность' },
              { id: '2', text: 'Кадрирование' },
              { id: '3', text: 'Контраст' },
              { id: '4', text: 'Яркость' },
            ],
            correctAnswer: '4',
            points: 1,
          },
          // Урок 2, слайд 12
          {
            id: 'case1-checkbox-06',
            type: 'checkbox',
            question: 'Какие три характеристики изображения важно учитывать перед размещением на сайте?',
            options: [
              { id: '1', text: 'Формат файла' },
              { id: '2', text: 'Размер в пикселях' },
              { id: '3', text: 'Название слоя в редакторе' },
              { id: '4', text: 'Вес файла' },
            ],
            correctAnswers: ['1', '2', '4'],
            points: 1,
          },
          // Урок 2, слайды 12 и 14
          {
            id: 'case1-radio-07',
            type: 'radio',
            question: 'На сайте изображение нужно показать в небольшой карточке. Что поможет избежать лишнего веса страницы?',
            options: [
              { id: '1', text: 'Загрузить исходное фото 5000×3000 px без изменений' },
              { id: '2', text: 'Уменьшить размеры изображения перед загрузкой' },
              { id: '3', text: 'Сохранить фотографию только в PSD' },
              { id: '4', text: 'Сделать из фотографии анимированный GIF' },
            ],
            correctAnswer: '2',
            points: 1,
          },
          // Урок 3, слайд 6
          {
            id: 'case1-radio-08',
            type: 'radio',
            question: 'Благодаря чему в GIF-анимации возникает ощущение движения?',
            options: [
              { id: '1', text: 'Быстрой смене кадров' },
              { id: '2', text: 'Автоматическому изменению HTML-кода' },
              { id: '3', text: 'Подключению шрифтов к странице' },
              { id: '4', text: 'Изменению размера окна браузера' },
            ],
            correctAnswer: '1',
            points: 1,
          },
          // Урок 3, слайд 18
          {
            id: 'case1-checkbox-09',
            type: 'checkbox',
            question: 'Какие действия входят в описанный в презентации путь загрузки сайта после ввода его адреса?',
            options: [
              { id: '1', text: 'Браузер запрашивает страницу' },
              { id: '2', text: 'Браузер показывает полученную страницу' },
              { id: '3', text: 'Браузер обязательно редактирует исходники на сервере' },
              { id: '4', text: 'Сервер отдаёт файлы' },
            ],
            correctAnswers: ['1', '3', '4'],
            points: 1,
          },
          // Урок 3, слайд 21
          {
            id: 'case1-radio-10',
            type: 'radio',
            question: 'Какое браузерное ядро используется в Firefox согласно презентации?',
            options: [
              { id: '1', text: 'Blink' },
              { id: '2', text: 'WebKit' },
              { id: '3', text: 'Gecko' },
              { id: '4', text: 'Chromium' },
            ],
            correctAnswer: '3',
            points: 1,
          },
          // Урок 3, слайды 17 и 19
          {
            id: 'case1-input-11',
            type: 'input',
            question: 'Какой язык отвечает за структуру веб-страницы: заголовки, текст, ссылки и изображения? Напишите его аббревиатуру.',
            answers: ['HTML', 'html', 'Html', 'хтмл'],
            points: 1,
          },
          // Урок 4, слайд 4
          {
            id: 'case1-radio-12',
            type: 'radio',
            question: 'Что прежде всего показывает схема сайта (wireframe)?',
            options: [
              { id: '1', text: 'Расположение блоков и общую структуру' },
              { id: '2', text: 'Окончательные цвета и тени' },
              { id: '3', text: 'Анимацию переходов между страницами' },
              { id: '4', text: 'Готовый код сайта' },
            ],
            correctAnswer: '1',
            points: 1,
          },
          // Урок 4, слайд 10
          {
            id: 'case1-radio-13',
            type: 'radio',
            question: 'Где в Figma изменяют Fill, Stroke и другие свойства выделенного объекта?',
            options: [
              { id: '1', text: 'В левой панели Layers' },
              { id: '2', text: 'В правой панели Design' },
              { id: '3', text: 'В режиме просмотра Play' },
              { id: '4', text: 'В списке файлов проекта' },
            ],
            correctAnswer: '2',
            points: 1,
          },
          // Урок 4, слайд 17
          {
            id: 'case1-checkbox-14',
            type: 'checkbox',
            question: 'Какие настройки относятся к Auto Layout в Figma? Выберите все подходящие варианты.',
            options: [
              { id: '1', text: 'Название файла проекта' },
              { id: '2', text: 'Направление расположения элементов' },
              { id: '3', text: 'Расстояние между элементами (Gap)' },
              { id: '4', text: 'Внутренние отступы (Padding)' },
            ],
            correctAnswers: ['2', '3', '4'],
            points: 1,
          },
          // Урок 4, слайд 30
          {
            id: 'case1-radio-15',
            type: 'radio',
            question: 'Для чего в Figma используется Smart Animate?',
            options: [
              { id: '1', text: 'Для экспорта изображения в WebP' },
              { id: '2', text: 'Для создания резервной копии файла' },
              { id: '3', text: 'Для плавной анимации изменений совпадающих слоёв между экранами' },
              { id: '4', text: 'Для замены текста во всём проекте' },
            ],
            correctAnswer: '3',
            points: 1,
          },
          // Урок 4, слайды 5 и 12
          {
            id: 'case1-input-16',
            type: 'input',
            question: 'Как в Figma называется контейнер экрана, который может содержать элементы интерфейса и поддерживать Auto Layout? Напишите одно слово.',
            answers: ['Frame', 'frame', 'фрейм', 'Фрейм'],
            points: 1,
          },
          // Урок 5, слайд 10
          {
            id: 'case1-radio-17',
            type: 'radio',
            question: 'Для чего в практике с кнопкой выбирают Hug contents?',
            options: [
              { id: '1', text: 'Чтобы кнопка автоматически подстраивалась под длину текста' },
              { id: '2', text: 'Чтобы кнопка всегда была строго одного размера' },
              { id: '3', text: 'Чтобы скрыть текст кнопки' },
              { id: '4', text: 'Чтобы отключить отступы' },
            ],
            correctAnswer: '1',
            points: 1,
          },
          // Урок 5, слайды 12 и 14
          {
            id: 'case1-checkbox-18',
            type: 'checkbox',
            question: 'Выберите правильные состояния кнопок?',
            options: [
              { id: '1', text: 'Default' },
              { id: '2', text: 'Archived' },
              { id: '3', text: 'Hover' },
              { id: '4', text: 'Blocked' },
              { id: '5', text: 'Pressed/Active' },
              { id: '6', text: 'Protected' },
            ],
            correctAnswers: ['1', '3', '5'],
            points: 1,
          },
          {
            id: 'case1-radio-19',
            type: 'radio',
            question: 'Как с помощью инструмента Pen в Figma создать плавную кривую вместо прямой линии?',
            options: [
              { id: '1', text: 'Использовать только одиночные клики для создания точек' },
              { id: '2', text: 'Создать несколько фигур и объединить их через Union' },
              { id: '3', text: 'Нажать и перетащить точку, чтобы создать направляющие ручки' },
              { id: '4', text: 'Изменить Corner radius у всего Frame' },
            ],
            correctAnswer: '3',
            points: 1,
          },
          {
            id: 'case1-radio-20',
            type: 'radio',
            question: 'Как в Figma настраивается переход между экранами при нажатии на кнопку?',
            options: [
              { id: '1', text: 'Через Export с выбором формата HTML' },
              { id: '2', text: 'Через Prototype: Trigger — On click, Action — Navigate to' },
              { id: '3', text: 'Через Auto Layout с вертикальным направлением' },
              { id: '4', text: 'Через Effects с добавлением анимации Blur' },
            ],
            correctAnswer: '2',
            points: 1,
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
        id: 'case-1-2web',
        type: 'test',
        slug: 'case-1-2web',
        path: '/test/case-1-2web',
        title: 'Тест по первому кейсу',
        description: 'Основы клиент–серверной модели, PHP, условий, циклов, файлов и функций.',
        visible: true,
        showAnswersAfterFinish: true,
        repeat: true,
        maxAttempts: 2,
        resultMode: 'best',
        timeLimitSeconds: 1800, // 30 минут
        passingPercent: 50,
        difficulty: 3,
        questions: [
          // Урок 1, слайды 2–4
          {
            id: 'case2-radio-01',
            type: 'radio',
            question: "Кто отправляет запрос, когда пользователь открывает страницу сайта?",
            options: [
              { id: "1", text: "Веб-сервер" },
              { id: "2", text: "Браузер пользователя" },
              { id: "3", text: "Сервер базы данных" },
              { id: "4", text: "Файловый сервер" },
            ],
            correctAnswer: '2',
            points: 1,
          },
          // Урок 1, слайд 4
          {
            id: 'case2-radio-02',
            type: 'radio',
            question: "Для чего используется HTTP при открытии сайта?",
            options: [
              { id: "1", text: "Для передачи запросов и ответов между клиентом и сервером" },
              { id: "2", text: "Для создания таблиц в базе данных" },
              { id: "3", text: "Для изменения цвета элементов сайта" },
              { id: "4", text: "Для хранения исходного кода программы" },
            ],
            correctAnswer: '1',
            points: 1,
          },
          // Урок 1, слайды 8–10
          {
            id: 'case2-radio-03',
            type: 'radio',
            question: "Где обычно выполняется PHP-код веб-сайта?",
            options: [
              { id: "1", text: "В браузере пользователя" },
              { id: "2", text: "В редакторе изображений" },
              { id: "3", text: "На сервере" },
              { id: "4", text: "В CSS-файле" },
            ],
            correctAnswer: '3',
            points: 1,
          },
          // Урок 1, слайд 13
          {
            id: 'case2-radio-04',
            type: 'radio',
            question: "С какого символа начинается имя переменной в PHP?",
            options: [
              { id: "1", text: "@" },
              { id: "2", text: "#" },
              { id: "3", text: "$" },
              { id: "4", text: "%" },
            ],
            correctAnswer: '3',
            points: 1,
          },
          // Урок 1, слайд 15
          {
            id: 'case2-radio-05',
            type: 'radio',
            question: "Какой оператор в PHP соединяет две строки в одну?",
            options: [
              { id: "1", text: "+" },
              { id: "2", text: "." },
              { id: "3", text: "*" },
              { id: "4", text: "==" },
            ],
            correctAnswer: '2',
            points: 1,
          },
          // Урок 3, слайд 4
          {
            id: 'case2-radio-06',
            type: 'radio',
            question: "Что делает конструкция if в PHP?",
            options: [
              { id: "1", text: "Повторяет код фиксированное количество раз" },
              { id: "2", text: "Выполняет код в зависимости от условия" },
              { id: "3", text: "Сохраняет текст в файл" },
              { id: "4", text: "Объявляет новую функцию" },
            ],
            correctAnswer: '2',
            points: 1,
          },
          // Урок 3, слайд 17
          {
            id: 'case2-radio-07',
            type: 'radio',
            question: "Для чего удобнее всего использовать foreach?",
            options: [
              { id: "1", text: "Для перебора элементов массива" },
              { id: "2", text: "Для отправки HTTP-запроса" },
              { id: "3", text: "Для создания нового PHP-файла" },
              { id: "4", text: "Для сравнения двух типов данных" },
            ],
            correctAnswer: '1',
            points: 1,
          },
          // Урок 3, слайд 16
          {
            id: 'case2-radio-08',
            type: 'radio',
            question: "Какой цикл удобен, когда число повторений заранее известно?",
            options: [
              { id: "1", text: "while" },
              { id: "2", text: "foreach" },
              { id: "3", text: "for" },
              { id: "4", text: "switch" },
            ],
            correctAnswer: '3',
            points: 1,
          },
          // Урок 4–5, слайд 5
          {
            id: 'case2-radio-09',
            type: 'radio',
            question: "Какая функция PHP читает содержимое небольшого файла целиком?",
            options: [
              { id: "1", text: "file_put_contents()" },
              { id: "2", text: "file_get_contents()" },
              { id: "3", text: "fclose()" },
              { id: "4", text: "fputcsv()" },
            ],
            correctAnswer: '2',
            points: 1,
          },
          // Урок 4–5, раздел «Функции»
          {
            id: 'case2-radio-10',
            type: 'radio',
            question: "Что делает return внутри функции PHP?",
            options: [
              { id: "1", text: "Обязательно печатает результат в браузере" },
              { id: "2", text: "Записывает данные в файл" },
              { id: "3", text: "Начинает цикл заново" },
              { id: "4", text: "Возвращает результат из функции" },
            ],
            correctAnswer: '4',
            points: 1,
          },
          // Урок 1, слайды 2–5
          {
            id: 'case2-checkbox-01',
            type: 'checkbox',
            question: "Какие задачи может выполнять сервер сайта? Выберите все правильные варианты.",
            options: [
              { id: "1", text: "Обрабатывать запросы клиента" },
              { id: "2", text: "Хранить файлы и данные сайта" },
              { id: "3", text: "Заменять экран пользователя физическим устройством" },
              { id: "4", text: "Отправлять ответы клиенту" },
            ],
            correctAnswers: ["1", "2", "4"],
            points: 1,
          },
          // Урок 3, слайды 4, 17, 22
          {
            id: 'case2-checkbox-02',
            type: 'checkbox',
            question: "Какие утверждения об условиях и циклах в PHP верны? Выберите все правильные варианты.",
            options: [
              { id: "1", text: "if позволяет выбрать действие по условию" },
              { id: "2", text: "else всегда выполняется после if независимо от условия" },
              { id: "3", text: "foreach перебирает элементы массива" },
              { id: "4", text: "break может завершить цикл" },
            ],
            correctAnswers: ["1", "3", "4"],
            points: 1,
          },
          // Урок 4–5, слайды 3, 5–7
          {
            id: 'case2-checkbox-03',
            type: 'checkbox',
            question: "Какие действия относятся к работе с файлами в PHP? Выберите все правильные варианты.",
            options: [
              { id: "1", text: "Запись данных в файл" },
              { id: "2", text: "Чтение содержимого файла" },
              { id: "3", text: "Добавление данных в конец файла" },
              { id: "4", text: "Автоматическое преобразование любого файла в базу данных" },
            ],
            correctAnswers: ["2", "3", "4"],
            points: 1,
          },
          // Урок 1, слайд 11
          {
            id: 'case2-input-01',
            type: 'input',
            question: "Как называется команда PHP, которая выводит текст на страницу? Напишите её название латинскими буквами.",
            answers: ["echo", "эхо"],
            points: 1,
          },
          // Урок 3, слайд 4
          {
            id: 'case2-input-02',
            type: 'input',
            question: "Как называется оператор PHP для выбора действия по условию? Введите его английское ключевое слово.",
            answers: ["if", "иф", "если"],
            points: 1,
          },
        ],
      },
    ],
  },
]

// Коллоквиум автоматически появляется в каждой группе; параметры редактируются
// только в colloquium.map.js. Не нужно добавлять карточку вручную сюда.
export const testGroups = regularTestGroups.map((group) => ({
  ...group,
  tests: [...group.tests, getColloquiumCardForYear(Number(group.group[0]))].filter(Boolean),
}))

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
  return tests.find((test) => test.type !== 'colloquium' && test.slug === slug && test.visible) ?? null
}
