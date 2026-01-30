export interface GamedevLevel {
  id: number;
  title: string;
  theory: string;
  description: string;
  codeExample: string;
  correctAnswer: string;
  hint: string;
}

export const gamedevLevels: GamedevLevel[] = [
  // --- 1-БӨЛҮМ: НЕГИЗДЕР ---
  {
    id: 1,
    title: "Координаттар системасы",
    theory: "Оюн дүйнөсүндө каармандар X (оң-сол) жана Y (өйдө-төмөн) октору боюнча жылышат. Өйдө секирүү үчүн Y огу колдонулат.",
    description: "Каарманды өйдө секиртүү үчүн кайсы окту колдонобуз?",
    codeExample: "jump_axis = '____'",
    correctAnswer: "Y",
    hint: "Вертикалдык октун аталышы."
  },
  {
    id: 2,
    title: "FPS түшүнүгү",
    theory: "FPS (Frames Per Second) — бир секунддагы кадрлардын саны. Ал оюндун канчалык жылмакай иштешин аныктайт.",
    description: "Секундуна канча кадр алмашарын көрсөткөн термин?",
    codeExample: "game_speed = '____'",
    correctAnswer: "FPS",
    hint: "Frames Per Second кыскартмасы."
  },
  {
    id: 3,
    title: "Спрайттар",
    theory: "Оюндагы бардык 2D сүрөттөр (каарман, душман, буюм) 'Sprite' деп аталат.",
    description: "Оюндагы каармандын сүрөтүн эмне дейбиз?",
    codeExample: "hero = '____'",
    correctAnswer: "Sprite",
    hint: "S тамгасынан башталат."
  },
  {
    id: 4,
    title: "Кагылышуу (Collision)",
    theory: "Эки объект бири-бирине тийген учур 'Collision' деп аталат. Бул дубалды же тыйынды сезүү үчүн керек.",
    description: "Объекттердин тийип калуусу эмне деп аталат?",
    codeExample: "is_hit = '____'",
    correctAnswer: "Collision",
    hint: "C тамгасынан башталат."
  },
  {
    id: 5,
    title: "Гравитация",
    theory: "Каарман секиргенден кийин кайра жерге түшүшү үчүн оюнга жасалма тартылуу күчүн же Гравитацияны кошобуз.",
    description: "Жерге тартуу күчү эмне деп аталат?",
    codeExample: "world_force = '____'",
    correctAnswer: "Gravity",
    hint: "Англисче 'Gravity' деп жазыңыз."
  },
  {
    id: 6,
    title: "Оюн цикли (Loop)",
    theory: "Оюн тынымсыз жаңыланып турушу үчүн колдонулган чексиз цикл 'Game Loop' деп аталат.",
    description: "Оюндун негизги кайталануучу циклин эмне дейбиз?",
    codeExample: "while (____): update_game()",
    correctAnswer: "True",
    hint: "Цикл чексиз болушу үчүн кандай маани беребиз?"
  },
  {
    id: 7,
    title: "Каармандын абалы",
    theory: "Каарман чуркап жатабы же секирип жатабы — бул анын 'State' (абалы) деп аталат.",
    description: "Каармандын учурдагы абалын билдирүүчү сөз?",
    codeExample: "current_____ = 'running'",
    correctAnswer: "state",
    hint: "Англисче 'State' (Абал)."
  },
  {
    id: 8,
    title: "Окуялар (Events)",
    theory: "Баскычты басуу же чычканды чыкылдатуу 'Event' (Окуя) деп аталат.",
    description: "Оюнчу тарабынан жасалган аракет эмне деп аталат?",
    codeExample: "on_key_press = '____'",
    correctAnswer: "Event",
    hint: "E тамгасынан башталат."
  },
  {
    id: 9,
    title: "Триггер (Trigger)",
    theory: "Каарман белгилүү бир зонага киргенде окуяны иштеткен курал 'Trigger' деп аталат.",
    description: "Окуяны иштетүүчү 'аткыч' же зона?",
    codeExample: "zone_type = '____'",
    correctAnswer: "Trigger",
    hint: "T тамгасынан башталат."
  },
  {
    id: 10,
    title: "Префаб (Prefab)",
    theory: "Бир жолу жасалып, оюндун ар кайсы жеринде көп колдонулган даяр объект (мисалы, бактар) 'Prefab' деп аталат.",
    description: "Даяр шаблондук объектти эмне дейбиз?",
    codeExample: "object_template = '____'",
    correctAnswer: "Prefab",
    hint: "P тамгасынан башталат."
  },

  // --- 2-БӨЛҮМ: ОЮН ЛОГИКАСЫ ---
  {
    id: 11,
    title: "Ден соолук (HP)",
    theory: "Каармандын жашоо деңгээли адатта HP (Health Points) деп белгиленет.",
    description: "Жашоо упайларынын кыскача аталышы?",
    codeExample: "player_____ = 100",
    correctAnswer: "HP",
    hint: "Эки тамга."
  },
  {
    id: 12,
    title: "Инвентарь",
    theory: "Оюнчу чогулткан буюмдар сакталган жер 'Inventory' деп аталат.",
    description: "Буюмдардын баштыгы:",
    codeExample: "items_list = '____'",
    correctAnswer: "Inventory",
    hint: "I тамгасынан башталат."
  },
  {
    id: 13,
    title: "Душман AI",
    theory: "Душмандардын өз алдынча жүрүм-туруму 'NPC AI' аркылуу башкарылат.",
    description: "Оюнчу эмес каармандарды эмне дейбиз?",
    codeExample: "bot_type = '____'",
    correctAnswer: "NPC",
    hint: "Non-Player Character кыскартмасы."
  },
  {
    id: 14,
    title: "Параллакс (Parallax)",
    theory: "Арткы фондун жай жылышы аркылуу тереңдик түзүү эффекти 'Parallax' деп аталат.",
    description: "Фондун эффекти кандай аталат?",
    codeExample: "background_style = '____'",
    correctAnswer: "Parallax",
    hint: "P тамгасынан башталат."
  },
  {
    id: 15,
    title: "Spawn (Пайда болуу)",
    theory: "Объекттин оюн дүйнөсүндө пайда болуу процесси 'Spawn' деп аталат.",
    description: "Жаңы душмандын пайда болушу:",
    codeExample: "enemy_____()",
    correctAnswer: "spawn",
    hint: "S тамгасынан башталат."
  },
  {
    id: 16,
    title: "Упай (Score)",
    theory: "Оюнчу тыйын чогултканда анын 'Score' (Упайы) көбөйөт.",
    description: "Оюндагы упай англисче кандай болот?",
    codeExample: "player_____ += 10",
    correctAnswer: "Score",
    hint: "S тамгасынан башталат."
  },
  {
    id: 17,
    title: "Анимация",
    theory: "Бир нече сүрөттүн тез алмашуусунан 'Animation' пайда болот.",
    description: "Каармандын кыймыл эффекти:",
    codeExample: "play_____('walk')",
    correctAnswer: "animation",
    hint: "А тамгасынан башталат."
  },
  {
    id: 18,
    title: "Үн эффекттери (SFX)",
    theory: "Секирүү же атуу учурундагы кыска үндөр 'SFX' деп аталат.",
    description: "Үн эффекттеринин кыскача аталышы:",
    codeExample: "play_____('jump_sound')",
    correctAnswer: "SFX",
    hint: "Sound Effects кыскартмасы."
  },
  {
    id: 19,
    title: "Деңгээл (Level)",
    theory: "Оюндун бир баскычы 'Level' же 'Scene' деп аталат.",
    description: "Оюндун кийинки бөлүгүнө өтүү:",
    codeExample: "load_next_____()",
    correctAnswer: "level",
    hint: "L тамгасынан башталат."
  },
  {
    id: 20,
    title: "Чек ара (Bounds)",
    theory: "Каарман оюн талаасынан чыгып кетпеши үчүн 'Bounds' (Чек ара) коюлат.",
    description: "Оюн талаасынын чеги:",
    codeExample: "map_____ = [0, 1000]",
    correctAnswer: "bounds",
    hint: "B тамгасынан башталат."
  },

  // --- 3-БӨЛҮМ: ТАТААЛ ТҮШҮНҮКТӨР ---
  {
    id: 21,
    title: "Рэйкаст (Raycast)",
    theory: "Объекттин алдында эмне бар экенин билүү үчүн көрүнбөгөн нур жиберүү 'Raycast' деп аталат.",
    description: "Лазердик нур менен текшерүү:",
    codeExample: "is_grounded = ____()",
    correctAnswer: "raycast",
    hint: "R тамгасынан башталат."
  },
  {
    id: 22,
    title: "Камера (Follow)",
    theory: "Камера каармандын артынан ээрчип жүрүшү керек. Бул 'Camera Follow' деп аталат.",
    description: "Камеранын каарманды ээрчүүсү:",
    codeExample: "camera.____(player)",
    correctAnswer: "follow",
    hint: "F тамгасынан башталат."
  },
  {
    id: 23,
    title: "Масштаб (Scale)",
    theory: "Объекттин көлөмүн чоңойтуу же кичирейтүү 'Scale' деп аталат.",
    description: "Объекттин өлчөмүн өзгөртүү:",
    codeExample: "object.____ = 2.0",
    correctAnswer: "scale",
    hint: "S тамгасынан башталат."
  },
  {
    id: 24,
    title: "Айлануу (Rotation)",
    theory: "Объектти өз огунда буруу 'Rotation' деп аталат.",
    description: "Объектти 90 градуска буруу:",
    codeExample: "object.____ = 90",
    correctAnswer: "rotation",
    hint: "R тамгасынан башталат."
  },
  {
    id: 25,
    title: "Таймер (Timer)",
    theory: "Оюндун убактысын чектөө үчүн 'Timer' колдонулат.",
    description: "Убакыт өлчөгүч курал:",
    codeExample: "start_____(60)",
    correctAnswer: "timer",
    hint: "T тамгасынан башталат."
  },
  {
    id: 26,
    title: "UI (Интерфейс)",
    theory: "Экрандагы упайлар, баскычтар жана меню 'UI' (User Interface) деп аталат.",
    description: "Колдонуучунун интерфейси:",
    codeExample: "show______layer()",
    correctAnswer: "UI",
    hint: "Эки тамга."
  },
  {
    id: 27,
    title: "Боттордун жолу (Pathfinding)",
    theory: "Душмандын оюнчуга баруучу жолду табышы 'Pathfinding' деп аталат.",
    description: "Жол издөө алгоритми:",
    codeExample: "ai_____ = 'A*'",
    correctAnswer: "pathfinding",
    hint: "P тамгасынан башталат."
  },
  {
    id: 28,
    title: "Вектор (Vector)",
    theory: "Оюндагы багыт жана аралык 'Vector' аркылуу берилет (мисалы, Vector2 же Vector3).",
    description: "Багытты билдирүүчү математикалык чоңдук:",
    codeExample: "direction = ____2(1, 0)",
    correctAnswer: "Vector",
    hint: "V тамгасынан башталат."
  },
  {
    id: 29,
    title: "Заряд (Cooldown)",
    theory: "Аткандан кийин кийинки атууга чейинки күтүү убактысы 'Cooldown' деп аталат.",
    description: "Кайра заряддалуу убактысы:",
    codeExample: "weapon_____ = 2.0",
    correctAnswer: "cooldown",
    hint: "C тамгасынан башталат."
  },
  {
    id: 30,
    title: "Визуалдык эффекттер (VFX)",
    theory: "Жарылуу же учкундар сыяктуу кооз эффекттер 'VFX' деп аталат.",
    description: "Визуалдык эффекттердин кыскача аты:",
    codeExample: "spawn_____('explosion')",
    correctAnswer: "VFX",
    hint: "Visual Effects кыскартмасы."
  },

  // --- 4-БӨЛҮМ: ФИНАЛГА КАДАМ ---
  {
    id: 31,
    title: "Шейдерлер (Shaders)",
    theory: "Суунун толкуну же оттун кыймылы сыяктуу графикалык эффекттер 'Shaders' аркылуу жасалат.",
    description: "Графикалык программалар:",
    codeExample: "apply_____('water')",
    correctAnswer: "shader",
    hint: "S тамгасынан башталат."
  },
  {
    id: 32,
    title: "Оюн кыймылдаткычы (Engine)",
    theory: "Оюн жасоо үчүн колдонулган программа (мисалы, Unity, Unreal) 'Engine' деп аталат.",
    description: "Оюндун 'мотору' эмне?",
    codeExample: "game_____ = 'Unity'",
    correctAnswer: "engine",
    hint: "E тамгасынан башталат."
  },
  {
    id: 33,
    title: "Кадрлар (Frames)",
    theory: "Оюндагы ар бир өзүнчө сүрөт 'Frame' (кадр) деп аталат.",
    description: "Бир даана сүрөт:",
    codeExample: "current_____ = 1",
    correctAnswer: "frame",
    hint: "F тамгасынан башталат."
  },
  {
    id: 34,
    title: "Булактар (Assets)",
    theory: "Оюнга керектүү бардык файлдар (сүрөт, үн, модель) 'Assets' деп аталат.",
    description: "Оюндун ресурстары:",
    codeExample: "folder = '____'",
    correctAnswer: "assets",
    hint: "A тамгасынан башталат."
  },
  {
    id: 35,
    title: "Скрипт (Script)",
    theory: "Оюндун эрежелерин жазган коддор 'Script' деп аталат.",
    description: "Оюндун коду:",
    codeExample: "logic_____ = 'player.js'",
    correctAnswer: "script",
    hint: "S тамгасынан башталат."
  },
  {
    id: 36,
    title: "Тестирлөө (QA)",
    theory: "Оюнду каталарга текшерүү процесси 'Testing' же 'QA' деп аталат.",
    description: "Каталарды издөө:",
    codeExample: "status = '____'",
    correctAnswer: "testing",
    hint: "T тамгасынан башталат."
  },
  {
    id: 37,
    title: "Баг (Bug)",
    theory: "Оюндагы каталар 'Bug' (коңуз) деп аталат.",
    description: "Программалык ката:",
    codeExample: "fix_____ = True",
    correctAnswer: "bug",
    hint: "B тамгасынан башталат."
  },
  {
    id: 38,
    title: "Билд (Build)",
    theory: "Оюнду даяр файлга айлантуу (мисалы, .exe) 'Build' деп аталат.",
    description: "Оюндун даяр версиясын чогултуу:",
    codeExample: "make_____()",
    correctAnswer: "build",
    hint: "B тамгасынан башталат."
  },
  {
    id: 39,
    title: "Чыгаруу (Release)",
    theory: "Оюнду оюнчуларга сунуу 'Release' же 'Publish' деп аталат.",
    description: "Оюнду жарыкка чыгаруу:",
    codeExample: "status = '____'",
    correctAnswer: "release",
    hint: "R тамгасынан башталат."
  },
  {
    id: 40,
    title: "Оюн иштеп чыгуучу",
    theory: "Сиз эми чыныгы Оюн иштеп чыгуучу (Game Developer) болууга даярсыз!",
    description: "Курсту аяктоо үчүн жазыңыз:",
    codeExample: "finish_course = '____'",
    correctAnswer: "developer",
    hint: "D тамгасынан башталат."
  }
];