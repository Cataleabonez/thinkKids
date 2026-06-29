import { getState } from '../store';

export default function TopBar({ onBack, title }) {
  const { totalStars, level, streakDays, avatarId } = getState();
  const avatarMap = { bear:'🐻', fox:'🦊', frog:'🐸', octopus:'🐙', butterfly:'🦋', robot:'🤖' };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'var(--purple)',
      color: '#fff',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
            borderRadius: '50%', width: 34, height: 34, fontSize: 18, cursor: 'pointer'
          }}>←</button>
        )}
        <span style={{ fontSize: 22 }}>{avatarMap[avatarId] ?? '🦊'}</span>
        {title && <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14, fontWeight: 700 }}>
        <span>⭐ {totalStars}</span>
        <span>🔥 {streakDays}d</span>
        <span style={{
          background: 'var(--yellow)', color: 'var(--text)',
          borderRadius: 50, padding: '2px 10px'
        }}>Lv.{level}</span>
      </div>
    </div>
  );
}
