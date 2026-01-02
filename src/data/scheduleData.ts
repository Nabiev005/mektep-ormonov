import type { DaySchedule } from '../types';

export const scheduleData: DaySchedule[] = [
  {
    day: "Дүйшөмбү",
    lessons: [
      { id: 1, subject: "Математика", teacher: "Асанова А.", room: "204", time: "08:00 - 08:45" },
      { id: 2, subject: "Кыргыз тили", teacher: "Осмонов Б.", room: "105", time: "08:55 - 09:40" },
    ]
  },
  {
    day: "Шейшемби",
    lessons: [
      { id: 3, subject: "Информатика", teacher: "Исаков Т.", room: "ИТ-класс", time: "08:00 - 08:45" },
    ]
  }
];