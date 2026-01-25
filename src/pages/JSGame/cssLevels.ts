export const cssLevels = [
  // --- БЛОК 1: НЕГИЗДЕР (1-10) ---
  {
    id: 1,
    title: "Тексттин түсү (Color)",
    task: "Текстти кызыл кылыңыз: color: red;",
    explanation: {
      title: "Color касиети",
      points: ["CSS сайтты кооздоо үчүн колдонулат.", "color - бул тексттин түсүн аныктайт.", "Аягына (;) коюуну унутпаңыз."]
    },
    check: (input: string) => /color\s*:\s*red\s*;/.test(input)
  },
  {
    id: 2,
    title: "Фондун түсү (Background)",
    task: "Фонду жашыл кылыңыз: background: green;",
    explanation: {
      title: "Background",
      points: ["Элементтин артындагы түстү өзгөртөт."]
    },
    check: (input: string) => /background\s*:\s*green\s*;/.test(input)
  },
  {
    id: 3,
    title: "Шрифттин өлчөмү",
    task: "Текстти 20 пиксель кылыңыз: font-size: 20px;",
    explanation: { title: "Font Size", points: ["px - бул экрандагы чекиттердин саны."] },
    check: (input: string) => /font-size\s*:\s*20px\s*;/.test(input)
  },
  {
    id: 4,
    title: "Текстти жоон кылуу",
    task: "Жазыңыз: font-weight: bold;",
    explanation: { title: "Font Weight", points: ["Тексттин калыңдыгын жөнгө салат."] },
    check: (input: string) => /font-weight\s*:\s*bold\s*;/.test(input)
  },
  {
    id: 5,
    title: "Тексттин стили",
    task: "Текстти кыйшайтыңыз: font-style: italic;",
    explanation: { title: "Font Style", points: ["Текстти курсив (жантык) кылат."] },
    check: (input: string) => /font-style\s*:\s*italic\s*;/.test(input)
  },
  {
    id: 6,
    title: "Текстти ортолоо",
    task: "Жазыңыз: text-align: center;",
    explanation: { title: "Alignment", points: ["Текстти солго, оңго же ортого түздөйт."] },
    check: (input: string) => /text-align\s*:\s*center\s*;/.test(input)
  },
  {
    id: 7,
    title: "Текстти кооздоо",
    task: "Тексттин астын сызыңыз: text-decoration: underline;",
    explanation: { title: "Decoration", points: ["Астын сызуу же сызыктарды алып салуу үчүн."] },
    check: (input: string) => /text-decoration\s*:\s*underline\s*;/.test(input)
  },
  {
    id: 8,
    title: "Бийиктик (Height)",
    task: "Бийиктикти 100px кылыңыз: height: 100px;",
    explanation: { title: "Height", points: ["Элементтин вертикалдык өлчөмү."] },
    check: (input: string) => /height\s*:\s*100px\s*;/.test(input)
  },
  {
    id: 9,
    title: "Туурасы (Width)",
    task: "Туурасын 200px кылыңыз: width: 200px;",
    explanation: { title: "Width", points: ["Элементтин горизонталдык өлчөмү."] },
    check: (input: string) => /width\s*:\s*200px\s*;/.test(input)
  },
  {
    id: 10,
    title: "Тексттин регистри",
    task: "Баш тамга кылыңыз: text-transform: uppercase;",
    explanation: { title: "Transform", points: ["Текстти толугу менен баш тамгага айлантат."] },
    check: (input: string) => /text-transform\s*:\s*uppercase\s*;/.test(input)
  },

  // --- БЛОК 2: BOX MODEL - СЫРТКЫ ЖАНА ИЧКИ БОШТУКТАР (11-20) ---
  
  {
    id: 11,
    title: "Padding (Ички боштук)",
    task: "Ичинен 10px боштук бериңいです: padding: 10px;",
    explanation: { title: "Padding", points: ["Текст менен рамканын ортосундагы боштук."] },
    check: (input: string) => /padding\s*:\s*10px\s*;/.test(input)
  },
  {
    id: 12,
    title: "Margin (Сырткы боштук)",
    task: "Сырттан 20px боштук бериңиз: margin: 20px;",
    explanation: { title: "Margin", points: ["Башка элементтерден алыстоо үчүн боштук."] },
    check: (input: string) => /margin\s*:\s*20px\s*;/.test(input)
  },
  {
    id: 13,
    title: "Border (Рамка калыңдыгы)",
    task: "Рамка бериңиз: border-width: 2px;",
    explanation: { title: "Border Width", points: ["Сызыктын калыңдыгы."] },
    check: (input: string) => /border-width\s*:\s*2px\s*;/.test(input)
  },
  {
    id: 14,
    title: "Border Style (Түрү)",
    task: "Үзүк сызык кылыңыз: border-style: dashed;",
    explanation: { title: "Border Style", points: ["Түз, үзүк же чекит сызыктар болот."] },
    check: (input: string) => /border-style\s*:\s*dashed\s*;/.test(input)
  },
  {
    id: 15,
    title: "Border Color (Түсү)",
    task: "Рамканы кара кылыңыз: border-color: black;",
    explanation: { title: "Border Color", points: ["Рамканын түсүн белгилейт."] },
    check: (input: string) => /border-color\s*:\s*black\s*;/.test(input)
  },
  {
    id: 16,
    title: "Border Radius (Бурчтар)",
    task: "Бурчтарды тегеректеңиз: border-radius: 10px;",
    explanation: { title: "Border Radius", points: ["Төрт бурчтукту тегеректөө үчүн."] },
    check: (input: string) => /border-radius\s*:\s*10px\s*;/.test(input)
  },
  {
    id: 17,
    title: "Тегерек түзүү",
    task: "Жазыңыз: border-radius: 50%;",
    explanation: { title: "Circle", points: ["Квадратты тегерекке айлантуунун эң тез жолу."] },
    check: (input: string) => /border-radius\s*:\s*50%\s*;/.test(input)
  },
  {
    id: 18,
    title: "Көлөкө (Box Shadow)",
    task: "box-shadow: 5px 5px 10px gray; деп жазыңыз",
    explanation: { title: "Shadow", points: ["Элементке көлөкө кошуп, көлөм берет."] },
    check: (input: string) => /box-shadow\s*:\s*.+?;/.test(input)
  },
  {
    id: 19,
    title: "Көрүнүү (Opacity)",
    task: "Жарым тунук кылыңыз: opacity: 0.5;",
    explanation: { title: "Opacity", points: ["0 - көрүнбөйт, 1 - толук көрүнөт."] },
    check: (input: string) => /opacity\s*:\s*0\.5\s*;/.test(input)
  },
  {
    id: 20,
    title: "Курсор стили",
    task: "Курсорду колго айлантыңыз: cursor: pointer;",
    explanation: { title: "Cursor", points: ["Чычканды багыттаганда курсордун түрүн өзгөртөт."] },
    check: (input: string) => /cursor\s*:\s*pointer\s*;/.test(input)
  },

  // --- БЛОК 3: FLEXBOX ЖАНА ГРИД (21-30) ---
  
  {
    id: 21,
    title: "Flexbox",
    task: "Флекс режимин иштетиңиз: display: flex;",
    explanation: { title: "Flex", points: ["Элементтерди катар тизүү үчүн заманбап жол."] },
    check: (input: string) => /display\s*:\s*flex\s*;/.test(input)
  },
  {
    id: 22,
    title: "Багыт (Flex Direction)",
    task: "Вертикалдуу тизиңиз: flex-direction: column;",
    explanation: { title: "Direction", points: ["Элементтерди сап же колонка түрүндө тизет."] },
    check: (input: string) => /flex-direction\s*:\s*column\s*;/.test(input)
  },
  {
    id: 23,
    title: "Горизонталдык тегиздөө",
    task: "justify-content: center; деп жазыңыз",
    explanation: { title: "Justify", points: ["Флекс элементтерин горизонталдык борборго коёт."] },
    check: (input: string) => /justify-content\s*:\s*center\s*;/.test(input)
  },
  {
    id: 24,
    title: "Вертикалдык тегиздөө",
    task: "align-items: center; деп жазыңыз",
    explanation: { title: "Align", points: ["Элементтерди вертикалдык борборго коёт."] },
    check: (input: string) => /align-items\s*:\s*center\s*;/.test(input)
  },
  {
    id: 25,
    title: "Элементтер арасы (Gap)",
    task: "Арасын ачыңыз: gap: 20px;",
    explanation: { title: "Gap", points: ["Флекс же Грид элементтеринин ортосундагы боштук."] },
    check: (input: string) => /gap\s*:\s*20px\s*;/.test(input)
  },
  {
    id: 26,
    title: "Grid Layout",
    task: "Гридди иштетиңиз: display: grid;",
    explanation: { title: "Grid", points: ["Эки өлчөмдүү (сап жана колонка) торчо түзөт."] },
    check: (input: string) => /display\s*:\s*grid\s*;/.test(input)
  },
  {
    id: 27,
    title: "Grid Columns",
    task: "Эки колонка түзүңүз: grid-template-columns: 1fr 1fr;",
    explanation: { title: "Columns", points: ["fr - бул жеткиликтүү мейкиндиктин бир бөлүгү."] },
    check: (input: string) => /grid-template-columns\s*:.+?;/.test(input)
  },
  {
    id: 28,
    title: "Позиция (Relative)",
    task: "position: relative; деп жазыңыз",
    explanation: { title: "Position", points: ["Элементти өз ордуна салыштырмалуу жылдырууга мүмкүндүк берет."] },
    check: (input: string) => /position\s*:\s*relative\s*;/.test(input)
  },
  {
    id: 29,
    title: "Позиция (Absolute)",
    task: "position: absolute; деп жазыңыз",
    explanation: { title: "Absolute", points: ["Элементти экрандын каалаган жерине так жайгаштырат."] },
    check: (input: string) => /position\s*:\s*absolute\s*;/.test(input)
  },
  {
    id: 30,
    title: "Z-Index",
    task: "Элементти алдыга чыгарыңыз: z-index: 10;",
    explanation: { title: "Z-Index", points: ["Кайсы элемент катмардын үстүндө болоорун чечет."] },
    check: (input: string) => /z-index\s*:\s*\d+\s*;/.test(input)
  },

  // --- БЛОК 4: АНИМАЦИЯ ЖАНА ЭФФЕКТТЕР (31-40) ---
  {
    id: 31,
    title: "Трансформация (Scale)",
    task: "Чоңойтуңуз: transform: scale(1.5);",
    explanation: { title: "Scale", points: ["Элементтин өлчөмүн чоңойтот же кичирейтет."] },
    check: (input: string) => /transform\s*:\s*scale\(.+?\)\s*;/.test(input)
  },
  {
    id: 32,
    title: "Айлантуу (Rotate)",
    task: "45 градуска айлантыңыз: transform: rotate(45deg);",
    explanation: { title: "Rotate", points: ["Элементти огунун айланасында айлантат."] },
    check: (input: string) => /transform\s*:\s*rotate\(.+?\)\s*;/.test(input)
  },
  {
    id: 33,
    title: "Өтүү убактысы (Transition)",
    task: "transition: 0.3s; деп жазыңыз",
    explanation: { title: "Transition", points: ["Өзгөрүүлөрдү жай жана кооз кылат."] },
    check: (input: string) => /transition\s*:\s*.+?s\s*;/.test(input)
  },
  {
    id: 34,
    title: "Background Image",
    task: "background-image: url('bg.jpg');",
    explanation: { title: "BG Image", points: ["Фонго сүрөт коюу."] },
    check: (input: string) => /background-image\s*:\s*url\(.+?\)\s*;/.test(input)
  },
  {
    id: 35,
    title: "Overflow (Жашыруу)",
    task: "overflow: hidden; деп жазыңыз",
    explanation: { title: "Overflow", points: ["Блоктун ичине батпай калган нерсени жашырат."] },
    check: (input: string) => /overflow\s*:\s*hidden\s*;/.test(input)
  },
  {
    id: 36,
    title: "Max-Width",
    task: "max-width: 100%;",
    explanation: { title: "Max-Width", points: ["Элементтин туурасы экрандан ашып кетпеши үчүн."] },
    check: (input: string) => /max-width\s*:\s*100%\s*;/.test(input)
  },
  {
    id: 37,
    title: "Линейкалык градиент",
    task: "background: linear-gradient(red, blue);",
    explanation: { title: "Gradient", points: ["Бир түстүн экинчи түскө жай өтүүсү."] },
    check: (input: string) => /linear-gradient/.test(input)
  },
  {
    id: 38,
    title: "Visibility",
    task: "visibility: hidden; деп жазыңыз",
    explanation: { title: "Visibility", points: ["Элементти көрүнбөй турган кылат, бирок орду калат."] },
    check: (input: string) => /visibility\s*:\s*hidden\s*;/.test(input)
  },
  {
    id: 39,
    title: "Box Sizing",
    task: "box-sizing: border-box;",
    explanation: { title: "Box Sizing", points: ["Боштуктарды элементтин жалпы өлчөмүнө кошот."] },
    check: (input: string) => /box-sizing\s*:\s*border-box\s*;/.test(input)
  },
  {
    id: 40,
    title: "CSS Master",
    task: "Финиш! Жазыңыз: display: block;",
    explanation: { title: "Finish", points: ["Сиз CSSтин 40 негизги сырын өздөштүрдүңүз!"] },
    check: (input: string) => /display\s*:\s*block\s*;/.test(input)
  }
];