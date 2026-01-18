export interface NewsItem {
    id: number;
    title: string;
    description: string;
    date: string;
    imageUrl: string;
}


export interface NavLink {
    name: string;
    path: string;
}

export interface Lesson {
  id: number;
  subject: string;
  teacher: string;
  room: string;
  time: string;
}

export interface DaySchedule {
  day: string;
  lessons: Lesson[];
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  experience: string;
  photoUrl: string;
  bio?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Book {
  id: string;
  title: string;
  author: string;
  grade: number; // Классы
  pdfUrl: string; // Файлга шилтеме
  category: string; // Мисалы: "Так илимдер", "Гуманитардык"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
}