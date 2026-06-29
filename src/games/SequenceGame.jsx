import { useState } from 'react';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SequenceGame({ config, onComplete }) {
  const { instruction, steps } = config;
  const [items, setItems]       = useState(() => shuffle(steps.map((s, i) => ({ ...s, origIndex: i, id: i }))));
  const [dragging, setDragging] = useState(null);
  const [checked, setChecked]   = useState(false);
  const [correct, setCorrect]   = useState(false);
  const [stars, setStars]       = useState(3);
  const [attempts, setAttempts] = useState(0);

  function onDragStart(index) { setDragging(index); }

  function onDrop(targetIndex) {
    if (dragging === null || dragging === targetIndex) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragging, 1);
    newItems.splice(targetIndex, 0, moved);
    setItems(newItems);
    setDragging(null);
    setChecked(false);
  }

  function checkAnswer() {
    const isCorrect = items.every((item, i) => item.origIndex === i);
    setChecked(true);
    setCorrect(isCorrect);
    setAttempts(a => a + 1);
    if (!isCorrect) setStars(s => Math.max(1, s - 1));
    if (isCorrect) {
      setTimeout(() => onComplete(stars), 1200);
    }
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 17, marginBottom: 24 }}>
        🔊 {instruction}
      </p>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Hold and drag to reorder ↕
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 14,
              background: checked
                ? (correct ? '#F0FDF4' : item.origIndex === i ? '#F0FDF4' : '#FEF2F2')
                : '#fff',
              border: `2px solid ${checked
                ? (correct ? '#BBF7D0' : item.origIndex === i ? '#BBF7D0' : '#FECACA')
                : dragging === i ? 'var(--purple)' : '#E5E7EB'}`,
              boxShadow: 'var(--shadow)',
              cursor: 'grab',
              opacity: dragging === i ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            <span style={{
              width: 28, height: 28, borderRadius: '50%', background: 'var(--purple)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, flexShrink: 0,
            }}>{i + 1}</span>
            <span style={{ fontSize: 28 }}>{item.emoji}</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</span>
            {checked && (
              <span style={{ marginLeft: 'auto', fontSize: 18 }}>
                {item.origIndex === i ? '✅' : '❌'}
              </span>
            )}
          </div>
        ))}
      </div>

      {checked && !correct && (
        <p style={{ textAlign: 'center', color: 'var(--red)', fontWeight: 700, marginTop: 16 }}>
          Not quite — try rearranging! 💪
        </p>
      )}
      {checked && correct && (
        <p style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 800, fontSize: 18, marginTop: 16 }}>
          🎉 Perfect order!
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <div style={{ fontSize: 22 }}>
          {[1,2,3].map(i => <span key={i} style={{ color: i <= stars ? '#FBBF24' : '#D1D5DB' }}>★</span>)}
        </div>
        {!correct && (
          <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 28px' }}
            onClick={checkAnswer}>
            Check ✓
          </button>
        )}
      </div>
    </div>
  );
}
