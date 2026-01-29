export interface AILevel {
  id: number;
  title: string;
  theory: string; // Жаңы кошулган бөлүм
  description: string;
  codeExample: string;
  correctAnswer: string;
  hint: string;
}

export const aiLevels: AILevel[] = [
  // --- БЛОК 1: КИРИШҮҮ (1-10) ---
  {
    id: 1,
    title: "AI деген эмне?",
    theory: "Жасалма интеллект (Artificial Intelligence же AI) — бул компьютердин адам сыяктуу ойлонуу, үйрөнүү жана чечим кабыл алуу жөндөмү.",
    description: "Жасалма интеллекттин кыскача аталышы кандай?",
    codeExample: "name = '____'",
    correctAnswer: "AI",
    hint: "Баш тамгалар менен жазыңыз."
  },
  {
    id: 2,
    title: "Акылдуу компьютер",
    theory: "AI англис тилинен которгондо 'Artificial Intelligence' деп окулат. Бул кыргызча 'Жасалма Акыл' дегенди билдирет.",
    description: "Intelligence сөзү кыргызча эмнени билдирет?",
    codeExample: "word = '____'",
    correctAnswer: "Акыл",
    hint: "А тамгасынан башталат."
  },
  {
    id: 3,
    title: "Промпт (Prompt)",
    theory: "AIга берилген буйрук же суроо 'Промпт' (Prompt) деп аталат. Сиз канчалык так суроо берсеңиз, ал ошончолук жакшы жооп берет.",
    description: "AIга берилген буйрук эмне деп аталат?",
    codeExample: "command = '____'",
    correctAnswer: "Prompt",
    hint: "P тамгасынан башталат."
  },
  {
    id: 4,
    title: "Маалымат (Data)",
    theory: "AI адам сыяктуу китеп окуп үйрөнбөйт, ал чоң көлөмдөгү маалыматтарды (Data) иштеп чыгуу аркылуу үйрөнөт.",
    description: "AI үйрөнүшү үчүн ага эмне керек?",
    codeExample: "need = '____'",
    correctAnswer: "Data",
    hint: "D тамгасынан башталат."
  },
  {
    id: 5,
    title: "Роботтор",
    theory: "AI бул программа (мээ), ал эми анын физикалык денеси 'Робот' деп аталат. Бардык эле роботтордо AI боло бербейт.",
    description: "AIнын физикалык денеси эмне деп аталат?",
    codeExample: "body = '____'",
    correctAnswer: "Robot",
    hint: "Р тамгасынан башталат."
  },
  {
    id: 6,
    title: "Сүрөт тарттыруу",
    theory: "AI текстти эле эмес, сүрөттөрдү да жарата алат. Ал үчүн 'Draw' (Тартуу) буйругун колдонуу керек.",
    description: "Сүрөт тарттыруу үчүн кайсы англисче буйрукту беребиз?",
    codeExample: "____ a cat",
    correctAnswer: "Draw",
    hint: "D тамгасынан башталат."
  },
  {
    id: 7,
    title: "ChatGPT",
    theory: "ChatGPT — бул OpenAI тарабынан жасалган, дүйнөдөгү эң акылдуу тексттик AI моделдеринин бири.",
    description: "Эң белгилүү тексттик AI программасы кайсы?",
    codeExample: "app = '____'",
    correctAnswer: "ChatGPT",
    hint: "C тамгасынан башталат."
  },
  {
    id: 8,
    title: "Алгачкы кадам",
    theory: "AI менен баарлашуу кадимки адам менен сүйлөшкөндөй эле башталат. Этика үчүн саламдашуу маанилүү.",
    description: "AIга англисче салам бериңиз:",
    codeExample: "print('____')",
    correctAnswer: "Hello",
    hint: "H тамгасынан башталат."
  },
  {
    id: 9,
    title: "Үн жардамчысы",
    theory: "Siri, Alexa жана Google Assistant — булар үн аркылуу иштеген AI жардамчылары. Алар сиздин үнүңүздү текстке айлантып түшүнүшөт.",
    description: "iPhone'догу AI жардамчынын аты ким?",
    codeExample: "assistant = '____'",
    correctAnswer: "Siri",
    hint: "S тамгасынан башталат."
  },
  {
    id: 10,
    title: "Логика",
    theory: "AIдын адамдан айырмасы — ал миллиондогон маалыматты бир секундда талдап, чечим чыгара (Think) алат.",
    description: "AI адамдан тезирээк эмне кылат?",
    codeExample: "action = '____'",
    correctAnswer: "Think",
    hint: "Ойлонуу (анг. Think)."
  },

  // --- БЛОК 2: МАШИНАЛЫК ҮЙРӨТҮҮ (11-20) ---
  {
    id: 11,
    title: "Machine Learning",
    theory: "Машиналык үйрөтүү (Machine Learning) — бул AIдын тажрыйба аркылуу өзүн-өзү өркүндөтүү процесси.",
    description: "Өз алдынча үйрөнүү процесси кандай аталат?",
    codeExample: "type = 'Machine ____'",
    correctAnswer: "Learning",
    hint: "Үйрөнүү (Learning)."
  },
  {
    id: 12,
    title: "Үлгүлөр (Patterns)",
    theory: "Компьютер маалыматтарды карап жатып, кайталанган окшоштуктарды же 'Patterns' (үлгүлөрдү) таап алат.",
    description: "AI маалыматтан эмнени табат?",
    codeExample: "find = '____'",
    correctAnswer: "Patterns",
    hint: "P тамгасынан башталат."
  },
  {
    id: 13,
    title: "Нейрондук тармак",
    theory: "Нейрондук тармак (Neural Network) — бул адамдын мээсиндеги клеткалардын иштөө принцибине окшоштуруп жасалган математикалык модель.",
    description: "Мээге окшош AI түзүмү кандай аталат?",
    codeExample: "____ Network",
    correctAnswer: "Neural",
    hint: "N тамгасынан башталат."
  },
  {
    id: 14,
    title: "Алгоритм",
    theory: "Алгоритм — бул AI маселени чечүү үчүн аткара турган кадамдардын тизмеги.",
    description: "Кадам-кадам көрсөтмө эмне деп аталат?",
    codeExample: "steps = '____'",
    correctAnswer: "Algorithm",
    hint: "A тамгасынан башталат."
  },
  {
    id: 15,
    title: "Модель",
    theory: "Үйрөтүлүп бүткөн жана иштөөгө даяр турган AI программасын 'Модель' деп аташат.",
    description: "Даяр AI программасы кандай аталат?",
    codeExample: "ai = '____'",
    correctAnswer: "Model",
    hint: "М тамгасынан башталат."
  },
  {
    id: 16,
    title: "Жыйынтык (Output)",
    theory: "Сиз суроо бергенде, AI иштеп чыгып берген жооп 'Output' (Жыйынтык) деп аталат.",
    description: "AI берген жоопту эмне дейбиз?",
    codeExample: "answer = '____'",
    correctAnswer: "Output",
    hint: "O тамгасынан башталат."
  },
  {
    id: 17,
    title: "Киргизүү (Input)",
    theory: "Сиз AIга берген ар кандай маалымат (текст, сүрөт, үн) 'Input' деп аталат.",
    description: "AIга берилген маалымат эмне деп аталат?",
    codeExample: "data = '____'",
    correctAnswer: "Input",
    hint: "I тамгасынан башталат."
  },
  {
    id: 18,
    title: "Божомол (Prediction)",
    theory: "AI өткөн маалыматка таянып, келечекте эмне болорун 'Prediction' (божомол) кыла алат.",
    description: "Алдын ала айтуу процесси кандай аталат?",
    codeExample: "guess = '____'",
    correctAnswer: "Prediction",
    hint: "P тамгасынан башталат."
  },
  {
    id: 19,
    title: "Ката (Error)",
    theory: "AI дагы жаңылышат. Эгер ал туура эмес маалыматтан үйрөнсө, жыйынтыгында 'Error' (ката) кетирет.",
    description: "Туура эмес жыйынтык эмне деп аталат?",
    codeExample: "result = '____'",
    correctAnswer: "Error",
    hint: "E тамгасынан башталат."
  },
  {
    id: 20,
    title: "Текст таануу",
    theory: "AI адамдын колу менен жазылган же сүрөттөгү текстти тааный алат. Бул 'Recognition' деп аталат.",
    description: "Текстти таануу: Text ____.",
    codeExample: "type = '____'",
    correctAnswer: "Recognition",
    hint: "R тамгасынан башталат."
  },

  // --- БЛОК 3: ПРОМПТ ИНЖЕНЕРИЯСЫ (21-30) ---
  {
    id: 21,
    title: "Тактык (Clear)",
    theory: "Жакшы жооп алуу үчүн промпт өтө так жана түшүнүктүү (Clear) болушу керек.",
    description: "Промпт кандай болушу керек?",
    codeExample: "prompt = '____'",
    correctAnswer: "Clear",
    hint: "C тамгасынан башталат."
  },
  {
    id: 22,
    title: "Контекст",
    theory: "AIга тапшырма бергенде кошумча маалымат (контекст) кошуу анын сапатын жакшыртат.",
    description: "Кошумча маалымат берүү: Give ____.",
    codeExample: "add = '____'",
    correctAnswer: "Context",
    hint: "C тамгасынан башталат."
  },
  {
    id: 23,
    title: "Роль берүү",
    theory: "AIга белгилүү бир адамдын ролун (мисалы, 'Сен мугалимсиң') берсеңиз, ал ошол адамдай жооп бере баштайт.",
    description: "AIга эмне берсек болот?",
    codeExample: "set = '____'",
    correctAnswer: "Role",
    hint: "Р тамгасынан башталат."
  },
  {
    id: 24,
    title: "Сүрөт стили",
    theory: "AIга сүрөт тарттырганда 'Oil' (май боёк), 'Anime' же 'Cyberpunk' сыяктуу стилдерди кошсо болот.",
    description: "Май боёк стили англисче кандай болот?",
    codeExample: "style = '____'",
    correctAnswer: "Oil",
    hint: "О тамгасынан башталат."
  },
  {
    id: 25,
    title: "Терс промпт",
    theory: "Эгер сүрөттө кайсы бир нерсенин болушун каалабасаңыз, аны 'Negative prompt' бөлүмүнө жазасыз.",
    description: "Керек эмес нерселерди кайсы промптко жазабыз?",
    codeExample: "____ prompt",
    correctAnswer: "Negative",
    hint: "N тамгасынан башталат."
  },
  {
    id: 26,
    title: "Тилдер",
    theory: "AI дээрлик бардык дүйнөлүк тилдерди (Languages) билет жана алардын ортосунда котормо жасай алат.",
    description: "AI эмнелерди билет?",
    codeExample: "knows = '____'",
    correctAnswer: "Languages",
    hint: "L тамгасынан башталат."
  },
  {
    id: 27,
    title: "Котормочу",
    theory: "AI текстти бир тилден экинчисине заматта которо (Translate) алат.",
    description: "Которуу буйругу кандай болот?",
    codeExample: "____ to Kyrgyz",
    correctAnswer: "Translate",
    hint: "T тамгасынан башталат."
  },
  {
    id: 28,
    title: "Кыскартуу",
    theory: "Узун текстти маанисин жоготпостон кыскартуу процесси 'Summarize' деп аталат.",
    description: "Текстти кыскартуу буйругу:",
    codeExample: "____ the text",
    correctAnswer: "Summarize",
    hint: "S тамгасынан башталат."
  },
  {
    id: 29,
    title: "Идеялар",
    theory: "AI сизге жаңы идеяларды ойлоп табууга (Brainstorm) чоң жардам берет.",
    description: "Мээ чабуулу англисче кандай болот?",
    codeExample: "____ session",
    correctAnswer: "Brainstorm",
    hint: "B тамгасынан башталат."
  },
  {
    id: 30,
    title: "Код жазуу",
    theory: "AI программалоо тилдерин да билет жана катасыз код (Code) жаза алат.",
    description: "AI эмне жаза алат?",
    codeExample: "write = '____'",
    correctAnswer: "Code",
    hint: "C тамгасынан башталат."
  },

  // --- БЛОК 4: ЭТИКА ЖАНА КЕЛЕЧЕК (31-40) ---
  {
    id: 31,
    title: "Этика (Ethics)",
    theory: "AI этикасы — бул жасалма интеллектти адамдарга зыян келтирбей тургандай колдонуу эрежелери.",
    description: "AI колдонуу эрежелери эмне деп аталат?",
    codeExample: "rules = '____'",
    correctAnswer: "Ethics",
    hint: "E тамгасынан башталат."
  },
  {
    id: 32,
    title: "Коопсуздук",
    theory: "AI эч качан адамдарга зыян (Harm) келтирбеши керек. Бул эң башкы мыйзам.",
    description: "AI эмне кылбашы керек?",
    codeExample: "no = '____'",
    correctAnswer: "Harm",
    hint: "H тамгасынан башталат."
  },
  {
    id: 33,
    title: "Чындык (Check)",
    theory: "AI кээде туура эмес маалыматты ишенимдүү айтып коюшу мүмкүн (Галлюцинация). Ошондуктан аны дайыма текшерүү (Check) керек.",
    description: "AIдын жообун эмне кылуу керек?",
    codeExample: "must = '____'",
    correctAnswer: "Check",
    hint: "C тамгасынан башталат."
  },
  {
    id: 34,
    title: "Автордук укук",
    theory: "AI тарабынан жаратылган эмгектер кимге таандык экени автордук укук (Copyright) мыйзамдары менен жөнгө салынат.",
    description: "Укуктардын аталышы:",
    codeExample: "____ laws",
    correctAnswer: "Copyright",
    hint: "C тамгасынан башталат."
  },
  {
    id: 35,
    title: "Жеке маалымат",
    theory: "AIга өзүңдүн жеке маалыматтарыңды (Private data), мисалы пароль же дарегиңди айтуу кооптуу.",
    description: "Кандай маалыматты айтпоо керек?",
    codeExample: "____ data",
    correctAnswer: "Private",
    hint: "P тамгасынан башталат."
  },
  {
    id: 36,
    title: "Жардамчы",
    theory: "AI адамды алмаштыруу үчүн эмес, ага жардамчы (Helper) болуу үчүн түзүлгөн.",
    description: "AI адамга ким болот?",
    codeExample: "ai_is = '____'",
    correctAnswer: "Helper",
    hint: "H тамгасынан башталат."
  },
  {
    id: 37,
    title: "Автопилот",
    theory: "Өзү жүрүүчү машиналар AIны колдонуу менен жолду таанып, машинаны башкара алышат. Бул 'Autopilot' деп аталат.",
    description: "Өзү башкаруу системасы:",
    codeExample: "mode = '____'",
    correctAnswer: "Autopilot",
    hint: "A тамгасынан башталат."
  },
  {
    id: 38,
    title: "Чыгармачылык",
    theory: "AI ыр жазып, музыка жарата алат. Демек ал чыгармачыл (Creative) боло алат.",
    description: "AI кандай боло алат?",
    codeExample: "is = '____'",
    correctAnswer: "Creative",
    hint: "C тамгасынан башталат."
  },
  {
    id: 39,
    title: "Келечек",
    theory: "Келечекте AI жашоонун бардык тармагында: медицинада, билим берүүдө жана космосто болот.",
    description: "AI качан бардык жерде болот?",
    codeExample: "time = '____'",
    correctAnswer: "Келечекте",
    hint: "К тамгасынан башталат."
  },
  {
    id: 40,
    title: "Аяктоо",
    theory: "Сиз AI негиздерин толук окуп бүттүңүз! Эми сиз келечектин технологиясын түшүнөсүз.",
    description: "Курсту аяктоо үчүн жазыңыз:",
    codeExample: "status = '____'",
    correctAnswer: "Finish",
    hint: "F тамгасынан башталат."
  }
];