import { useState } from 'react';

export default function DebugSequence({ config, onComplete }) {
  const { instruction, puzzles } = config;
  const [pIndex, setPIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [stars, setStars]   = useState(3);
  const [phase, setPhase]   = useState('find'); // 'find' | 'fixed'

  const p = puzzles[pIndex];

  function selectStep(idx) {
    if (phase !== 'find') return;
    setSelected(idx);
    const correct = idx === p.wrongIndex;
    if (correct) {
      setPhase('fixed');
    } else {
      setStars(s => Math.max(1, s - 1));
    }
  }

  function next() {
    setSelected(null);
    setPhase('find');
    if (pIndex + 1 >= puzzles.length) {
      onComplete(stars);
    } else {
      setPIndex(i => i + 1);
    }
  }

  const displaySteps = phase === 'fixed' ? p.fixedSteps : p.steps;

  return (
    <div style={{ padding: '24px 20px' }}>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
        {puzzles.map((_, i) => (
          <div key={i} style={{
            width: i === pIndex ? 20 : 10, height: 10, borderRadius: 5,
            background: i < pIndex ? 'var(--green)' : i === pIndex ? 'var(--purple)' : '#E5E7EB',
          }} />
        ))}
      </div>

      <div style={{
        background: '#EFF6FF', borderRadius: 14, padding: '14px 18px',
        marginBottom: 20, border: '1px solid #BFDBFE',
      }}>
        <p style={{ fontWeight: 700, fontSize: 14, color: '#1D4ED8' }}>🎯 Goal:</p>
        <p style={{ fontSize: 15, marginTop: 4 }}>{p.goal}</p>
      </div>

      <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>
        {phase === 'find' ? '🔊 ' + instruction : '✅ Fixed! Here\'s the correct order:'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {displaySteps.map((step, i) => {
          let bg = '#fff', border = '#E5E7EB', cursor = 'pointer';
          if (phase === 'find') {
            if (selected === i && i === p.wrongIndex) { bg = '#FEE2E2'; border = '#EF4444'; }
            else if (selected === i) { bg = '#FEF2F2'; border = '#FECACA'; }
          } else {
            bg = '#F0FDF4'; border = '#BBF7D0'; cursor = 'default';
          }

          return (
            <button key={i} onClick={() => selectStep(i)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 14,
              background: bg, border: `2px solid ${border}`,
              boxShadow: 'var(--shadow)', cursor, textAlign: 'left',
            }}>
              <span style={{
                width: 26, height: 26, borderRadius: '50%',
                background: phase === 'fixed' ? 'var(--green)' : 'var(--purple)',
                color: '#fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{step}</span>
              {phase === 'fixed' && <span style={{ marginLeft: 'auto' }}>✅</span>}
            </button>
          );
        })}
      </div>

      {phase === 'find' && selected !== null && selected !== p.wrongIndex && (
        <p style={{ textAlign: 'center', color: 'var(--red)', fontWeight: 700, marginTop: 16 }}>
          That's not the wrong step — keep looking! 🔍
        </p>
      )}

      {phase === 'fixed' && (
        <>
          <div style={{
            marginTop: 16, padding: '14px 18px', background: '#F0FDF4',
            borderRadius: 14, border: '1px solid #BBF7D0',
          }}>
            <p style={{ fontWeight: 700, color: 'var(--green)' }}>🧠 Why?</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>{p.explanation}</p>
          </div>
          <button className="btn btn-green" style={{ marginTop: 20 }} onClick={next}>
            {pIndex + 1 < puzzles.length ? 'Next Puzzle →' : 'Finish! 🎉'}
          </button>
        </>
      )}

      <div style={{ marginTop: 20, fontSize: 22 }}>
        {[1,2,3].map(i => <span key={i} style={{ color: i <= stars ? '#FBBF24' : '#D1D5DB' }}>★</span>)}
      </div>
    </div>
  );
}
