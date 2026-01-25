export interface Level {
  id: number;
  title: string;
  task: string;
  explanation: {
    title: string;
    points: string[];
  };
  check: (input: string) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStats?: (input: string, setHeroName: any, setHeroAge: any) => void;
}

export const levels: Level[] = [
  // --- 1-БЛОК: ӨЗГӨРТМӨЛӨР ЖАНА ТИПТЕР (1-10) ---
  {
    id: 1,
    title: "Variables (let)",
    task: "Каарманга ат бериңиз. Жазыңыз: let name = \"Баатыр\";",
    explanation: {
      title: "Өзгөртмө деген эмне?",
      points: ["let - жаңы маалымат сактоочу кутуча түзөт.", "name - кутучанын аты.", "\"Баатыр\" - тексттик маалымат."]
    },
    check: (input) => /let\s+name\s*=\s*["'](.+?)["']\s*;/.test(input),
    updateStats: (input, setHeroName) => {
      const match = input.match(/let\s+name\s*=\s*["'](.+?)["']\s*;/);
      if (match) setHeroName(match[1]);
    }
  },
  {
    id: 2,
    title: "Numbers",
    task: "Жашыңызды сан менен жазыңыз: let age = 15;",
    explanation: {
      title: "Сандар",
      points: ["Сандар тырмакчасыз жазылат.", "Алар менен математикалык амалдарды аткарууга болот."]
    },
    check: (input) => /let\s+age\s*=\s*\d+\s*;/.test(input),
    updateStats: (input, _, setHeroAge) => {
      const match = input.match(/let\s+age\s*=\s*(\d+)\s*;/);
      if (match) setHeroAge(match[1]);
    }
  },
  {
    id: 3,
    title: "Constants (const)",
    task: "Өзгөрбөй турган маанини жазыңыз: const planet = \"Жер\";",
    explanation: {
      title: "Туруктуулар",
      points: ["const - мааниси эч качан өзгөрбөй турган өзгөртмө."]
    },
    check: (input) => /const\s+planet\s*=\s*["'].+?["']\s*;/.test(input)
  },
  {
    id: 4,
    title: "Booleans",
    task: "Оюн башталганын белгилеңиз: let start = true;",
    explanation: {
      title: "Логикалык тип",
      points: ["Boolean болгону эки маанини алат: true же false."]
    },
    check: (input) => /let\s+start\s*=\s*(true|false)\s*;/.test(input)
  },
  {
    id: 5,
    title: "String Concatenation",
    task: "Тексттерди кошуңуз: let greeting = \"Hi \" + \"Hero\";",
    explanation: {
      title: "Тексттерди бириктирүү",
      points: ["(+) белгиси тексттерди бири-бирине жабыштырат."]
    },
    check: (input) => /let\s+greeting\s*=\s*["'].+?["']\s*\+\s*["'].+?["']\s*;/.test(input)
  },
  {
    id: 6,
    title: "Template Literals",
    task: "Бэк-тик менен текст жазыңыз: let msg = `Hello`;",
    explanation: {
      title: "Заманбап тексттер",
      points: ["(` `) белгиси тексттин ичине өзгөртмөлөрдү оңой кошууга мүмкүндүк берет."]
    },
    check: (input) => /let\s+msg\s*=\s*`.+?`\s*;/.test(input)
  },
  {
    id: 7,
    title: "Basic Math (+)",
    task: "Эки санды кошуңуз: let sum = 10 + 5;",
    explanation: {
      title: "Кошуу",
      points: ["JS математикалык эсептөөлөрдү секундасына миллиондогон ирет аткара алат."]
    },
    check: (input) => /let\s+sum\s*=\s*\d+\s*\+\s*\d+\s*;/.test(input)
  },
  {
    id: 8,
    title: "Multiplication (*)",
    task: "Көбөйтүүнү жазыңыз: let area = 5 * 5;",
    explanation: {
      title: "Көбөйтүү",
      points: ["(*) - жылдызча программалоодо көбөйтүү белгиси."]
    },
    check: (input) => /let\s+area\s*=\s*\d+\s*\*\s*\d+\s*;/.test(input)
  },
  {
    id: 9,
    title: "Division (/)",
    task: "Бөлүүнү жазыңыз: let result = 20 / 4;",
    explanation: {
      title: "Бөлүү",
      points: ["(/) - белгиси бөлүүнү билдирет."]
    },
    check: (input) => /let\s+result\s*=\s*\d+\s*\/\s*\d+\s*;/.test(input)
  },
  {
    id: 10,
    title: "Comments",
    task: "Комментарий жазыңыз: // Бул код",
    explanation: {
      title: "Комментарийлер",
      points: ["// - бул белгиден кийинки текстти компьютер окубайт, ал адамдар үчүн."]
    },
    check: (input) => /\/\/\s*.+/.test(input)
  },

  // --- 2-БЛОК: ШАРТТАР ЖАНА ЛОГИКА (11-20) ---
  {
    id: 11,
    title: "If Statement",
    task: "Шарт жазыңыз: if (true) { alert(\"Ok\"); }",
    explanation: {
      title: "Эгерде...",
      points: ["if - шарт туура болсо гана блоктун ичиндеги кодду иштетет."]
    },
    check: (input) => /if\s*\(.+?\)\s*\{\s*alert\(.+?\)\s*;\s*\}/.test(input)
  },
  {
    id: 12,
    title: "Comparison (==)",
    task: "Теңдикти текшериңиз: let test = 5 == 5;",
    explanation: {
      title: "Теңби?",
      points: ["(==) - эки маанини бири-бирине салыштырат."]
    },
    check: (input) => /let\s+test\s*=\s*\d+\s*==\s*\d+\s*;/.test(input)
  },
  {
    id: 13,
    title: "Strict Equality (===)",
    task: "Так теңдикти жазыңыз: 10 === 10;",
    explanation: {
      title: "Тактык",
      points: ["(===) - маанисин гана эмес, анын тибин да текшерет."]
    },
    check: (input) => /\d+\s*===\s*\d+/.test(input)
  },
  {
    id: 14,
    title: "Logical AND (&&)",
    task: "Эки шартты тең текшериңиз: true && true;",
    explanation: {
      title: "Жана",
      points: ["(&&) - эки шарт тең туура болсо гана 'true' кайтарат."]
    },
    check: (input) => /.+?\s*&&\s*.+?/.test(input)
  },
  {
    id: 15,
    title: "Logical OR (||)",
    task: "Бирөөсү эле туура болсун: true || false;",
    explanation: {
      title: "Же болбосо",
      points: ["(||) - эң аз дегенде бирөөсү туура болсо жетиштүү."]
    },
    check: (input) => /.+?\s*\|\|\s*.+?/.test(input)
  },
  {
    id: 16,
    title: "Else",
    task: "Болбосо деген шарт кошуңуз: if (false) {} else { alert(\"No\"); }",
    explanation: {
      title: "Болбосо...",
      points: ["else - эгер 'if' иштебей калса, анда ушул блок иштейт."]
    },
    check: (input) => /else\s*\{\s*alert\(.+?\)\s*;\s*\}/.test(input)
  },
  {
    id: 17,
    title: "Ternary Operator",
    task: "Кыскача шарт жазыңыз: let res = true ? 1 : 0;",
    explanation: {
      title: "Үчтүк оператор",
      points: ["Бул if/else-тин кыскача жазылышы."]
    },
    check: (input) => /let\s+res\s*=\s*.+?\s*\?\s*.+?\s*:\s*.+?\s*;/.test(input)
  },
  {
    id: 18,
    title: "Switch",
    task: "Switch түзүмүн баштаңыз: switch(1) { case 1: break; }",
    explanation: {
      title: "Тандоо",
      points: ["Switch - көптөгөн варианттардын ичинен бирөөнү тандайт."]
    },
    check: (input) => /switch\s*\(.+?\)\s*\{\s*case\s*.+?:\s*break\s*;\s*\}/.test(input)
  },
  {
    id: 19,
    title: "For Loop",
    task: "Цикл жазыңыз: for (let i = 0; i < 3; i++) { }",
    explanation: {
      title: "Кайталоо",
      points: ["Цикл - бир эле кодду көп жолу кайталоого жардам берет."]
    },
    check: (input) => /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*\d+\s*;\s*i\+\+\s*\)\s*\{\s*\}/.test(input)
  },
  {
    id: 20,
    title: "While Loop",
    task: "Башка цикл жазыңыз: while (true) { break; }",
    explanation: {
      title: "While",
      points: ["Шарт туура болуп турган учурда иштей берет."]
    },
    check: (input) => /while\s*\(.+?\)\s*\{\s*break\s*;\s*\}/.test(input)
  },

  // --- 3-БЛОК: МАССИВДЕР ЖАНА ФУНКЦИЯЛАР (21-30) ---
  {
    id: 21,
    title: "Arrays",
    task: "Тизме түзүңүз: let list = [1, 2, 3];",
    explanation: {
      title: "Массивдер",
      points: ["Бир өзгөртмөдө көптөгөн маалыматтарды сактоочу тизме."]
    },
    check: (input) => /let\s+list\s*=\s*\[\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\]\s*;/.test(input)
  },
  {
    id: 22,
    title: "Array push",
    task: "Массивге маани кошуңуз: list.push(4);",
    explanation: {
      title: "Кошуу",
      points: ["push() - тизменин аягына жаңы элемент кошот."]
    },
    check: (input) => /\.push\(.+?\)\s*;/.test(input)
  },
  {
    id: 23,
    title: "Functions",
    task: "Функция жазыңыз: function test() { return 1; }",
    explanation: {
      title: "Функция",
      points: ["Функция - бул кайра-кайра колдонула турган коддордун тобу."]
    },
    check: (input) => /function\s+.+?\(\)\s*\{\s*return\s*.+?;\s*\}/.test(input)
  },
  {
    id: 24,
    title: "Arrow Functions",
    task: "Жебе функциясы: const go = () => {};",
    explanation: {
      title: "Заманбап функция",
      points: ["Жебе функциясы кыска жана ыңгайлуу жазылат."]
    },
    check: (input) => /const\s+.+?=\s*\(\s*\)\s*=>\s*\{\s*\}/.test(input)
  },
  {
    id: 25,
    title: "Objects",
    task: "Объект түзүңүз: let car = { brand: \"BMW\" };",
    explanation: {
      title: "Объекттер",
      points: ["Маалыматты 'ачкыч: маани' түрүндө сактайт."]
    },
    check: (input) => /let\s+.+?=\s*\{\s*.+?:\s*.+?\s*\}/.test(input)
  },
  {
    id: 26,
    title: "Array Map",
    task: "Массивди өзгөртүү: list.map(x => x * 2);",
    explanation: {
      title: "Тизмени трансформациялоо",
      points: ["map() - тизменин ар бир элементин өзгөртүп чыгат."]
    },
    check: (input) => /\.map\(.+?=>.+?\)/.test(input)
  },
  {
    id: 27,
    title: "Array Filter",
    task: "Тандоо: list.filter(x => x > 5);",
    explanation: {
      title: "Чыпкалоо",
      points: ["filter() - шартка туура келген элементтерди гана калтырат."]
    },
    check: (input) => /\.filter\(.+?=>.+?\)/.test(input)
  },
  {
    id: 28,
    title: "Destructuring",
    task: "Массивди чачыңыз: let [a, b] = [1, 2];",
    explanation: {
      title: "Деструктуризация",
      points: ["Тизмедеги маанилерди өзүнчө өзгөртмөлөргө бат эле бөлүп берет."]
    },
    check: (input) => /let\s*\[.+?\]\s*=\s*\[.+?\]/.test(input)
  },
  {
    id: 29,
    title: "Spread Operator",
    task: "Массивди көчүрүү: let b = [...a];",
    explanation: {
      title: "Жайылтуу",
      points: ["(...) - үч чекит маалыматтарды жайып же көчүрүп берет."]
    },
    check: (input) => /\[\s*\.\.\..+?\s*\]/.test(input)
  },
  {
    id: 30,
    title: "Length",
    task: "Тизменин узундугун билиңиз: list.length;",
    explanation: {
      title: "Узундук",
      points: ["length - тизмеде канча элемент бар экенин айтат."]
    },
    check: (input) => /\.length\s*;?/.test(input)
  },

  // --- 4-БЛОК: ТАТААЛ ТЕМАЛАР (31-40) ---
  {
    id: 31,
    title: "Try/Catch",
    task: "Катаны кармоо: try { } catch(e) { }",
    explanation: {
      title: "Каталар менен иштөө",
      points: ["Программа иштеп жатканда ката кетсе, аны 'catch' кармап калат."]
    },
    check: (input) => /try\s*\{.*?\}\s*catch\s*\(.+?\)\s*\{.*?\}/.test(input)
  },
  {
    id: 32,
    title: "setTimeout",
    task: "Күтүү: setTimeout(() => {}, 1000);",
    explanation: {
      title: "Убакыт",
      points: ["Белгилүү бир убакыттан кийин кодду иштетет."]
    },
    check: (input) => /setTimeout\s*\(.+?,\s*\d+\s*\)\s*;/.test(input)
  },
  {
    id: 33,
    title: "Promises",
    task: "Убада түзүү: new Promise((res) => res());",
    explanation: {
      title: "Убадалар",
      points: ["Келечекте бүтө турган иш-аракетти билдирет."]
    },
    check: (input) => /new\s+Promise/.test(input)
  },
  {
    id: 34,
    title: "Async/Await",
    task: "Асинхрондук функция: async function test() { await p; }",
    explanation: {
      title: "Күтүү",
      points: ["Await - убада (Promise) аткарылмайынча кодду токтотуп турат."]
    },
    check: (input) => /async\s+function.+?await/.test(input)
  },
  {
    id: 35,
    title: "DOM Query",
    task: "Элементти табуу: document.querySelector(\"h1\");",
    explanation: {
      title: "Сайтты издөө",
      points: ["Сайттагы каалаган тегди же элементти таап берет."]
    },
    check: (input) => /document\.querySelector\(.+?\)/.test(input)
  },
  {
    id: 36,
    title: "Event Listener",
    task: "Басууну кармоо: btn.addEventListener(\"click\", () => {});",
    explanation: {
      title: "Окуялар",
      points: ["Чычканды басуу сыяктуу окуяларга сайттын реакциясын жаратат."]
    },
    check: (input) => /\.addEventListener\(["']click["'].+?\)/.test(input)
  },
  {
    id: 37,
    title: "Class",
    task: "Класс түзүү: class Player { }",
    explanation: {
      title: "Класс",
      points: ["Объекттерди түзүү үчүн колдонулган шаблон."]
    },
    check: (input) => /class\s+[A-Z].+?\{\s*\}/.test(input)
  },
  {
    id: 38,
    title: "JSON Parse",
    task: "Текстти объектке айлантуу: JSON.parse(\"{}\");",
    explanation: {
      title: "Маалымат форматы",
      points: ["JSON - серверден маалымат алууда колдонулган негизги формат."]
    },
    check: (input) => /JSON\.parse\(.+?\)/.test(input)
  },
  {
    id: 39,
    title: "LocalStorage",
    task: "Маалымат сактоо: localStorage.setItem(\"key\", \"val\");",
    explanation: {
      title: "Браузердеги эс тутум",
      points: ["Сайтты жаап койсоңуз дагы маалыматты браузерде сактап калат."]
    },
    check: (input) => /localStorage\.setItem\(.+?\)/.test(input)
  },
  {
    id: 40,
    title: "Final Master",
    task: "Мастер экениңизди далилдеңиз: console.log(\"I love JS\");",
    explanation: {
      title: "Финиш!",
      points: ["Сиз бардык 40 деңгээлди бүтүрүп, чыныгы JS баатыры болдуңуз!"]
    },
    check: (input) => /console\.log\(.+?\)/.test(input)
  }
];