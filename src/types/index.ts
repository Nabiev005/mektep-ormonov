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