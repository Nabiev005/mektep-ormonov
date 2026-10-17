import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { ChevronDown, LogIn, Menu, PanelLeftClose, PanelLeftOpen, Search, ShieldCheck, X } from 'lucide-react';
import { auth } from '../../firebase';
import { ALL_NAV_ITEMS, HOME_ITEM, MOBILE_TABS, NAV_GROUPS, findNavItem, type NavItem } from './navigation';
import styles from './Layout.module.css';

const COLLAPSED_KEY = 'layout.sidebarCollapsed';
const GROUPS_KEY = 'layout.closedGroups';

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Купуя режимде localStorage иштебеши мүмкүн — бул маанилүү эмес.
  }
};

const SidebarLink: React.FC<{ item: NavItem; collapsed: boolean }> = ({ item, collapsed }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
    >
      <Icon size={19} strokeWidth={1.8} className={styles.navIcon} />
      <span className={styles.navLabel}>{item.label}</span>
      {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
    </NavLink>
  );
};

const GlobalSearch: React.FC = () => {
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    return ALL_NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 7);
  }, [term]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const go = (path: string) => {
    navigate(path);
    setTerm('');
    setOpen(false);
  };

  return (
    <div className={styles.search} ref={boxRef}>
      <Search size={18} className={styles.searchIcon} />
      <input
        type="search"
        value={term}
        placeholder="Бөлүм издөө: жаңылыктар, расписание, Python..."
        aria-label="Сайттан издөө"
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) go(results[0].path);
          if (e.key === 'Escape') setOpen(false);
        }}
      />
      {open && term.trim() && (
        <div className={styles.searchResults} role="listbox">
          {results.length ? (
            results.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.path} type="button" className={styles.searchResult} onClick={() => go(item.path)}>
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })
          ) : (
            <p className={styles.searchEmpty}>Эч нерсе табылган жок</p>
          )}
        </div>
      )}
    </div>
  );
};

const UserChip: React.FC = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (next) => {
    setUser(next);
    setAvatarFailed(false);
  }), []);

  if (!user) {
    return (
      <Link to="/student-panel" className={styles.primaryButton}>
        <LogIn size={17} />
        <span>Кирүү</span>
      </Link>
    );
  }

  const name = user.displayName || user.email?.split('@')[0] || 'Окуучу';
  return (
    <Link to="/student-panel" className={styles.userChip}>
      {user.photoURL && !avatarFailed ? (
        <img src={user.photoURL} alt="" referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)} />
      ) : (
        <span className={styles.userInitial}>{name.charAt(0).toUpperCase()}</span>
      )}
      <span className={styles.userText}>
        <strong>{name}</strong>
        <small>Жеке кабинет</small>
      </span>
    </Link>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode; footer: React.ReactNode }> = ({ children, footer }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => readStorage(COLLAPSED_KEY, false));
  const [closedGroups, setClosedGroups] = useState<string[]>(() => readStorage(GROUPS_KEY, []));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPath, setLastPath] = useState(location.pathname);

  // Баракча алмашканда мобилдик менюну жабабыз (рендер учурунда, эффектсиз).
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      writeStorage(COLLAPSED_KEY, !prev);
      return !prev;
    });
  };

  const toggleGroup = (key: string) => {
    setClosedGroups((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      writeStorage(GROUPS_KEY, next);
      return next;
    });
  };

  const current = findNavItem(location.pathname);

  // Админ панелдин өз менюсу бар — сайттын сайдбары жана футери анда көрсөтүлбөйт.
  if (location.pathname.startsWith('/admin-panel')) {
    return <>{children}</>;
  }

  return (
    <div className={`${styles.shell} ${collapsed ? styles.shellCollapsed : ''}`}>
      {mobileOpen && <div className={styles.backdrop} onClick={() => setMobileOpen(false)} aria-hidden="true" />}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`} aria-label="Негизги меню">
        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink}>
            <span className={styles.brandMark}>ЗО</span>
            <span className={styles.brandText}>
              <strong>Зайил Ормонов</strong>
              <small>атындагы мектеп</small>
            </span>
          </Link>
          <button type="button" className={styles.closeMobile} onClick={() => setMobileOpen(false)} aria-label="Менюну жабуу">
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <SidebarLink item={HOME_ITEM} collapsed={collapsed} />
          {NAV_GROUPS.map((group) => {
            const hasActive = group.items.some((item) => location.pathname.startsWith(item.path));
            const isClosed = closedGroups.includes(group.key) && !hasActive;
            return (
              <div key={group.key} className={styles.group}>
                <button
                  type="button"
                  className={styles.groupTitle}
                  onClick={() => toggleGroup(group.key)}
                  aria-expanded={!isClosed}
                >
                  <span>{group.title}</span>
                  <ChevronDown size={15} className={isClosed ? styles.chevronClosed : ''} />
                </button>
                {!isClosed && group.items.map((item) => <SidebarLink key={item.path} item={item} collapsed={collapsed} />)}
              </div>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button type="button" className={styles.collapseButton} onClick={toggleCollapsed}>
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            <span>Жыйыштыруу</span>
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button type="button" className={styles.menuButton} onClick={() => setMobileOpen(true)} aria-label="Менюну ачуу">
            <Menu size={21} />
          </button>
          <span className={styles.mobileTitle}>{current?.label ?? 'Зайил Ормонов'}</span>
          <GlobalSearch />
          <div className={styles.topbarActions}>
            <Link to="/admin-panel" className={styles.iconButton} title="Админ панель" aria-label="Админ панель">
              <ShieldCheck size={19} />
            </Link>
            <UserChip />
          </div>
        </header>

        <main className={styles.content}>{children}</main>
        {footer}
      </div>

      <nav className={styles.tabbar} aria-label="Мобилдик навигация">
        {MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
            >
              <Icon size={21} strokeWidth={1.8} />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
        <button type="button" className={`${styles.tab} ${mobileOpen ? styles.tabActive : ''}`} onClick={() => setMobileOpen(true)}>
          <Menu size={21} strokeWidth={1.8} />
          <span>Меню</span>
        </button>
      </nav>
    </div>
  );
};

export default AppLayout;
