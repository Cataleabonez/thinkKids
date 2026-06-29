import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getState, setState, resetState } from '../store';
import { BADGES, CURRICULUM } from '../data/curriculum';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [state, set] = useState(getState());
  const [pinInput, setPinInput]   = useState('');
  const [unlocked, setUnlocked]   = useState(false);
  const [pinError, setPinError]   = useState(false);
  const [settingPin, setSettingPin] = useState(false);
  const [newPin, setNewPin]       = useState('');

  useEffect(() => { set(getState()); }, []);

  const { parentPin, childName, ageTier, totalStars, level, streakDays,
          earnedBadges, activityStars } = state;

  // Calculate skill scores from activity stars
  function calcSkills() {
    const curriculum = CURRICULUM[ageTier];
    if (!curriculum) return [];
    const tagScores = {};
    const tagCounts = {};
    curriculum.zones.forEach(zone =>
      zone.missions.forEach(mission =>
        mission.activities.forEach(act => {
          const s = activityStars[act.id] ?? 0;
          const tag = act.type;
          tagScores[tag] = (tagScores[tag] ?? 0) + s;
          tagCounts[tag] = (tagCounts[tag] ?? 0) + 3; // max 3 per activity
        })
      )
    );
    return Object.keys(tagScores).map(tag => ({
      tag,
      pct: tagCounts[tag] ? Math.round((tagScores[tag] / tagCounts[tag]) * 100) : 0,
    })).sort((a, b) => b.pct - a.pct);
  }

  const skills = calcSkills();
  const totalActivities = (() => {
    const c = CURRICULUM[ageTier];
    if (!c) return 0;
    return c.zones.flatMap(z => z.missions.flatMap(m => m.activities)).length;
  })();
  const completedActivities = Object.values(activityStars).filter(s => s > 0).length;

  const TAG_NAMES = {
    pattern_match:  'Pattern Matching',
    sequence:       'Sequencing',
    sort:           'Sorting',
    odd_one_out:    'Logic Puzzles',
    debug_sequence: 'Debugging',
    coding_blocks:  'Coding Blocks',
  };

  function tryUnlock() {
    if (!parentPin || pinInput === parentPin) {
      setUnlocked(true);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1500);
    }
  }

  function savePin() {
    if (newPin.length === 4) {
      setState({ parentPin: newPin });
      set(getState());
      setSettingPin(false);
      setNewPin('');
    }
  }

  function handleReset() {
    if (window.confirm('This will delete all progress and restart the app. Are you sure?')) {
      resetState();
      navigate('/');
    }
  }

  // ── PIN gate ──────────────────────────────────────────────────────────────
  if (!unlocked) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20,
      background: 'var(--bg)',
    }}>
      <div style={{ fontSize: 56 }}>👤</div>
      <h2 style={{ fontWeight: 900, fontSize: 26 }}>Parent Dashboard</h2>
      <p style={{ color: 'var(--muted)', textAlign: 'center' }}>
        {parentPin ? 'Enter your 4-digit PIN to continue.' : 'No PIN set — tap Continue to access.'}
      </p>
      {parentPin ? (
        <>
          <input
            type="password" inputMode="numeric" maxLength={4}
            placeholder="• • • •"
            value={pinInput} onChange={e => setPinInput(e.target.value)}
            style={{
              textAlign: 'center', fontSize: 28, letterSpacing: 10,
              padding: '14px 20px', borderRadius: 14, width: 180,
              border: `2px solid ${pinError ? 'var(--red)' : '#E5E7EB'}`,
              outline: 'none', fontFamily: 'inherit',
            }}
          />
          {pinError && <p style={{ color: 'var(--red)', fontWeight: 700 }}>Incorrect PIN</p>}
        </>
      ) : null}
      <button className="btn btn-primary" style={{ maxWidth: 260 }} onClick={tryUnlock}>
        Continue →
      </button>
      <button onClick={() => navigate('/home')} style={{
        background: 'none', border: 'none', color: 'var(--muted)',
        fontWeight: 600, cursor: 'pointer', fontSize: 15,
      }}>← Back to game</button>
    </div>
  );

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#1E1B4B,#7C3AED)',
        padding: '28px 20px 24px', color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ opacity: 0.7, fontSize: 13 }}>Viewing progress for</p>
            <h2 style={{ fontWeight: 900, fontSize: 24, marginTop: 4 }}>{childName}</h2>
            <p style={{ opacity: 0.8, fontSize: 14 }}>Level {level} · {ageTier} tier</p>
          </div>
          <button onClick={() => navigate('/home')} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
            borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontWeight: 700,
          }}>← Game</button>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { emoji: '⭐', label: 'Total Stars', value: totalStars },
            { emoji: '🏆', label: 'Level', value: level },
            { emoji: '🔥', label: 'Day Streak', value: `${streakDays} days` },
            { emoji: '✅', label: 'Activities Done', value: `${completedActivities}/${totalActivities}` },
            { emoji: '🥇', label: 'Badges Earned', value: `${earnedBadges.length}/${BADGES.length}` },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
              <div style={{ fontSize: 28 }}>{s.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginTop: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="card">
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>📊 Skills Breakdown</h3>
          {skills.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No activities completed yet.</p>
          )}
          {skills.map(s => (
            <div key={s.tag} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                <span>{TAG_NAMES[s.tag] ?? s.tag}</span>
                <span style={{ color: s.pct >= 70 ? 'var(--green)' : s.pct >= 40 ? 'var(--orange)' : 'var(--red)' }}>
                  {s.pct}%
                </span>
              </div>
              <div style={{ height: 10, background: '#E5E7EB', borderRadius: 5 }}>
                <div style={{
                  height: '100%', borderRadius: 5,
                  background: s.pct >= 70 ? 'var(--green)' : s.pct >= 40 ? 'var(--orange)' : 'var(--red)',
                  width: `${s.pct}%`, transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}
          {skills.length > 0 && (
            <div style={{ marginTop: 8, padding: '12px 14px', background: '#F9FAFB', borderRadius: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text)' }}>
                <strong>Strength:</strong> {TAG_NAMES[skills[0]?.tag] ?? '—'}
              </p>
              {skills.length > 1 && (
                <p style={{ fontSize: 13, color: 'var(--text)', marginTop: 4 }}>
                  <strong>Focus area:</strong> {TAG_NAMES[skills[skills.length - 1]?.tag] ?? '—'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="card">
          <h3 style={{ fontWeight: 800, marginBottom: 12 }}>🏅 Badges Earned</h3>
          {earnedBadges.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No badges yet — keep playing!</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {BADGES.filter(b => earnedBadges.includes(b.id)).map(b => (
                <div key={b.id} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 4, padding: '10px 14px', background: '#FFF9F0',
                  borderRadius: 12, border: '1px solid #FBBF24', minWidth: 70,
                }}>
                  <span style={{ fontSize: 28 }}>{b.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', color: 'var(--text)' }}>{b.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="card">
          <h3 style={{ fontWeight: 800, marginBottom: 14 }}>⚙️ Settings</h3>

          {/* Set PIN */}
          {!settingPin ? (
            <button onClick={() => setSettingPin(true)} style={{
              width: '100%', padding: '12px', background: '#F3F4F6', border: '1px solid #E5E7EB',
              borderRadius: 10, fontWeight: 700, cursor: 'pointer', marginBottom: 10, fontSize: 15,
            }}>
              🔐 {parentPin ? 'Change PIN' : 'Set Parent PIN'}
            </button>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Enter new 4-digit PIN:</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password" inputMode="numeric" maxLength={4}
                  placeholder="• • • •" value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  style={{
                    flex: 1, padding: '12px', fontSize: 20, textAlign: 'center',
                    borderRadius: 10, border: '2px solid var(--purple)', outline: 'none',
                    fontFamily: 'inherit', letterSpacing: 8,
                  }}
                />
                <button onClick={savePin} style={{
                  background: 'var(--green)', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '12px 18px', fontWeight: 700, cursor: 'pointer',
                }}>Save</button>
                <button onClick={() => setSettingPin(false)} style={{
                  background: '#E5E7EB', border: 'none', borderRadius: 10,
                  padding: '12px 14px', cursor: 'pointer',
                }}>✕</button>
              </div>
            </div>
          )}

          {/* Reset */}
          <button onClick={handleReset} style={{
            width: '100%', padding: '12px', background: '#FEE2E2', border: '1px solid #FECACA',
            borderRadius: 10, fontWeight: 700, cursor: 'pointer', color: 'var(--red)', fontSize: 15,
          }}>
            🗑 Reset All Progress
          </button>
        </div>

      </div>
    </div>
  );
}
