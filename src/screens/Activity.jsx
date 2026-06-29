import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getState, setState, levelFromStars, updateStreak } from '../store';
import { CURRICULUM, BADGES, checkBadges } from '../data/curriculum';
import TopBar from '../components/TopBar';
import PatternMatch from '../games/PatternMatch';
import SequenceGame from '../games/SequenceGame';
import SortGame from '../games/SortGame';
import OddOneOut from '../games/OddOneOut';
import DebugSequence from '../games/DebugSequence';
import CodingBlocks from '../games/CodingBlocks';

// Find an activity across all tiers/zones/missions
function findActivity(id) {
  for (const tier of Object.values(CURRICULUM)) {
    for (const zone of tier.zones) {
      for (const mission of zone.missions) {
        for (const act of mission.activities) {
          if (act.id === id) return act;
        }
      }
    }
  }
  return null;
}

const GAME_MAP = {
  pattern_match:  PatternMatch,
  sequence:       SequenceGame,
  sort:           SortGame,
  odd_one_out:    OddOneOut,
  debug_sequence: DebugSequence,
  coding_blocks:  CodingBlocks,
};

export default function Activity() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const activity = findActivity(activityId);
  const [result, setResult] = useState(null); // null | { stars, newBadges }

  if (!activity) return (
    <div style={{ padding: 32 }}>
      <p>Activity not found.</p>
      <button className="btn btn-outline" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  function handleComplete(stars) {
    const prev = getState();
    const prevBestStars = prev.activityStars[activity.id] ?? 0;
    const newStars = Math.max(prevBestStars, stars);
    const addedStars = Math.max(0, newStars - prevBestStars);
    const newTotal = prev.totalStars + addedStars;
    const newLevel = levelFromStars(newTotal);

    const activityStars = { ...prev.activityStars, [activity.id]: newStars };
    const updatedState = setState({
      totalStars: newTotal,
      level: newLevel,
      activityStars,
    });
    updateStreak();

    const newBadges = checkBadges(updatedState, prev);
    if (newBadges.length) {
      setState({ earnedBadges: [...updatedState.earnedBadges, ...newBadges] });
    }

    setResult({ stars, addedStars, newLevel, levelUp: newLevel > prev.level, newBadges });
  }

  if (result) {
    return <ResultScreen result={result} activity={activity} navigate={navigate} />;
  }

  const GameComponent = GAME_MAP[activity.type];
  if (!GameComponent) return <div style={{ padding: 32 }}>Game type "{activity.type}" not yet built.</div>;

  return (
    <div style={{ paddingBottom: 20 }}>
      <TopBar title={activity.title} onBack={() => navigate(-1)} />
      <GameComponent config={activity.config} onComplete={handleComplete} />
    </div>
  );
}

// ── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({ result, activity, navigate }) {
  const { stars, addedStars, newLevel, levelUp, newBadges } = result;
  const newBadgeDetails = BADGES.filter(b => newBadges.includes(b.id));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg,#7C3AED,#EC4899)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 32, textAlign: 'center', color: '#fff', gap: 20,
    }}>
      {/* Confetti dots */}
      <Confetti />

      <div style={{ fontSize: 72 }} className="anim-pop">
        {stars === 3 ? '🎉' : stars >= 1 ? '😊' : '💪'}
      </div>

      <h2 style={{ fontWeight: 900, fontSize: 30, lineHeight: 1.1 }}>
        {stars === 3 ? 'Perfect!' : stars >= 1 ? 'Well done!' : 'Keep going!'}
      </h2>

      {/* Stars */}
      <div style={{ display: 'flex', gap: 12, fontSize: 44, justifyContent: 'center' }}>
        {[1,2,3].map(i => (
          <span key={i} style={{
            filter: i <= stars ? 'none' : 'grayscale(1) opacity(0.4)',
            animation: i <= stars ? `pop ${0.2 * i + 0.2}s ease forwards` : 'none',
          }}>⭐</span>
        ))}
      </div>

      {addedStars > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 20px'
        }}>
          +{addedStars} ⭐ star{addedStars !== 1 ? 's' : ''} earned!
        </div>
      )}

      {levelUp && (
        <div style={{
          background: 'var(--yellow)', color: 'var(--text)',
          borderRadius: 14, padding: '14px 24px', fontWeight: 900, fontSize: 18,
        }} className="anim-pop">
          🚀 Level Up! → Level {newLevel}
        </div>
      )}

      {newBadgeDetails.map(badge => (
        <div key={badge.id} style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 14,
          padding: '14px 24px', fontSize: 16,
        }} className="anim-pop">
          {badge.emoji} New badge: <strong>{badge.name}</strong>
        </div>
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300, marginTop: 8 }}>
        <button className="btn btn-yellow" onClick={() => navigate(-1)}>
          Keep Playing 🎮
        </button>
        <button onClick={() => navigate('/home')} style={{
          background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none',
          borderRadius: 50, padding: '12px 24px', fontSize: 16, fontWeight: 700, cursor: 'pointer'
        }}>
          🏠 Go Home
        </button>
      </div>
    </div>
  );
}

function Confetti() {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 60}%`,
    color: ['#FBBF24','#EC4899','#10B981','#3B82F6','#F97316'][i % 5],
    size: 8 + Math.random() * 10,
    delay: Math.random() * 0.5,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.left, top: d.top,
          width: d.size, height: d.size, borderRadius: '50%',
          background: d.color, opacity: 0.7,
          animation: `confetti ${1.5 + d.delay}s ease forwards`,
        }} />
      ))}
    </div>
  );
}
