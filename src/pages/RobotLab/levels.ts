export interface Level {
  id: number;
  category: string;
  title: string;
  theory: string;
  task: string;
  targetPos: { x: number; y: number };
  initialCode: string;
}

export const robotLevels: Level[] = [
  // БЛОК 1: НЕГИЗДЕР (1-8) - Алгоритмдик ой жүгүртүү
  {
    id: 1,
    category: "Basics",
    title: "Биринчи кадам",
    theory: "Роботко кыймылдоо үчүн `robot.move(кадам)` буйругу берилет.",
    task: "4 кадам алдыга жүрүңүз.",
    targetPos: { x: 150, y: 50 },
    initialCode: "await robot.move(4);"
  },
  {
    id: 2,
    category: "Basics",
    title: "Оңго бурулуу",
    theory: "`robot.right()` буйругу роботту 90 градуска оңго бурат.",
    task: "2 кадам жүрүп, оңго бурулуп, дагы 2 кадам жүрүңүз.",
    targetPos: { x: 100, y: 100 },
    initialCode: "await robot.move(2);\nawait robot.right();\nawait robot.move(2);"
  },
  { id: 3, category: "Basics", title: "Солго бурулуу", theory: "`robot.left()` - 90 градус солго.", task: "Солго бурулуп 3 кадам жүрүңүз.", targetPos: { x: 50, y: 120 }, initialCode: "" },
  { id: 4, category: "Basics", title: "Артка кайтуу", theory: "180 градуска бурулуу үчүн эки жолу `right()` же `left()` колдонсо болот.", task: "Максатка барып, кайра артка бурулуп келиңиз.", targetPos: { x: 50, y: 50 }, initialCode: "" },
  { id: 5, category: "Basics", title: "Квадрат чийүү", theory: "Квадраттын бардык жактары барабар.", task: "Квадраттык траектория менен жүрүп чык.", targetPos: { x: 50, y: 50 }, initialCode: "" },
  { id: 6, category: "Basics", title: "Зигзаг кыймылы", theory: "Оңго жана солго кезектешип бурулуу.", task: "Зигзаг формасында финишке жет.", targetPos: { x: 200, y: 200 }, initialCode: "" },
  { id: 7, category: "Basics", title: "Диагональ логикасы", theory: "45 градуска бурулуу (эгер функция колдосо).", task: "Эң кыска жол менен финишке бар.", targetPos: { x: 150, y: 150 }, initialCode: "" },
  { id: 8, category: "Basics", title: "Биринчи блокту кайталоо", theory: "Өтүлгөн буйруктарды айкалыштыруу.", task: "Татаал жолду басып өт.", targetPos: { x: 300, y: 100 }, initialCode: "" },

  // БЛОК 2: СЕНСОРЛОР ЖАНА ШАРТТАР (9-16)
  {
    id: 9,
    category: "Sensors",
    title: "Сканер менен таанышуу",
    theory: "`robot.scan()` - максатка чейинки аралыкты кайтарат.",
    task: "Аралыкты логго чыгарыңыз.",
    targetPos: { x: 200, y: 200 },
    initialCode: "const d = robot.scan();\nrobot.log(d);"
  },
  { id: 10, category: "Sensors", title: "Эгер (If) логикасы", theory: "`if (шарт) { ... }` - бул чечим кабыл алуу.", task: "Эгер аралык 10дон чоң болсо, жүр.", targetPos: { x: 250, y: 250 }, initialCode: "" },
  { id: 11, category: "Sensors", title: "Тоскоолдукту айланып өтүү", theory: "Эгер алдыда дубал болсо, бурул.", task: "Дубалга жеткенде оңго бурул.", targetPos: { x: 300, y: 100 }, initialCode: "" },
  { id: 12, category: "Sensors", title: "Кош шарттар", theory: "Эгер аралык өтө жакын болсо токто, алыс болсо жүр.", task: "Аралыкты текшерип аракет кыл.", targetPos: { x: 100, y: 300 }, initialCode: "" },
  { id: 13, category: "Sensors", title: "Түс сенсору", theory: "Түстөрдү таануу логикасы.", task: "Жашыл чекитке чейин басып бар.", targetPos: { x: 200, y: 50 }, initialCode: "" },
  { id: 14, category: "Sensors", title: "Авто-стоп", theory: "Максатка 2 кадам калганда токтоо.", task: "Финишке тийбей токто.", targetPos: { x: 350, y: 350 }, initialCode: "" },
  { id: 15, category: "Sensors", title: "Радар", theory: "Айлананы 360 градуска сканерлөө.", task: "Финиш кайсы тарапта экенин тап.", targetPos: { x: 150, y: 250 }, initialCode: "" },
  { id: 16, category: "Sensors", title: "Логикалык операторлор", theory: "AND (&&) жана OR (||) операторлору.", task: "Эки шарт тең аткарылганда гана жүр.", targetPos: { x: 50, y: 350 }, initialCode: "" },

  // БЛОК 3: ЦИКЛДЕР (17-24)
  {
    id: 17,
    category: "Loops",
    title: "For циклы",
    theory: "`for` - бир эле ишти көп жолу кайталайт.",
    task: "Цикл менен 5 кадам жүр.",
    targetPos: { x: 200, y: 50 },
    initialCode: "for(let i=0; i<5; i++) { await robot.move(1); }"
  },
  { id: 18, category: "Loops", title: "While циклы", theory: "`while` - шарт аткарылганча кайталай берет.", task: "Максатка жеткенче жүрө бер.", targetPos: { x: 300, y: 300 }, initialCode: "" },
  { id: 19, category: "Loops", title: "Тепкич алгоритми", theory: "Цикл ичинде бурулууларды колдонуу.", task: "Тепкич сыяктуу өйдө көтөрүл.", targetPos: { x: 250, y: 250 }, initialCode: "" },
  { id: 20, category: "Loops", title: "Чексиз күзөт", theory: "Робот бир жолду кайталай бериши керек.", task: "Эки чекиттин ортосунда тынбай жүр.", targetPos: { x: 50, y: 50 }, initialCode: "" },
  { id: 21, category: "Loops", title: "Спираль", theory: "Ар бир кадамда аралыкты чоңойтуу.", task: "Спираль формасында кыймылда.", targetPos: { x: 200, y: 200 }, initialCode: "" },
  { id: 22, category: "Loops", title: "Каталарды издөө", theory: "Циклдеги логикалык каталарды табуу.", task: "Бузулган циклди оңдо.", targetPos: { x: 100, y: 100 }, initialCode: "" },
  { id: 23, category: "Loops", title: "Ички циклдер", theory: "Циклдин ичиндеги цикл.", task: "Татаал геометриялык фигура чий.", targetPos: { x: 300, y: 50 }, initialCode: "" },
  { id: 24, category: "Loops", title: "Циклден чыгуу (Break)", theory: "`break` буйругу циклди токтотот.", task: "Максатты көргөндө циклди токтот.", targetPos: { x: 350, y: 150 }, initialCode: "" },

  // БЛОК 4: ЭС ТУТУМ ЖАНА ӨЗГӨРМӨЛӨР (25-32)
  { id: 25, category: "Memory", title: "Өзгөрмөлөр", theory: "Маалыматты сактоо (`let x = 5`).", task: "Кадамдардын санын өзгөрмөгө сакта.", targetPos: { x: 200, y: 200 }, initialCode: "" },
  { id: 26, category: "Memory", title: "Математикалык эсептөө", theory: "Өзгөрмөлөр менен амалдар.", task: "Эки санды кошуп, ошол кадамды жүр.", targetPos: { x: 150, y: 50 }, initialCode: "" },
  { id: 27, category: "Memory", title: "Массивдер", theory: "Тизмелер менен иштөө.", task: "Бир нече багыттарды тизмеге сакта.", targetPos: { x: 250, y: 100 }, initialCode: "" },
  { id: 28, category: "Memory", title: "Жолду эстеп калуу", theory: "Робот баскан жолун жазып алат.", task: "Барган жолуң менен кайра кайт.", targetPos: { x: 50, y: 50 }, initialCode: "" },
  { id: 29, category: "Memory", title: "Объекттер", theory: "Роботтун касиеттерин сактоо.", task: "Роботтун статусун текшер.", targetPos: { x: 300, y: 300 }, initialCode: "" },
  { id: 30, category: "Memory", title: "Маалыматтарды салыштыруу", theory: "Эски жана жаңы аралыкты салыштыруу.", task: "Эң кыска аралыкты эстеп кал.", targetPos: { x: 200, y: 350 }, initialCode: "" },
  { id: 31, category: "Memory", title: "Функциялар", theory: "Өзүңдүн буйругуңду түзүү.", task: "`dance()` деген функция жаз.", targetPos: { x: 100, y: 100 }, initialCode: "" },
  { id: 32, category: "Memory", title: "Параметрлүү функциялар", theory: "Аргументтерди берүү.", task: "Берилген санга жараша жүрүүчү функция жаз.", targetPos: { x: 400, y: 400 }, initialCode: "" },

  // БЛОК 5: ЖОГОРКУ ЛОГИКА (33-40)
  { id: 33, category: "AI", title: "Автономдуу кыймыл", theory: "Робот өзү жол тандайт.", task: "Эч кандай кодсуз финишке жеткиз.", targetPos: { x: 300, y: 50 }, initialCode: "" },
  { id: 34, category: "AI", title: "Лабиринт негиздери", theory: "Оң кол эрежеси.", task: "Дубалды бойлоп жүрүп отур.", targetPos: { x: 350, y: 350 }, initialCode: "" },
  { id: 35, category: "AI", title: "Ылдамдыкты оптималдаштыруу", theory: "Энергияны үнөмдөө.", task: "Минималдуу кадам менен жет.", targetPos: { x: 50, y: 300 }, initialCode: "" },
  { id: 36, category: "AI", title: "Бир нече максат", theory: "Кезек менен баруу.", task: "3 башка чекитке барып чык.", targetPos: { x: 200, y: 200 }, initialCode: "" },
  { id: 37, category: "AI", title: "Динамикалык тоскоолдук", theory: "Кыймылдаган нерселер.", task: "Кагылышуудан кач.", targetPos: { x: 150, y: 150 }, initialCode: "" },
  { id: 38, category: "AI", title: "Карта түзүү", theory: "Айлананы картага түшүрүү.", task: "Бардык бурчтарды сканерле.", targetPos: { x: 100, y: 400 }, initialCode: "" },
  { id: 39, category: "AI", title: "Финалдык тест", theory: "Бардык билимди колдонуу.", task: "Эң татаал жолду басып өт.", targetPos: { x: 400, y: 50 }, initialCode: "" },
  { 
    id: 40, 
    category: "AI", 
    title: "МАГИСТР: РОБОТОТЕХНИК", 
    theory: "Сиз Зайил Ормонов мектебинин эң мыкты программистисиз!", 
    task: "Өзүң каалаган эң татаал алгоритмди жаз жана финишке жет.", 
    targetPos: { x: 350, y: 250 }, 
    initialCode: "// Сиздин автордук кодуңуз..." 
  }
];