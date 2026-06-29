import { useState } from 'react';

export default function SortGame({ config, onComplete }) {
  const { instruction, items, categories } = config;
  const [sorted, setSorted] = useState(() => {
    const init = {};
    categories.forEach(c => { init[c.id] = []; });
    return init;
  });
  const [unsorted, setUnsorted] = useState(() =>
    [...items].sort(() => Math.random() - 0.5)
  );
  const [dragging, setDragging] = useState(null); // { from: 'pile'|catId, index }
  const [checked, setChecked]   = useState(false);
  const [stars, setStars]       = useState(3);

  function handleDrop(targetCatId) {
    if (dragging === null) return;
    const { from, index } = dragging;
    let item;
    if (from === 'pile') {
      item = unsorted[index];
      setUnsorted(u => u.filter((_, i) => i !== index));
    } else {
      item = sorted[from][index];
      setSorted(s => ({ ...s, [from]: s[from].filter((_, i) => i !== index) }));
    }
    setSorted(s => ({ ...s, [targetCatId]: [...s[targetCatId], item] }));
    setDragging(null);
    setChecked(false);
  }

  function handleDropPile() {
    if (!dragging || dragging.from === 'pile') return;
    const { from, index } = dragging;
    const item = sorted[from][index];
    setSorted(s => ({ ...s, [from]: s[from].filter((_, i) => i !== index) }));
    setUnsorted(u => [...u, item]);
    setDragging(null);
  }

  function checkAnswer() {
    let wrong = 0;
    categories.forEach(cat => {
      sorted[cat.id].forEach(item => {
        if (item.category !== cat.id) wrong++;
      });
    });
    const isCorrect = wrong === 0 && unsorted.length === 0;
    setChecked(true);
    if (!isCorrect) setStars(s => Math.max(1, s - 1));
    if (isCorrect) setTimeout(() => onComplete(stars), 1200);
  }

  return (
    <div style={{ padding: '24px 16px' }}>
      <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
        🔊 {instruction}
      </p>

      {/* Unsorted pile */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDropPile}
        style={{
          minHeight: 80, background: '#F9FAFB', borderRadius: 14,
          border: '2px dashed #D1D5DB', display: 'flex', flexWrap: 'wrap',
          gap: 10, padding: 14, marginBottom: 20, justifyContent: 'center',
        }}
      >
        {unsorted.length === 0
          ? <p style={{ color: 'var(--muted)', fontSize: 14, margin: 'auto' }}>All sorted! 🎉</p>
          : unsorted.map((item, i) => (
            <span
              key={i}
              draggable
              onDragStart={() => setDragging({ from: 'pile', index: i })}
              style={{
                fontSize: 36, cursor: 'grab', padding: 6,
                borderRadius: 8, background: '#fff', boxShadow: 'var(--shadow)',
                opacity: dragging?.from === 'pile' && dragging?.index === i ? 0.4 : 1,
              }}
            >{item.emoji}</span>
          ))
        }
      </div>

      {/* Category baskets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {categories.map(cat => (
          <div
            key={cat.id}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(cat.id)}
            style={{
              minHeight: 120, background: '#fff', borderRadius: 14,
              border: '2px dashed var(--purple-light)', padding: 12,
              textAlign: 'center', boxShadow: 'var(--shadow)',
            }}
          >
            <div style={{ fontSize: 32 }}>{cat.emoji}</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{cat.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {sorted[cat.id].map((item, i) => {
                const wrong = checked && item.category !== cat.id;
                return (
                  <span
                    key={i}
                    draggable
                    onDragStart={() => setDragging({ from: cat.id, index: i })}
                    style={{
                      fontSize: 28, cursor: 'grab', padding: 4, borderRadius: 8,
                      background: wrong ? '#FEE2E2' : checked ? '#D1FAE5' : '#F9FAFB',
                      border: `1px solid ${wrong ? '#FECACA' : checked ? '#BBF7D0' : '#E5E7EB'}`,
                    }}
                  >{item.emoji}</span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {checked && unsorted.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 800, marginTop: 16, fontSize: 18 }}>
          🎉 All sorted perfectly!
        </p>
      )}
      {checked && unsorted.length > 0 && (
        <p style={{ textAlign: 'center', color: 'var(--red)', fontWeight: 700, marginTop: 16 }}>
          Sort all items into baskets first!
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <div style={{ fontSize: 22 }}>
          {[1,2,3].map(i => <span key={i} style={{ color: i <= stars ? '#FBBF24' : '#D1D5DB' }}>★</span>)}
        </div>
        <button className="btn btn-primary" style={{ width: 'auto', padding: '12px 28px' }}
          onClick={checkAnswer}>
          Check ✓
        </button>
      </div>
    </div>
  );
}
