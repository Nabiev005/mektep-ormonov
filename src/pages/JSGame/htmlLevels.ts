export const htmlLevels = [
  // --- БЛОК 1: НЕГИЗДЕР (1-10) ---
  {
    id: 1,
    title: "HTML: H1 Заголовок",
    task: "Эң чоң аталышты түзүңүз: <h1>Салам</h1>",
    explanation: {
      title: "H1 теги",
      points: ["HTMLдин башаты - бул тегдер.", "<h1> - сайттын негизги темасы.", "Тег ачылат жана жабылат (</h1>)."]
    },
    check: (input: string) => /<h1>.*?<\/h1>/.test(input)
  },
  {
    id: 2,
    title: "Параграф (Paragraph)",
    task: "Текст жазыңыз: <p>Бул параграф</p>",
    explanation: {
      title: "P теги",
      points: ["<p> - жөнөкөй текст үчүн колдонулат.", "Ал автоматтык түрдө тексттен кийин боштук калтырат."]
    },
    check: (input: string) => /<p>.*?<\/p>/.test(input)
  },
  {
    id: 3,
    title: "Кичине аталыш (H2)",
    task: "Экинчи деңгээлдеги аталышты жазыңыз: <h2>Бөлүм</h2>",
    explanation: { title: "H2", points: ["H1ден кичирээк, маанилүүлүгү боюнча экинчи орунда."] },
    check: (input: string) => /<h2>.*?<\/h2>/.test(input)
  },
  {
    id: 4,
    title: "Текстти жоон кылуу",
    task: "Маанилүү сөздү белгилеңиз: <strong>Маанилүү</strong>",
    explanation: { title: "Strong", points: ["Текстти калың (bold) кылып көрсөтөт."] },
    check: (input: string) => /<strong>.*?<\/strong>/.test(input)
  },
  {
    id: 5,
    title: "Текстти жантык кылуу",
    task: "Жазыңыз: <em>Кыйшык текст</em>",
    explanation: { title: "Emphasis", points: ["Текстке басым жасап, ийилген (italic) кылат."] },
    check: (input: string) => /<em>.*?<\/em>/.test(input)
  },
  {
    id: 6,
    title: "Сызыкча (Horizontal Rule)",
    task: "Бөлүп турган сызык кошуңуз: <hr />",
    explanation: { title: "HR", points: ["Бул тег жабылбайт.", "Бөлүмдөрдү горизонталдык сызык менен бөлөт."] },
    check: (input: string) => /<hr\s*\/?\s*>/.test(input)
  },
  {
    id: 7,
    title: "Сапты которуу (Break)",
    task: "Текстти төмөнкү сапка түшүрүңүз: <br />",
    explanation: { title: "BR", points: ["Жаңы сапка өтүү үчүн колдонулат."] },
    check: (input: string) => /<br\s*\/?\s*>/.test(input)
  },
  {
    id: 8,
    title: "Шилтеме (Link)",
    task: "Жазыңыз: <a href=\"#\">Шилтеме</a>",
    explanation: { title: "Link", points: ["href - бул шилтеме бара турган дарек."] },
    check: (input: string) => /<a\s+href=/.test(input)
  },
  {
    id: 9,
    title: "Сүрөт (Image)",
    task: "<img src=\"cat.jpg\" alt=\"мышык\" />",
    explanation: { title: "Image", points: ["src - сүрөттүн дареги.", "alt - сүрөт чыкпай калса көрсөтүлүүчү текст."] },
    check: (input: string) => /<img\s+src=/.test(input)
  },
  {
    id: 10,
    title: "Аталыштар (H3-H6)",
    task: "Эң кичинекей аталышты жазыңыз: <h6>Аягы</h6>",
    explanation: { title: "H6", points: ["H1ден H6га чейин аталыштар кичирейип барат."] },
    check: (input: string) => /<h6>.*?<\/h6>/.test(input)
  },

  // --- БЛОК 2: ТИЗМЕЛЕР ЖАНА ТАБЛИЦАЛАР (11-20) ---
  {
    id: 11,
    title: "Тартипсиз тизме (UL)",
    task: "Тизме ачыңыз: <ul> </ul>",
    explanation: { title: "UL", points: ["Unordered List - чекиттер менен тизмеленет."] },
    check: (input: string) => /<ul>\s*<\/ul>/.test(input)
  },
  {
    id: 12,
    title: "Тизме элементи (LI)",
    task: "Тизмеге пункт кошуңуз: <li>Нан</li>",
    explanation: { title: "LI", points: ["List Item - тизменин ар бир элементи."] },
    check: (input: string) => /<li>.*?<\/li>/.test(input)
  },
  {
    id: 13,
    title: "Тартиптүү тизме (OL)",
    task: "Номерленген тизме: <ol> </ol>",
    explanation: { title: "OL", points: ["Ordered List - 1, 2, 3 деп номерлейт."] },
    check: (input: string) => /<ol>\s*<\/ol>/.test(input)
  },
  {
    id: 14,
    title: "Таблица (Table)",
    task: "Таблица түзүңүз: <table> </table>",
    explanation: { title: "Table", points: ["Маалыматтарды торчо түрүндө көрсөтүү."] },
    check: (input: string) => /<table>\s*<\/table>/.test(input)
  },
  {
    id: 15,
    title: "Таблицанын сабы (TR)",
    task: "Сап кошуңуз: <tr> </tr>",
    explanation: { title: "TR", points: ["Table Row - таблицанын горизонталдык сабы."] },
    check: (input: string) => /<tr>\s*<\/tr>/.test(input)
  },
  {
    id: 16,
    title: "Таблицанын уячасы (TD)",
    task: "Маалымат жазыңыз: <td>Маани</td>",
    explanation: { title: "TD", points: ["Table Data - таблицанын ичиндеги клетка."] },
    check: (input: string) => /<td>.*?<\/td>/.test(input)
  },
  {
    id: 17,
    title: "Таблица башчасы (TH)",
    task: "Башкы уяча: <th>Аты</th>",
    explanation: { title: "TH", points: ["Table Header - уячанын ичиндеги текст жоон болот."] },
    check: (input: string) => /<th>.*?<\/th>/.test(input)
  },
  {
    id: 18,
    title: "Сүрөттүн аталышы",
    task: "<figcaption>Сүрөттүн аты</figcaption>",
    explanation: { title: "Figcaption", points: ["Сүрөттүн алдына түшүндүрмө жазуу."] },
    check: (input: string) => /<figcaption>.*?<\/figcaption>/.test(input)
  },
  {
    id: 19,
    title: "Цитата (Blockquote)",
    task: "<blockquote>Акылдуу сөз</blockquote>",
    explanation: { title: "Quote", points: ["Башка булактан алынган чоң цитата."] },
    check: (input: string) => /<blockquote>.*?<\/blockquote>/.test(input)
  },
  {
    id: 20,
    title: "Пре-формат (Pre)",
    task: "<pre>Код же текст</pre>",
    explanation: { title: "Pre", points: ["Текст кандай жазылса, ошондой боштуктары менен чыгат."] },
    check: (input: string) => /<pre>.*?<\/pre>/.test(input)
  },

  // --- БЛОК 3: ФОРМАЛАР ЖАНА КИРГИЗҮҮ (21-30) ---
  {
    id: 21,
    title: "Форма (Form)",
    task: "<form> </form>",
    explanation: { title: "Form", points: ["Колдонуучудан маалымат алуучу негизги блок."] },
    check: (input: string) => /<form>\s*<\/form>/.test(input)
  },
  {
    id: 22,
    title: "Текст талаасы (Input)",
    task: "<input type=\"text\" />",
    explanation: { title: "Input", points: ["Бир саптуу текст киргизүү үчүн."] },
    check: (input: string) => /<input\s+type=["']text["']\s*\/?\s*>/.test(input)
  },
  {
    id: 23,
    title: "Пароль киргизүү",
    task: "<input type=\"password\" />",
    explanation: { title: "Password", points: ["Жазылган текст жылдызча болуп көрүнөт."] },
    check: (input: string) => /type=["']password["']/.test(input)
  },
  {
    id: 24,
    title: "Чекбокс (Checkbox)",
    task: "<input type=\"checkbox\" />",
    explanation: { title: "Checkbox", points: ["Бир нече вариантты тандоо үчүн."] },
    check: (input: string) => /type=["']checkbox["']/.test(input)
  },
  {
    id: 25,
    title: "Радио баскыч",
    task: "<input type=\"radio\" />",
    explanation: { title: "Radio", points: ["Тизмеден бир гана вариантты тандоо үчүн."] },
    check: (input: string) => /type=["']radio["']/.test(input)
  },
  {
    id: 26,
    title: "Сан киргизүү",
    task: "<input type=\"number\" />",
    explanation: { title: "Number", points: ["Текст эмес, сан гана жазууга болот."] },
    check: (input: string) => /type=["']number["']/.test(input)
  },
  {
    id: 27,
    title: "Текст аянты (Textarea)",
    task: "<textarea></textarea>",
    explanation: { title: "Textarea", points: ["Көп саптуу чоң текст жазуу үчүн."] },
    check: (input: string) => /<textarea>.*?<\/textarea>/.test(input)
  },
  {
    id: 28,
    title: "Тандоо тизмеси (Select)",
    task: "<select> </select>",
    explanation: { title: "Select", points: ["Төшөлмө (dropdown) тизме түзүү."] },
    check: (input: string) => /<select>\s*<\/select>/.test(input)
  },
  {
    id: 29,
    title: "Тандоо пункту (Option)",
    task: "<option>Кыргызстан</option>",
    explanation: { title: "Option", points: ["Select тизмесинин ичиндеги элемент."] },
    check: (input: string) => /<option>.*?<\/option>/.test(input)
  },
  {
    id: 30,
    title: "Баскыч (Button)",
    task: "<button type=\"submit\">Жөнөтүү</button>",
    explanation: { title: "Submit", points: ["Формадагы маалыматты серверге жөнөтүү баскычы."] },
    check: (input: string) => /type=["']submit["']/.test(input)
  },

  // --- БЛОК 4: СЕМАНТИКА ЖАНА ГРУППАЛОО (31-40) ---
  {
    id: 31,
    title: "Контейнер (Div)",
    task: "<div> </div>",
    explanation: { title: "DIV", points: ["Блоктук элемент, мазмунду топтогонго керек."] },
    check: (input: string) => /<div>\s*<\/div>/.test(input)
  },
  {
    id: 32,
    title: "Саптык контейнер (Span)",
    task: "<span>Текст</span>",
    explanation: { title: "SPAN", points: ["Тексттин ичиндеги бир бөлүктү белгилөөгө керек."] },
    check: (input: string) => /<span>.*?<\/span>/.test(input)
  },
  {
    id: 33,
    title: "Башкы бөлүм (Header)",
    task: "<header> </header>",
    explanation: { title: "Header", points: ["Сайттын эң үстүнкү, логотип жана меню бөлүгү."] },
    check: (input: string) => /<header>\s*<\/header>/.test(input)
  },
  {
    id: 34,
    title: "Навигация (Nav)",
    task: "<nav> </nav>",
    explanation: { title: "NAV", points: ["Меню шилтемелери үчүн атайын блок."] },
    check: (input: string) => /<nav>\s*<\/nav>/.test(input)
  },
  {
    id: 35,
    title: "Негизги мазмун (Main)",
    task: "<main> </main>",
    explanation: { title: "Main", points: ["Сайттын эң башкы жана уникалдуу мазмуну."] },
    check: (input: string) => /<main>\s*<\/main>/.test(input)
  },
  {
    id: 36,
    title: "Макала (Article)",
    task: "<article> </article>",
    explanation: { title: "Article", points: ["Өзүнчө мааниге ээ болгон макала же жаңылык."] },
    check: (input: string) => /<article>\s*<\/article>/.test(input)
  },
  {
    id: 37,
    title: "Бөлүм (Section)",
    task: "<section> </section>",
    explanation: { title: "Section", points: ["Мазмунду тематикалык бөлүктөргө бөлүү."] },
    check: (input: string) => /<section>\s*<\/section>/.test(input)
  },
  {
    id: 38,
    title: "Каптал тилке (Aside)",
    task: "<aside> </aside>",
    explanation: { title: "Aside", points: ["Негизги мазмундан сырткаркы кошумча маалымат."] },
    check: (input: string) => /<aside>\s*<\/aside>/.test(input)
  },
  {
    id: 39,
    title: "Сайттын аягы (Footer)",
    task: "<footer> </footer>",
    explanation: { title: "Footer", points: ["Сайттын эң төмөнкү бөлүгү (автордук укуктар)."] },
    check: (input: string) => /<footer>\s*<\/footer>/.test(input)
  },
  {
    id: 40,
    title: "Видео кошуу",
    task: "<video src=\"movie.mp4\"></video>",
    explanation: { title: "Video", points: ["Сайтка видео файлдарды орнотуу."] },
    check: (input: string) => /<video\s+src=/.test(input)
  }
];