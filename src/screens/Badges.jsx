import { useState, useEffect } from 'react';
import { getState } from '../store';
import { BADGES } from '../data/curriculum';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function Badges() {
  const [state, set] = useState(getState());
  useEffect(() => { set(getState()); }, []);
  const { earnedBadges } = state;

  const earned  = BADGES.filter(b => earnedBadges.includes(b.id));
  const locked  = BADGES.filter(b => !earnedBadges.includes(b.id));

  return (
    <div style={{ paddingBottom: 80 }}>
      <TopBar title="Badges" />
      <div style={{ padding: '20px 16px' }}>
        <div style={{
          background: 'linear-gradient(135deg,#FBBF24,#F97316)',
          borderRadius: 18, padding: '20px', marginBottom: 24, textAlign: 'center', color: '#fff'
        }}>
          <div style={{ fontSize: 48 }}>🏆</div>
          <h2 style={{ fontWeight: 900, marginTop: 8 }}>{earned.length} / {BADGES.length} Badges</h2>
          <p style={{ opacity: 0.85, fontSize: 14 }}>Keep playing to unlock them all!</p>
        </div>

        {earned.length > 0 && (
          <>
            <h3 style={{ fontWeight: 800, marginBottom: 12 }}>✅ Earned</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {earned.map(b => <BadgeRow key={b.id} badge={b} earned />)}
            </div>
          </>
        )}

        <h3 style={{ fontWeight: 800, marginBottom: 12 }}>🔒 Locked</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {locked.map(b => <BadgeRow key={b.id} badge={b} />)}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function BadgeRow({ badge, earned }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px', borderRadius: 14,
      background: earned ? '#fff' : '#F9FAFB',
      border: `2px solid ${earned ? '#FBBF24' : '#E5E7EB'}`,
      boxShadow: earned ? 'var(--shadow)' : 'none',
      opacity: earned ? 1 : 0.6,
    }}>
      <span style={{ fontSize: 36, filter: earned ? 'none' : 'grayscale(1)' }}>{badge.emoji}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 15 }}>{badge.name}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{badge.desc}</div>
      </div>
      {earned && <span style={{ marginLeft: 'auto', color: '#FBBF24', fontSize: 20 }}>★</span>}
    </div>
  );
}
