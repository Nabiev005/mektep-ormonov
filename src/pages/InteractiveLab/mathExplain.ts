import { compile, type EvalFunction } from 'mathjs';

export interface FunctionInsight {
  category: string;
  domain: string;
  symmetry: string;
  behavior: string;
  notes: string[];
}

type CompiledFn = EvalFunction;

const isSymmetric = (fn: CompiledFn, points: number[], mode: 'even' | 'odd'): boolean => {
  let matches = 0;
  let total = 0;
  for (const x of points) {
    try {
      const a = fn.evaluate({ x });
      const b = fn.evaluate({ x: -x });
      if (typeof a === 'number' && typeof b === 'number' && Number.isFinite(a) && Number.isFinite(b)) {
        total++;
        const equal = mode === 'even' ? Math.abs(a - b) < 1e-6 : Math.abs(a + b) < 1e-6;
        if (equal) matches++;
      }
    } catch {
      /* чекит аныкталбаса, өткөрүп жиберебиз */
    }
  }
  return total > 0 && matches === total;
};

export const explainFunction = (expr: string): FunctionInsight => {
  const clean = expr.replace(/\s+/g, '');
  const notes: string[] = [];

  let category = 'Функция';
  if (/sin|cos|tan/.test(clean)) category = 'Тригонометриялык функция';
  else if (/sqrt/.test(clean)) category = 'Иррационалдык (тамырлуу) функция';
  else if (/log/.test(clean)) category = 'Логарифмдик функция';
  else if (/abs/.test(clean)) category = 'Модулдук функция';
  else if (/\/x|\/\(.*x.*\)/.test(clean)) category = 'Рационалдык (бөлчөк) функция';
  else if (/x\^3/.test(clean)) category = 'Кубдук (3-даражалуу) функция';
  else if (/x\^2/.test(clean)) category = 'Квадраттык (парабола) функция';
  else if (/x/.test(clean)) category = 'Сызыктуу же көпмүчө функция';

  let domain = 'Бардык чыныгы сандар үчүн аныкталган (x ∈ ℝ)';
  if (/sqrt/.test(clean)) {
    domain = 'Тамыр астындагы туюнтма терс болбошу керек';
    notes.push('Тамыр астында терс сан чыкса, ал жерде функция аныкталбайт — график үзүлөт.');
  }
  if (/\/x|\/\(.*x.*\)/.test(clean)) {
    domain = 'Бөлүүчү 0гө барабар болгон чекитте функция аныкталган эмес';
    notes.push('x = 0 болгондо функция аныкталбайт, график ошол жерде асимптотага умтулат.');
  }
  if (/tan/.test(clean)) {
    domain = 'π/2 + πn түрүндөгү чекиттерде аныкталган эмес';
    notes.push('tan(x) функциясы π/2ге жакын жерлерде чексиздикке умтулат.');
  }
  if (/log/.test(clean)) {
    domain = 'Логарифмдин ичиндеги туюнтма 0дон чоң болушу керек (x > 0)';
  }

  const fn = compile(expr);
  const points = [0.5, 1, 1.7, 2.3, 3.1, 4.6];
  let symmetry = 'Жуп да, так да эмес — эркин функция';
  if (isSymmetric(fn, points, 'even')) {
    symmetry = 'Жуп функция — графиги OY огуна карата симметриялуу';
  } else if (isSymmetric(fn, points, 'odd')) {
    symmetry = 'Так функция — графиги координаттар башталышына карата симметриялуу';
  }

  let behavior = 'Диапазонду өзгөртүп, графиктин жүрүм-турумун өзүңүз байкап көрүңүз.';
  if (/sin|cos/.test(clean)) {
    behavior = 'Мезгилдүү (периодикалык) функция, мааниси −1 менен 1 арасында термелип турат.';
  } else if (/x\^3/.test(clean)) {
    behavior = 'S-сымал ийри сызык, өсүүчү/кемүүчү аймактары бар.';
  } else if (/x\^2/.test(clean)) {
    behavior = 'Парабола түрүндө, эң төмөнкү (же эң жогорку) чекити бар.';
  } else if (/\/x/.test(clean)) {
    behavior = 'Гипербола түрүндө, x = 0 жанында чексиздикке умтулат.';
  } else if (/sqrt/.test(clean)) {
    behavior = 'Жайлап өсүүчү ийри сызык, терс жакта аныкталбайт.';
  }

  return { category, domain, symmetry, behavior, notes };
};
