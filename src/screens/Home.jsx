import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getState, levelFromStars, starsForNextLevel } from '../store';
import { CURRICULUM, AVATARS } from '../data/curriculum';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const [state, setState2] = useState(getState());

  useEffect(() => { setState2(getState()); }, []);

  const { childName, ageTier, avatarId, totalStars, level, streakDays } = state;
  const avatar = AVATARS.find(a => a.id === avatarId) ?? AVATARS[1];
  const curriculum = CURRICULUM[ageTier];
  const starsToNext = starsForNextLevel(level);
  const progressPct = Math.min((totalStars / starsToNext) * 100, 100);

  return (
    <div style={{ paddingBottom: 80 }}>
      <TopBar />

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
        padding: '24px 20px 28px',
        color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 64 }} className="anim-bounce">{avatar.emoji}</div>
          <div>
            <p style={{ fontSize: 14, opacity: 0.8 }}>Hello,</p>
            <h2 style={{ fontSize: 26, fontWeight: 900 }}>{childName || 'Explorer'}! 👋</h2>
            <p style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{curriculum?.label}</p>
          </div>
        </div>

        {/* Level progress bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, opacity: 0.9 }}>
            <span>Level {level}</span>
            <span>{totalStars} / {starsToNext} ⭐ to Level {level + 1}</span>
          </div>
          <div style={{ height: 10, background: 'rgba(255,255,255,0.3)', borderRadius: 5 }}>
            <div style={{
              height: '100%', borderRadius: 5,
              background: 'var(--yellow)',
              width: `${progressPct}%`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, padding: '16px 16px 0' }}>
        {[
          { emoji: '⭐', value: totalStars, label: 'Stars' },
          { emoji: '🔥', value: `${streakDays}d`, label: 'Streak' },
          { emoji: '🏆', value: `Lv.${level}`, label: 'Level' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: '#fff', borderRadius: 14, padding: '14px 0',
            textAlign: 'center', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 24 }}>{s.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* World Map */}
      <div style={{ padding: '20px 16px 0' }}>
        <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🗺️ Your World</h3>
        {curriculum?.zones.map((zone, zi) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            zoneIndex={zi}
            activityStars={state.activityStars}
            onClick={() => navigate(`/learn/${zone.id}`)}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

function ZoneCard({ zone, zoneIndex, activityStars, onClick }) {
  const allActivities = zone.missions.flatMap(m => m.activities);
  const completedCount = allActivities.filter(a => (activityStars[a.id] ?? 0) > 0).length;
  const isLocked = zone.locked && completedCount === 0;
  const pct = allActivities.length > 0 ? Math.round((completedCount / allActivities.length) * 100) : 0;

  return (
    <button onClick={isLocked ? undefined : onClick} style={{
      width: '100%', background: isLocked ? '#F3F4F6' : '#fff',
      borderRadius: 18, padding: '18px 20px', marginBottom: 14,
      border: `2px solid ${isLocked ? '#E5E7EB' : zone.color}`,
      boxShadow: isLocked ? 'none' : 'var(--shadow)',
      cursor: isLocked ? 'default' : 'pointer',
      textAlign: 'left', opacity: isLocked ? 0.6 : 1,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, fontSize: 28,
        background: isLocked ? '#E5E7EB' : zone.color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isLocked ? '🔒' : zone.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>
          Zone {zoneIndex + 1}: {zone.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
          {zone.missions.length} missions · {allActivities.length} activities
        </div>
        {!isLocked && (
          <div style={{ marginTop: 8, height: 6, background: '#E5E7EB', borderRadius: 3 }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: zone.color,
              width: `${pct}%`,
            }} />
          </div>
        )}
      </div>
      {!isLocked && (
        <span style={{ color: zone.color, fontSize: 20 }}>›</span>
      )}
    </button>
  );
}
