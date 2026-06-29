import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setState, tierFromAge, updateStreak } from '../store';
import { AVATARS } from '../data/curriculum';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep]         = useState(0); // 0=welcome 1=name 2=age 3=avatar 4=done
  const [name, setName]         = useState('');
  const [age, setAge]           = useState(null);
  const [avatarId, setAvatarId] = useState('fox');

  function finish() {
    const ageTier = tierFromAge(age);
    setState({ childName: name, age, ageTier, avatarId, onboarded: true });
    updateStreak();
    navigate('/home');
  }

  // ── Step 0: Welcome ──────────────────────────────────────────────────────
  if (step === 0) return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(160deg,#7C3AED,#EC4899)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 32, gap: 24, textAlign: 'center',
    }}>
      <div style={{ fontSize: 80 }} className="anim-bounce">🌟</div>
      <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 900, lineHeight: 1.1 }}>
        ThinkKids
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, maxWidth: 280 }}>
        Think. Play. Build.
      </p>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
        A learning adventure for ages 4–10
      </p>
      <button className="btn btn-yellow" style={{ marginTop: 16, maxWidth: 260 }}
        onClick={() => setStep(1)}>
        Let's Begin! 🚀
      </button>
    </div>
  );

  // ── Step 1: Name ─────────────────────────────────────────────────────────
  if (step === 1) return (
    <div style={{ minHeight: '100vh', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <StepHeader step={1} total={3} onBack={() => setStep(0)} />
      <h2 style={{ fontSize: 26, fontWeight: 800 }}>What's your child's name?</h2>
      <input
        type="text"
        placeholder="e.g. Ava"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{
          padding: '14px 18px', fontSize: 18, borderRadius: 14,
          border: '2px solid var(--purple-light)', outline: 'none',
          fontFamily: 'inherit',
        }}
        maxLength={20}
        autoFocus
      />
      <button className="btn btn-primary" disabled={!name.trim()}
        style={{ opacity: name.trim() ? 1 : 0.5, marginTop: 8 }}
        onClick={() => setStep(2)}>
        Next →
      </button>
    </div>
  );

  // ── Step 2: Age ───────────────────────────────────────────────────────────
  if (step === 2) return (
    <div style={{ minHeight: '100vh', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <StepHeader step={2} total={3} onBack={() => setStep(1)} />
      <h2 style={{ fontSize: 26, fontWeight: 800 }}>How old is {name}?</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {[4,5,6,7,8,9,10].map(a => (
          <button key={a} onClick={() => setAge(a)} style={{
            padding: '18px 0', borderRadius: 14, fontSize: 22, fontWeight: 800,
            background: age === a ? 'var(--purple)' : '#fff',
            color: age === a ? '#fff' : 'var(--text)',
            border: `2px solid ${age === a ? 'var(--purple)' : '#E5E7EB'}`,
            boxShadow: age === a ? '0 4px 0 var(--purple-dark)' : 'var(--shadow)',
            cursor: 'pointer',
          }}>{a}</button>
        ))}
      </div>
      {age && (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Learning path: <strong style={{ color: 'var(--purple)' }}>
            {age <= 5 ? 'Explorers World (4–5)' : age <= 8 ? "Problem Solvers Island (6–8)" : 'Code Builders Academy (9–10)'}
          </strong>
        </p>
      )}
      <button className="btn btn-primary" disabled={!age}
        style={{ opacity: age ? 1 : 0.5, marginTop: 8 }}
        onClick={() => setStep(3)}>
        Next →
      </button>
    </div>
  );

  // ── Step 3: Avatar ────────────────────────────────────────────────────────
  if (step === 3) return (
    <div style={{ minHeight: '100vh', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <StepHeader step={3} total={3} onBack={() => setStep(2)} />
      <h2 style={{ fontSize: 26, fontWeight: 800 }}>Pick {name}'s character!</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {AVATARS.map(av => (
          <button key={av.id} onClick={() => setAvatarId(av.id)} style={{
            padding: '20px 0 12px', borderRadius: 18, display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: 6,
            background: avatarId === av.id ? 'var(--purple)' : '#fff',
            color: avatarId === av.id ? '#fff' : 'var(--text)',
            border: `2px solid ${avatarId === av.id ? 'var(--purple)' : '#E5E7EB'}`,
            boxShadow: avatarId === av.id ? '0 4px 0 var(--purple-dark)' : 'var(--shadow)',
            cursor: 'pointer', fontSize: 36,
            transform: avatarId === av.id ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.15s',
          }}>
            {av.emoji}
            <span style={{ fontSize: 13, fontWeight: 700 }}>{av.name}</span>
          </button>
        ))}
      </div>
      <button className="btn btn-yellow" style={{ marginTop: 8 }} onClick={finish}>
        Let's Go! 🎉
      </button>
    </div>
  );
}

function StepHeader({ step, total, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onBack} style={{
        background: '#F3F4F6', border: 'none', borderRadius: '50%',
        width: 36, height: 36, fontSize: 18, cursor: 'pointer'
      }}>←</button>
      <div style={{ flex: 1, height: 8, background: '#E5E7EB', borderRadius: 4 }}>
        <div style={{
          height: '100%', borderRadius: 4,
          background: 'var(--purple)',
          width: `${(step / total) * 100}%`,
          transition: 'width 0.3s',
        }} />
      </div>
      <span style={{ color: 'var(--muted)', fontSize: 13 }}>{step}/{total}</span>
    </div>
  );
}
