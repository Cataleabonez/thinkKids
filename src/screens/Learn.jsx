import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getState } from '../store';
import { CURRICULUM } from '../data/curriculum';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function Learn() {
  const navigate = useNavigate();
  const { zoneId } = useParams();
  const [state, set] = useState(getState());

  useEffect(() => { set(getState()); }, []);

  const { ageTier, activityStars } = state;
  const curriculum = CURRICULUM[ageTier];

  // If no zoneId in URL, show all zones
  if (!zoneId) {
    return (
      <div style={{ paddingBottom: 80 }}>
        <TopBar title="Learn" />
        <div style={{ padding: '20px 16px' }}>
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>📚 All Zones</h3>
          {curriculum?.zones.map((zone, zi) => {
            const all = zone.missions.flatMap(m => m.activities);
            const done = all.filter(a => (activityStars[a.id] ?? 0) > 0).length;
            const pct = all.length ? Math.round((done / all.length) * 100) : 0;
            const locked = zone.locked && done === 0;
            return (
              <button key={zone.id} onClick={locked ? undefined : () => navigate(`/learn/${zone.id}`)}
                style={{
                  width: '100%', background: locked ? '#F3F4F6' : '#fff',
                  borderRadius: 18, padding: '18px 20px', marginBottom: 14,
                  border: `2px solid ${locked ? '#E5E7EB' : zone.color}`,
                  boxShadow: locked ? 'none' : 'var(--shadow)', cursor: locked ? 'default' : 'pointer',
                  textAlign: 'left', opacity: locked ? 0.6 : 1,
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                <span style={{ fontSize: 36 }}>{locked ? '🔒' : zone.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800 }}>Zone {zi + 1}: {zone.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{done}/{all.length} activities · {pct}%</div>
                  {!locked && (
                    <div style={{ marginTop: 6, height: 6, background: '#E5E7EB', borderRadius: 3 }}>
                      <div style={{ height: '100%', borderRadius: 3, background: zone.color, width: `${pct}%` }} />
                    </div>
                  )}
                </div>
                {!locked && <span style={{ color: zone.color, fontSize: 20 }}>›</span>}
              </button>
            );
          })}
        </div>
        <BottomNav />
      </div>
    );
  }

  // Zone detail view
  const zone = curriculum?.zones.find(z => z.id === zoneId);
  if (!zone) return <div style={{ padding: 32 }}>Zone not found.</div>;

  return (
    <div style={{ paddingBottom: 80 }}>
      <TopBar title={zone.name} onBack={() => navigate('/learn')} />
      <div style={{
        background: zone.color, padding: '20px 16px 24px', color: '#fff', textAlign: 'center'
      }}>
        <div style={{ fontSize: 48 }}>{zone.emoji}</div>
        <h2 style={{ fontWeight: 900, marginTop: 8 }}>{zone.name}</h2>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {zone.missions.map((mission, mi) => (
          <MissionCard key={mission.id} mission={mission} missionIndex={mi}
            activityStars={activityStars} zoneColor={zone.color} navigate={navigate} />
        ))}
      </div>
      <BottomNav />
    </div>
  );
}

function MissionCard({ mission, missionIndex, activityStars, zoneColor, navigate }) {
  const [open, setOpen] = useState(missionIndex === 0);
  const done = mission.activities.filter(a => (activityStars[a.id] ?? 0) > 0).length;

  return (
    <div style={{ marginBottom: 16, background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'none', border: 'none', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontSize: 28 }}>{mission.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800 }}>Mission {missionIndex + 1}: {mission.title}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{done}/{mission.activities.length} complete</div>
        </div>
        <span style={{ fontSize: 18, color: 'var(--muted)' }}>{open ? '▾' : '›'}</span>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #F3F4F6' }}>
          {mission.activities.map((activity, ai) => {
            const stars = activityStars[activity.id] ?? 0;
            const prevDone = ai === 0 || (activityStars[mission.activities[ai-1].id] ?? 0) > 0;
            const locked = !prevDone && ai !== 0;
            return (
              <button key={activity.id}
                onClick={locked ? undefined : () => navigate(`/activity/${activity.id}`)}
                style={{
                  width: '100%', marginTop: 10, padding: '14px 16px',
                  background: locked ? '#F9FAFB' : stars > 0 ? '#F0FDF4' : '#FAFAFA',
                  borderRadius: 14, border: `1px solid ${locked ? '#E5E7EB' : stars > 0 ? '#BBF7D0' : '#E5E7EB'}`,
                  display: 'flex', alignItems: 'center', gap: 12, cursor: locked ? 'default' : 'pointer',
                  opacity: locked ? 0.5 : 1, textAlign: 'left',
                }}>
                <span style={{ fontSize: 22 }}>
                  {locked ? '🔒' : stars > 0 ? '✅' : '▶️'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{activity.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'capitalize' }}>
                    {activity.type.replace(/_/g, ' ')}
                  </div>
                </div>
                <div style={{ fontSize: 16 }}>
                  {[1,2,3].map(i => (
                    <span key={i} style={{ color: i <= stars ? '#FBBF24' : '#D1D5DB' }}>★</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
