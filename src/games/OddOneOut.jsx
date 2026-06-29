import { useState } from 'react';

export default function OddOneOut({ config, onComplete }) {
  const { instruction, puzzles } = config;
  const [qIndex, setQIndex]     = useState(0);
  const [selected, setSelected] = useState(null);
  const [stars, setStars]       = useState(3);

  const q = puzzles[qIndex];

  function choose(item) {
    if (selected) return;
    setSelected(item);
    const correct = item === q.answer;
    if (!correct) setStars(s => Math.max(1, s - 1));
    setTimeout(() => {
      setSelected(null);
      if (qIndex + 1 >= puzzles.length) {
        onComplete(stars);
      } else {
        setQIndex(i => i + 1);
      }
    }, 1400);
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
        {puzzles.map((_, i) => (
          <div key={i} style={{
            width: i === qIndex ? 20 : 10, height: 10, borderRadius: 5,
            background: i < qIndex ? 'var(--green)' : i === qIndex ? 'var(--purple)' : '#E5E7EB',
          }} />
        ))}
      </div>

      <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, marginBottom: 28 }}>
        🔊 {instruction}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {q.items.map((item, i) => {
          const isAnswer  = item === q.answer;
          const isChosen  = selected === item;
          let bg = '#fff', border = '#E5E7EB';

          if (selected) {
            if (isAnswer)                    { bg = '#D1FAE5'; border = '#10B981'; }
            else if (isChosen && !isAnswer)  { bg = '#FEE2E2'; border = '#EF4444'; }
          }

          return (
            <button key={i} onClick={() => choose(item)} style={{
              padding: '22px 0', fontSize: 44, borderRadius: 18, textAlign: 'center',
              background: bg, border: `2px solid ${border}`,
              boxShadow: 'var(--shadow)', cursor: selected ? 'default' : 'pointer',
              transition: 'all 0.2s',
              transform: isChosen && selected && !isAnswer ? 'scale(0.95)' : 'scale(1)',
            }}>
              {item}
            </button>
          );
        })}
      </div>

      {selected && (
        <div style={{
          marginTop: 20, padding: '14px 18px',
          background: selected === q.answer ? '#F0FDF4' : '#FEF2F2',
          borderRadius: 14, textAlign: 'center',
          border: `1px solid ${selected === q.answer ? '#BBF7D0' : '#FECACA'}`,
        }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: selected === q.answer ? 'var(--green)' : 'var(--red)' }}>
            {selected === q.answer ? '✅ Correct!' : '❌ Not quite!'}
          </p>
          <p style={{ fontSize: 14, color: 'var(--text)', marginTop: 6 }}>
            💡 {q.reason}
          </p>
        </div>
      )}

      <div style={{ marginTop: 24, fontSize: 22 }}>
        {[1,2,3].map(i => <span key={i} style={{ color: i <= stars ? '#FBBF24' : '#D1D5DB' }}>★</span>)}
      </div>
    </div>
  );
}
