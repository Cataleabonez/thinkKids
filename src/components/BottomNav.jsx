import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { path: '/home',    emoji: '🏠', label: 'Home'   },
  { path: '/learn',   emoji: '📚', label: 'Learn'  },
  { path: '/badges',  emoji: '🏆', label: 'Badges' },
  { path: '/parent',  emoji: '👤', label: 'Parent' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: '#fff',
      borderTop: '1px solid #E5E7EB',
      display: 'flex',
      zIndex: 20,
    }}>
      {TABS.map(tab => {
        const active = pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, padding: '10px 0', background: 'none', border: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: active ? 'var(--purple)' : 'var(--muted)',
              fontWeight: active ? 700 : 400,
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.emoji}</span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
