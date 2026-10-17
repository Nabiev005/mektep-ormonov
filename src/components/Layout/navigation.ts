import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Bot,
  Brain,
  Calculator,
  CalendarDays,
  Code2,
  Cpu,
  Crown,
  FileCode2,
  FileText,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  Images,
  Keyboard,
  Languages,
  Library,
  Link2,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Puzzle,
  Sparkles,
  TreeDeciduous,
  Trophy,
  Users,
  Video,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  key: string;
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: 'school',
    title: 'Мектеп',
    items: [
      { label: 'Биз жөнүндө', path: '/about', icon: BookOpen },
      { label: 'Жаңылыктар', path: '/news', icon: Newspaper },
      { label: 'Расписание', path: '/schedule', icon: CalendarDays },
      { label: 'Мугалимдер', path: '/teachers', icon: Users },
      { label: 'Мыкты окуучулар', path: '/best-students', icon: Trophy },
      { label: 'Галерея', path: '/gallery', icon: Images },
      { label: 'Иш пландар', path: '/library', icon: FileText },
      { label: 'Байланыш', path: '/contact', icon: Phone },
    ],
  },
  {
    key: 'learning',
    title: 'Окуу',
    items: [
      { label: 'ЖРТга даярдык', path: '/community/ort', icon: Library },
      { label: 'Интерактивдүү лаборатория', path: '/community/interactive-lab', icon: FlaskConical },
      { label: 'Түшүндүр мага (AI)', path: '/community/ai-tutor', icon: Sparkles, badge: 'AI' },
      { label: 'Онлайн сабактар', path: '/online-lessons', icon: Video },
      { label: 'Пайдалуу ресурстар', path: '/resources', icon: Link2 },
    ],
  },
  {
    key: 'courses',
    title: 'IT жана тил курстары',
    items: [
      { label: 'Frontend', path: '/community/js-game', icon: Code2 },
      { label: 'Python', path: '/community/python-course', icon: FileCode2 },
      { label: 'AI үйрөнүү', path: '/community/ai-course', icon: Bot },
      { label: 'Оюн түзүү', path: '/community/gamedev', icon: Gamepad2 },
      { label: 'Робот лаборатория', path: '/community/robot-lab', icon: Cpu },
      { label: 'Англис тили', path: '/community/english-course', icon: Languages },
      { label: 'Орус тили', path: '/community/russian-course', icon: Languages },
      { label: 'Түрк тили', path: '/community/turkish-course', icon: Languages },
    ],
  },
  {
    key: 'games',
    title: 'Билим оюндары',
    items: [
      { label: 'Рейтинг', path: '/community/leaderboard', icon: Crown },
      { label: 'Ким акылдуу?', path: '/community/duel-game', icon: Brain },
      { label: 'Тез эсепте', path: '/community/math-sprint', icon: Calculator },
      { label: 'Логика Battle', path: '/community/logic-game', icon: Puzzle },
      { label: 'Geo Master', path: '/community/games/geo-master', icon: MapPin },
      { label: 'Тез басуу', path: '/community/typing-game', icon: Keyboard },
      { label: 'Өрүк дарагын сакта', path: '/community/apricot-tree', icon: TreeDeciduous },
      { label: 'Жылан оюну', path: '/community/snake-game', icon: Gamepad2 },
    ],
  },
  {
    key: 'community',
    title: 'Коомчулук',
    items: [
      { label: 'Окуучу панели', path: '/student-panel', icon: GraduationCap },
      { label: 'Мугалим панели', path: '/teacher-panel', icon: GraduationCap },
      { label: 'Ата-энелер бурчу', path: '/parents-corner', icon: Heart },
      { label: 'Жылуу сөздөр', path: '/community/warm-words', icon: Mail },
    ],
  },
];

export const HOME_ITEM: NavItem = { label: 'Башкы бет', path: '/', icon: Home };

export const ALL_NAV_ITEMS: NavItem[] = [HOME_ITEM, ...NAV_GROUPS.flatMap((group) => group.items)];

export const MOBILE_TABS: NavItem[] = [
  HOME_ITEM,
  { label: 'Жаңылык', path: '/news', icon: Newspaper },
  { label: 'Расписание', path: '/schedule', icon: CalendarDays },
  { label: 'Окуучу', path: '/student-panel', icon: GraduationCap },
];

/** Учурдагы барактын аталышын табат (топбарда көрсөтүү үчүн). */
export const findNavItem = (pathname: string) =>
  ALL_NAV_ITEMS.find((item) => item.path === pathname)
  ?? ALL_NAV_ITEMS.filter((item) => item.path !== '/' && pathname.startsWith(item.path)).sort((a, b) => b.path.length - a.path.length)[0];
