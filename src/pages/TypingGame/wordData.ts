// src/pages/TypingGame/wordData.ts

export type LanguageType = 'kg' | 'en' | 'ru';

export const WORDS_DATA: Record<LanguageType, string[]> = {
  kg: ["өзгөрмө", "функция", "цикл", "шарт", "маалымат", "тармак", "программа", "клавиатура", "чычкан", "монитор", "иштетүү", "система", "коддоо", "алгоритм", "массив", "интерфейс", "байланыш", "булут", "коопсуздук", "долбоор"],
  en: ["variable", "function", "array", "object", "backend", "frontend", "developer", "database", "syntax", "system", "interface", "compiler", "debugging", "algorithm", "javascript", "react", "component", "deployment", "repository", "terminal"],
  ru: ["переменная", "скрипт", "массив", "поток", "сервер", "запрос", "интерфейс", "сборка", "ошибка", "алгоритм", "компилятор", "отладка", "разработка", "база", "данные", "протокол", "сеть", "объект", "функция", "код"]
};