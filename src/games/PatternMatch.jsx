import { useState } from 'react';

export default function PatternMatch({ config, onComplete }) {
  const { instruction, sequences } = config;
  const [qIndex, setQIndex]   = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [stars, setStars]      = useState(3);
  const [hints, setHints]      = useState(0);
  const [shake, setShake]      = useState(false);

  const q = sequences[qIndex];

  function choose(choice) {
    if (feedback) return;
    if (choice === q.answer) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        if (qIndex + 1 >= sequences.length) {
          onComplete(stars);
        } else {
          setQIndex(i => i + 1);
        }
      }, 900);
    } else {
      setShake(true);
      setFeedback('wrong');
      setStars(s => Math.max(1, s - 1));
      setTimeout(() => {
        setFeedback(null);
        setShake(false);
      }, 700);
    }
  }

  function useHint() {
    setHints(h => h + 1);
    setStars(s => Math.max(1, s - 1));
    // Flash the correct answer briefly
    setFeedback('hint');
    setTimeout(() => setFeedback(null), 1200);
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
        {sequences.map((_, i) => (
          <div key={i} style={{
            width: i === qIndex ? 20 : 10, height: 10, borderRadius: 5,
            background: i < qIndex ? 'var(--green)' : i === qIndex ? 'var(--purple)' : '#E5E7EB',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Instruction */}
      <p style={{
        textAlign: 'center', fontWeight: 700, fontSize: 18, marginBottom: 28,
        color: 'var(--text)',
      }}>
        🔊 {instruction}
      </p>

      {/* Pattern row */}
      <div className={shake ? 'anim-shake' : ''} style={{
        display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap',
        marginBottom: 32, padding: '20px 0',
        background: feedback === 'correct' ? '#F0FDF4' : feedback === 'wrong' ? '#FEF2F2' : '#F9FAFB',
        borderRadius: 18,
        border: `2px solid ${feedback === 'correct' ? '#BBF7D0' : feedback === 'wrong' ? '#FECACA' : '#E5E7EB'}`,
        transition: 'background 0.3s, border 0.3s',
      }}>
        {q.pattern.map((item, i) => (
          <span key={i} style={{ fontSize: 40 }}>{item}</span>
        ))}
        {/* Blank / answer slot */}
        <span style={{
          fontSize: 40, width: 52, height: 52,
          border: '3px dashed var(--purple-light)',
          borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: feedback === 'correct' ? '#BBF7D0' : feedback === 'hint' ? '#FEF9C3' : 'transparent',
          transition: 'background 0.3s',
        }}>
          {(feedback === 'correct' || feedback === 'hint') ? q.answer : '?'}
        </span>
      </div>

      {/* Feedback message */}
      {feedback === 'correct' && (
        <p style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 800, fontSize: 20, marginBottom: 16 }}>
          ✅ Correct! Great thinking!
        </p>
      )}
      {feedback === 'wrong' && (
        <p style={{ textAlign: 'center', color: 'var(--red)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
          Hmm, try again! 💪
        </p>
      )}

      {/* Choice buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {q.choices.map((c, i) => (
          <button key={i} onClick={() => choose(c)} style={{
            padding: '18px 0', fontSize: 38, borderRadius: 18, textAlign: 'center',
            background: feedback === 'correct' && c === q.answer ? '#D1FAE5'
                       : feedback === 'hint' && c === q.answer ? '#FEF9C3'
                       : '#fff',
            border: `2px solid ${feedback === 'correct' && c === q.answer ? '#10B981'
                                 : feedback === 'hint' && c === q.answer ? '#FBBF24'
                                 : '#E5E7EB'}`,
            boxShadow: 'var(--shadow)', cursor: 'pointer',
            transform: feedback && c === q.answer ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.15s',
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* Stars + Hint */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <div style={{ fontSize: 22 }}>
          {[1,2,3].map(i => (
            <span key={i} style={{ color: i <= stars ? '#FBBF24' : '#D1D5DB' }}>★</span>
          ))}
        </div>
        <button onClick={useHint} style={{
          background: '#FEF9C3', border: '1px solid #FBBF24', borderRadius: 10,
          padding: '8px 16px', fontWeight: 700, color: '#92400E', cursor: 'pointer', fontSize: 14,
        }}>
          💡 Hint (−1⭐)
        </button>
      </div>
    </div>
  );
}
