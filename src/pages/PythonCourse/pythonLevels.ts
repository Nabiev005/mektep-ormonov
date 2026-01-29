// src/pages/PythonCourse/pythonLevels.ts

export interface PythonLevel {
  id: number;
  title: string;
  description: string;
  codeExample: string;
  correctAnswer: string;
  hint: string;
}

export const pythonLevels: PythonLevel[] = [
  // 1-10: Негизги түшүнүктөр
  {
    id: 1,
    title: "Киришүү",
    description: "Экранга маалымат чыгаруу үчүн 'print()' функциясы колдонулат. Төмөндө 'Hello' деген сөздү чыгаруучу кодду толуктаңыз.",
    codeExample: 'print("____")',
    correctAnswer: 'Hello',
    hint: "Тырмакчанын ичине Hello деп жазыңыз."
  },
  {
    id: 2,
    title: "Сандарды чыгаруу",
    description: "Сандарды чыгарууда тырмакча керек эмес. 2026 санын чыгарыңыз.",
    codeExample: 'print(____)',
    correctAnswer: '2026',
    hint: "Жөн гана 2026 санын жазыңыз."
  },
  {
    id: 3,
    title: "Өзгөрмөлөр",
    description: "x өзгөрмөсүнө 5 санын бериңиз.",
    codeExample: 'x = ____',
    correctAnswer: '5',
    hint: "5 санын коюңуз."
  },
  {
    id: 4,
    title: "Математика: Кошуу",
    description: "2+3 жыйынтыгын чыгарыңыз.",
    codeExample: 'print(2 + ____)',
    correctAnswer: '3',
    hint: "2ге канчаны кошсо 5 болот?"
  },
  {
    id: 5,
    title: "Математика: Көбөйтүү",
    description: "Python-до көбөйтүү үчүн '*' белгиси колдонулат. 4тү 5ке көбөйтүңүз.",
    codeExample: 'print(4 ____ 5)',
    correctAnswer: '*',
    hint: "Көбөйтүү белгисин жазыңыз."
  },
  {
    id: 6,
    title: "Маалымат түрү: String",
    description: "Тексттик маалыматтар 'str' деп аталат. 'A' өзгөрмөсүнө 'IT' сөзүн бериңиз.",
    codeExample: "A = '____'",
    correctAnswer: 'IT',
    hint: "Болгону IT деп жазыңыз."
  },
  {
    id: 7,
    title: "Маалымат түрү: Integer",
    description: "Бүтүн сандар 'int' деп аталат. 7 саны кайсы түргө кирет?",
    codeExample: '# 7 бул ____',
    correctAnswer: 'int',
    hint: "integer сөзүнүн кыскартылган түрү."
  },
  {
    id: 8,
    title: "Комментарийлер",
    description: "Python-до комментарий кайсы белги менен башталат?",
    codeExample: '____ Бул комментарий',
    correctAnswer: '#',
    hint: "Решетка (#) белгиси."
  },
  {
    id: 9,
    title: "Даражага көтөрүү",
    description: "2нин 3 даражасын (2*2*2) эсептөө үчүн '**' колдонулат.",
    codeExample: 'print(2 ____ 3)',
    correctAnswer: '**',
    hint: "Эки жолу жылдызча белгиси."
  },
  {
    id: 10,
    title: "Бөлүү",
    description: "10ду 2ге бөлгөндөгү жыйынтыкты чыгарыңыз.",
    codeExample: 'print(10 / ____)',
    correctAnswer: '2',
    hint: "10ду канчага бөлөбүз?"
  },

  // 11-20: Шарттар жана логика
  {
    id: 11,
    title: "Boolean",
    description: "Логикалык маанилер: True (Чын) же ____ (Жалган).",
    codeExample: 'is_active = ____',
    correctAnswer: 'False',
    hint: "Жалган сөзүнүн англисчеси (баш тамга менен)."
  },
  {
    id: 12,
    title: "Салыштыруу: Теңдик",
    description: "Эки маанини теңби деп текшерүү үчүн '==' колдонулат.",
    codeExample: 'print(5 ____ 5)',
    correctAnswer: '==',
    hint: "Эки жолу барабар белгиси."
  },
  {
    id: 13,
    title: "If шарты",
    description: "Эгер x чоң болсо 0дон, 'OK' деп чыгарсын.",
    codeExample: 'if x > 0: print("____")',
    correctAnswer: 'OK',
    hint: "OK сөзүн жазыңыз."
  },
  {
    id: 14,
    title: "Else",
    description: "If аткарылбаса кайсы блок иштейт?",
    codeExample: 'if x > 5: print("Yes") ____: print("No")',
    correctAnswer: 'else',
    hint: "Башкача учурда (англисче)."
  },
  {
    id: 15,
    title: "Input",
    description: "Колдонуучудан маалымат алуу үчүн кайсы функция колдонулат?",
    codeExample: 'name = ____("Атың ким?")',
    correctAnswer: 'input',
    hint: "Киргизүү сөзүнүн англисчеси."
  },
  {
    id: 16,
    title: "Типти өзгөртүү",
    description: "Текстти санга айландыруу үчүн 'int()' колдонулат.",
    codeExample: 'x = ____("10")',
    correctAnswer: 'int',
    hint: "integer кыскартылганы."
  },
  {
    id: 17,
    title: "Маалыматтын узундугу",
    description: "Тексттин узундугун билүү үчүн 'len()' колдонулат. 'IT' канча тамга?",
    codeExample: 'print(len("____"))',
    correctAnswer: 'IT',
    hint: "IT сөзүн жазыңыз."
  },
  {
    id: 18,
    title: "List (Тизме)",
    description: "Тизмелер чарчы кашаа '[]' менен жазылат.",
    codeExample: 'colors = ____"red", "blue"____',
    correctAnswer: '[]',
    hint: "Чарчы кашааларды коюңуз."
  },
  {
    id: 19,
    title: "Тизмеге элемент кошуу",
    description: "Тизменин аягына кошуу үчүн '.append()' колдонулат.",
    codeExample: 'a.____(10)',
    correctAnswer: 'append',
    hint: "append сөзүн жазыңыз."
  },
  {
    id: 20,
    title: "Тизменин биринчи элементи",
    description: "Программалоодо санактоо канчадан башталат?",
    codeExample: 'print(colors[____])',
    correctAnswer: '0',
    hint: "Биринчи индекс дайыма нөл."
  },

  // 21-40: Циклдер жана Функциялар
  {
    id: 21,
    title: "For циклы",
    description: "Тизмени кайталоо үчүн 'for i in ____' колдонулат.",
    codeExample: 'for i in ____(5):',
    correctAnswer: 'range',
    hint: "Аралык (range) англисче."
  },
  {
    id: 22,
    title: "While циклы",
    description: "Шарт туура болуп турганда иштөөчү цикл.",
    codeExample: '____ x < 10:',
    correctAnswer: 'while',
    hint: "while сөзүн жазыңыз."
  },
  {
    id: 23,
    title: "Функция түзүү",
    description: "Функция түзүү үчүн кайсы ачкыч сөз колдонулат?",
    codeExample: '____ my_func():',
    correctAnswer: 'def',
    hint: "define сөзүнүн кыскартылганы."
  },
  {
    id: 24,
    title: "Функциядан маани кайтаруу",
    description: "Жыйынтык берүү үчүн 'return' колдонулат.",
    codeExample: 'def get_num(): ____ 10',
    correctAnswer: 'return',
    hint: "Кайтаруу (return) англисче."
  },
  {
    id: 25,
    title: "Dictionary (Сөздүк)",
    description: "Сөздүктөр тармал кашаа '{}' менен жазылат.",
    codeExample: 'user = ____"name": "Ali"____',
    correctAnswer: '{}',
    hint: "Тармал кашааларды коюңуз."
  },
  {
    id: 26,
    title: "Модуль кошуу",
    description: "Китепкананы кошуу үчүн 'import' колдонулат.",
    codeExample: '____ math',
    correctAnswer: 'import',
    hint: "import сөзүн жазыңыз."
  },
  {
    id: 27,
    title: "Тизменин аягы",
    description: "Тизменин эң акыркы элементинин индекси канча?",
    codeExample: 'print(a[____])',
    correctAnswer: '-1',
    hint: "Терс бир (-1)."
  },
  {
    id: 28,
    title: "Текстти чоңойтуу",
    description: "Тексттин баарын баш тамга кылуу үчүн кайсы метод колдонулат?",
    codeExample: '"hi".____()',
    correctAnswer: 'upper',
    hint: "upper сөзүн жазыңыз."
  },
  {
    id: 29,
    title: "Float",
    description: "3.14 сыяктуу ондук сандар эмне деп аталат?",
    codeExample: '# 3.14 бул ____',
    correctAnswer: 'float',
    hint: "float маалымат түрү."
  },
  {
    id: 30,
    title: "Калдык табуу",
    description: "Бөлүүдөн калган калдыкты табуу үчүн кайсы белги колдонулат?",
    codeExample: 'print(5 ____ 2)',
    correctAnswer: '%',
    hint: "Процент (%) белгиси."
  },
  {
    id: 31,
    title: "In оператору",
    description: "Тизмеде элемент бар же жок экенин текшерүү.",
    codeExample: 'if "a" ____ ["a", "b"]:',
    correctAnswer: 'in',
    hint: "in сөзүн жазыңыз."
  },
  {
    id: 32,
    title: "Каталарды кармоо",
    description: "Ката чыкканда иштөөчү блок.",
    codeExample: 'try: print(x) ____: print("Error")',
    correctAnswer: 'except',
    hint: "except сөзүн жазыңыз."
  },
  {
    id: 33,
    title: "Class түзүү",
    description: "Класс түзүү үчүн ачкыч сөз.",
    codeExample: '____ MyClass:',
    correctAnswer: 'class',
    hint: "class сөзүн жазыңыз."
  },
  {
    id: 34,
    title: "Тизмени сорттоо",
    description: "Тизмени иреттөө үчүн кайсы метод колдонулат?",
    codeExample: 'a.____()',
    correctAnswer: 'sort',
    hint: "sort сөзүн жазыңыз."
  },
  {
    id: 35,
    title: "And оператору",
    description: "Эки шарт тең туура болушу керек.",
    codeExample: 'if x > 0 ____ x < 10:',
    correctAnswer: 'and',
    hint: "Жана (and) англисче."
  },
  {
    id: 36,
    title: "Or оператору",
    description: "Бир эле шарт туура болсо жетиштүү.",
    codeExample: 'if x == 1 ____ x == 2:',
    correctAnswer: 'or',
    hint: "Же (or) англисче."
  },
  {
    id: 37,
    title: "Тизмени тазалоо",
    description: "Тизменин ичин бош кылуу.",
    codeExample: 'a.____()',
    correctAnswer: 'clear',
    hint: "clear сөзүн жазыңыз."
  },
  {
    id: 38,
    title: "Файлды ачуу",
    description: "Файл менен иштөө үчүн колдонулуучу функция.",
    codeExample: 'f = ____("file.txt")',
    correctAnswer: 'open',
    hint: "open сөзүн жазыңыз."
  },
  {
    id: 39,
    title: "None",
    description: "Эч нерсе жок деген маани.",
    codeExample: 'x = ____',
    correctAnswer: 'None',
    hint: "None (баш тамга менен)."
  },
  {
    id: 40,
    title: "Финал",
    description: "Python-ду ким ойлоп тапкан? Гвидо ван ____.",
    codeExample: 'Guido van ____',
    correctAnswer: 'Rossum',
    hint: "Rossum."
  }
];