export interface MathQuestion {
  id: number;
  columnA: string; // А колонкасы
  columnB: string; // Б колонкасы
  condition?: string; // Эгерде кошумча шарт болсо (мисалы: x > 0)
  correct: 'A' | 'B' | 'Equal' | 'NotEnough'; // Туура жооп
  explanation: string;
}

export const mathQuestions: MathQuestion[] = [
  {
    id: 1,
    columnA: "0.5 * 40",
    columnB: "100 / 5",
    condition: "",
    correct: 'Equal',
    explanation: "0.5 * 40 = 20. Ал эми 100 / 5 = 20. Демек, алар барабар."
  },
  {
    id: 2,
    columnA: "x + 5",
    columnB: "x - 5",
    condition: "x > 0",
    correct: 'A',
    explanation: "x оң сан болгондуктан, ага 5ти кошсоң чоңойот, 5ти кемитсең кичирейет."
  },
  {
    id: 3,
    columnA: "a * b",
    columnB: "a + b",
    condition: "a, b > 0",
    correct: 'NotEnough',
    explanation: "Эгер a=1, b=1 болсо, сумма чоң. Эгер a=3, b=3 болсо, көбөйтүндү чоң. Маалымат жетишсиз."
  },
  {
    id: 4,
    columnA: "(-3) * (-3) * (-3)",
    columnB: "(-3) * (-3)",
    condition: "",
    correct: 'B',
    explanation: "А колонкасы -27 (терс), Б колонкасы 9 (оң). Оң сан ар дайым чоң."
  },
  {
    id: 5,
    columnA: "3/4",
    columnB: "0.75",
    condition: "",
    correct: 'Equal',
    explanation: "3тү 4кө бөлсөк 0.75 чыгат. Алар барабар."
  },
  {
    id: 6,
    columnA: "3^4 (3түн 4 даражасы)",
    columnB: "4^3 (4түн 3 даражасы)",
    condition: "",
    correct: 'A',
    explanation: "3^4 = 81, ал эми 4^3 = 64. 81 > 64."
  },
  {
    id: 7,
    columnA: "x^2",
    columnB: "x^3",
    condition: "x > 0",
    correct: 'NotEnough',
    explanation: "Эгер x=0.5 болсо, x^2 чоң. Эгер x=1 болсо, барабар. Эгер x=2 болсо, x^3 чоң. Маалымат жетишсиз."
  },
  {
    id: 8,
    columnA: "Тик бурчтуктун аянты",
    columnB: "Квадраттын аянты",
    condition: "Эки фигуранын тең периметри 24 см",
    correct: 'B',
    explanation: "Периметрлери бирдей болгон фигуралардын ичинен квадраттын аянты ар дайым эң чоң болот."
  },
  {
    id: 9,
    columnA: "15тин 20%ы",
    columnB: "20нын 15%ы",
    correct: 'Equal',
    explanation: "15 * 0.20 = 3 жана 20 * 0.15 = 3. Алар барабар."
  },
  {
    id: 10,
    columnA: "a + b",
    columnB: "a - b",
    condition: "b < 0",
    correct: 'B',
    explanation: "b терс сан болсо (мисалы -1), анда a + (-1) кичирейет, ал эми a - (-1) = a + 1 болуп чоңоёт."
  },
  {
    id: 11,
    columnA: "7/9",
    columnB: "8/10",
    correct: 'B',
    explanation: "7/9 ≈ 0.77, 8/10 = 0.8. Демек Б колонкасы чоң."
  },
  {
    id: 12,
    columnA: "Тудак бурчтун суммасы",
    columnB: "180°",
    condition: "Үч бурчтуктун ички бурчтары",
    correct: 'Equal',
    explanation: "Кандай гана үч бурчтук болбосун, ички бурчтарынын суммасы дайыма 180° болот."
  },
  {
    id: 13,
    columnA: "|-5| + |3|",
    columnB: "|-5 + 3|",
    correct: 'A',
    explanation: "А колонкасы: 5 + 3 = 8. Б колонкасы: |-2| = 2. 8 > 2."
  },
  {
    id: 14,
    columnA: "x + y",
    columnB: "0",
    condition: "x = -y",
    correct: 'Equal',
    explanation: "Эгер x = -y болсо, анда x + y = 0 болот."
  },
  {
    id: 15,
    columnA: "0.01^2",
    columnB: "0.001",
    correct: 'B',
    explanation: "0.01 * 0.01 = 0.0001. Ал эми 0.001 чоңураак."
  },
  {
    id: 16,
    columnA: "Тегеректин диаметри",
    columnB: "Радиустун 2 эсеси",
    correct: 'Equal',
    explanation: "Диаметр ар дайым эки радиуска барабар (D = 2r)."
  },
  {
    id: 17,
    columnA: "√64 + √36",
    columnB: "√(64 + 36)",
    correct: 'A',
    explanation: "А колонкасы: 8 + 6 = 14. Б колонкасы: √100 = 10. 14 > 10."
  },
  {
    id: 18,
    columnA: "Бир күндөгү секунддар",
    columnB: "80,000",
    correct: 'A',
    explanation: "24 * 60 * 60 = 86,400 секунд. 86,400 > 80,000."
  },
  {
    id: 19,
    columnA: "n^0",
    columnB: "1",
    condition: "n > 0",
    correct: 'Equal',
    explanation: "Ар кандай сандын (нөлдөн башка) нөлүнчү даражасы 1ге барабар."
  },
  {
    id: 20,
    columnA: "x/y",
    columnB: "1",
    condition: "x > y жана y > 0",
    correct: 'A',
    explanation: "Эгер алымы бөлүмүнөн чоң болсо, тийинди 1ден чоң болот."
  },
  {
    id: 21,
    columnA: "25% of 80",
    columnB: "10% of 200",
    correct: 'Equal',
    explanation: "80дин 25%ы 20, 200дүн 10%ы да 20."
  },
  {
    id: 22,
    columnA: "2x + 3",
    columnB: "x + 8",
    condition: "x = 5",
    correct: 'Equal',
    explanation: "2*5+3 = 13 жана 5+8 = 13."
  },
  {
    id: 23,
    columnA: "Орточо арифметикалык",
    columnB: "7",
    condition: "Сандар: 4, 7, 10",
    correct: 'Equal',
    explanation: "(4+7+10)/3 = 21/3 = 7."
  },
  {
    id: 24,
    columnA: "5!",
    columnB: "100",
    correct: 'A',
    explanation: "5! = 5*4*3*2*1 = 120, ал 100дөн чоң."
  },
  {
    id: 25,
    columnA: "0.2 + 0.03",
    columnB: "0.203",
    correct: 'A',
    explanation: "0.2 + 0.03 = 0.23, ал 0.203төн чоң."
  },
  {
    id: 26,
    columnA: "Үч бурчтуктун сырткы бурчу",
    columnB: "Ага жанаша эмес эки ички бурчтун суммасы",
    correct: 'Equal',
    explanation: "Үч бурчтуктун сырткы бурчу ага жанаша эмес эки ички бурчтун суммасына барабар."
  },
  {
    id: 27,
    columnA: "x",
    columnB: "0",
    condition: "x^2 = 9",
    correct: 'NotEnough',
    explanation: "x = 3 же x = -3 болушу мүмкүн. Маалымат жетишсиз."
  },
  {
    id: 28,
    columnA: "12 км",
    columnB: "12000 м",
    correct: 'Equal',
    explanation: "1 км = 1000 м, демек 12 км = 12000 м."
  },
  {
    id: 29,
    columnA: "3/5",
    columnB: "5/8",
    correct: 'B',
    explanation: "3/5 = 0.6, 5/8 = 0.625."
  },
  {
    id: 30,
    columnA: "a^2",
    columnB: "a",
    condition: "0 < a < 1",
    correct: 'B',
    explanation: "0 менен 1дин ортосундагы сан квадратталса кичирейет."
  },
  {
    id: 31,
    columnA: "Квадраттын периметри",
    columnB: "20 см",
    condition: "Квадраттын жагы 5 см",
    correct: 'Equal',
    explanation: "Периметр = 4*5 = 20 см."
  },
  {
    id: 32,
    columnA: "2/3 + 1/6",
    columnB: "5/6",
    correct: 'Equal',
    explanation: "2/3 = 4/6, 4/6 + 1/6 = 5/6."
  },
  {
    id: 33,
    columnA: "Орточо ылдамдык",
    columnB: "60 км/саат",
    condition: "120 км жол 2 саатта жүрүлдү",
    correct: 'Equal',
    explanation: "Ылдамдык = жол/убакыт = 120/2 = 60 км/саат."
  },
  {
    id: 34,
    columnA: "9^2",
    columnB: "2^6",
    correct: 'A',
    explanation: "9^2 = 81, 2^6 = 64."
  },
  {
    id: 35,
    columnA: "x + 2",
    columnB: "2x",
    condition: "x > 2",
    correct: 'B',
    explanation: "x > 2 болсо, 2x - (x+2) = x-2 > 0, демек Б чоң."
  }
];
