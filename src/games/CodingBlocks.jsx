import { useState } from 'react';

const BLOCK_LABELS = {
  move_right: '→ Move Right',
  move_left:  '← Move Left',
  move_up:    '↑ Move Up',
  move_down:  '↓ Move Down',
};

const BLOCK_COLORS = {
  move_right: '#3B82F6',
  move_left:  '#8B5CF6',
  move_up:    '#10B981',
  move_down:  '#F97316',
};

const ROBOT = '🤖';
const FLAG  = '🏁';

export default function CodingBlocks({ config, onComplete }) {
  const { instruction, gridSize, startPos, goalPos, availableBlocks, maxBlocks } = config;
  const [program, setProgram]     = useState([]);
  const [robotPos, setRobotPos]   = useState(startPos);
  const [running, setRunning]     = useState(false);
  const [won, setWon]             = useState(false);
  const [crashed, setCrashed]     = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [stars, setStars]         = useState(3);

  function addBlock(type) {
    if (program.length >= maxBlocks || running) return;
    setProgram(p => [...p, type]);
  }

  function removeBlock(i) {
    if (running) return;
    setProgram(p => p.filter((_, idx) => idx !== i));
  }

  async function runProgram() {
    if (running || program.length === 0) return;
    setRunning(true);
    setCrashed(false);
    setWon(false);
    let pos = { ...startPos };
    setRobotPos(pos);

    for (let i = 0; i < program.length; i++) {
      await delay(450);
      setActiveStep(i);
      const next = move(pos, program[i]);
      if (next.x < 0 || next.x >= gridSize || next.y < 0 || next.y >= gridSize) {
        setCrashed(true);
        setStars(s => Math.max(1, s - 1));
        setActiveStep(-1);
        setRunning(false);
        setRobotPos(startPos);
        return;
      }
      pos = next;
      setRobotPos({ ...pos });
      if (pos.x === goalPos.x && pos.y === goalPos.y) {
        setWon(true);
        setActiveStep(-1);
        setRunning(false);
        setTimeout(() => onComplete(stars), 1200);
        return;
      }
    }
    // Ran out of blocks without reaching goal
    setStars(s => Math.max(1, s - 1));
    setActiveStep(-1);
    setRunning(false);
    setRobotPos(startPos);
  }

  function clearProgram() {
    if (running) return;
    setProgram([]);
    setRobotPos(startPos);
    setCrashed(false);
    setWon(false);
    setActiveStep(-1);
  }

  // Build grid cells
  const cells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const isRobot = robotPos.x === x && robotPos.y === y;
      const isGoal  = goalPos.x  === x && goalPos.y  === y;
      cells.push(
        <div key={`${x},${y}`} style={{
          width: `${100/gridSize}%`, aspectRatio: '1',
          border: '1px solid #E5E7EB',
          background: isRobot ? '#EDE9FE' : isGoal ? '#D1FAE5' : (x + y) % 2 === 0 ? '#FAFAFA' : '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: gridSize <= 5 ? 22 : 16, borderRadius: 4,
          position: 'relative',
        }}>
          {isGoal && !isRobot && FLAG}
          {isRobot && (
            <span style={{ animation: running ? 'pulse 0.4s infinite alternate' : 'none' }}>
              {ROBOT}
            </span>
          )}
        </div>
      );
    }
  }

  return (
    <div style={{ padding: '16px' }}>
      <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
        🔊 {instruction}
      </p>

      {/* Grid */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', width: '100%', maxWidth: 300,
        margin: '0 auto 16px', borderRadius: 12, overflow: 'hidden',
        border: `2px solid ${crashed ? '#EF4444' : won ? '#10B981' : '#E5E7EB'}`,
        boxShadow: 'var(--shadow)',
      }}>
        {cells}
      </div>

      {crashed && (
        <p style={{ textAlign: 'center', color: 'var(--red)', fontWeight: 700, marginBottom: 12 }}>
          💥 Oops! The robot went off the grid. Try again!
        </p>
      )}
      {won && (
        <p style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 800, fontSize: 18, marginBottom: 12 }}>
          🎉 Robot reached the flag!
        </p>
      )}

      {/* Program tape */}
      <div style={{
        minHeight: 54, background: '#F9FAFB', borderRadius: 12,
        border: '2px dashed #D1D5DB', display: 'flex', flexWrap: 'wrap',
        gap: 6, padding: 10, marginBottom: 14, alignItems: 'center',
      }}>
        {program.length === 0 && (
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>Drag blocks here… or tap a block below to add it</span>
        )}
        {program.map((block, i) => (
          <button key={i} onClick={() => removeBlock(i)} style={{
            background: BLOCK_COLORS[block], color: '#fff', border: 'none',
            borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700,
            cursor: 'pointer',
            outline: activeStep === i ? '3px solid var(--yellow)' : 'none',
            opacity: activeStep !== -1 && activeStep !== i ? 0.5 : 1,
          }}>
            {BLOCK_LABELS[block]}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12, textAlign: 'center' }}>
        Tap a block in your program to remove it · {program.length}/{maxBlocks} blocks used
      </p>

      {/* Block palette */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        {availableBlocks.map(block => (
          <button key={block} onClick={() => addBlock(block)} style={{
            background: BLOCK_COLORS[block], color: '#fff', border: 'none',
            borderRadius: 10, padding: '10px 14px', fontSize: 14, fontWeight: 700,
            cursor: program.length >= maxBlocks ? 'not-allowed' : 'pointer',
            opacity: program.length >= maxBlocks ? 0.5 : 1,
          }}>
            {BLOCK_LABELS[block]}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-green" style={{ flex: 2 }} onClick={runProgram}
          disabled={running || program.length === 0}>
          {running ? '⏳ Running…' : '▶ Run'}
        </button>
        <button onClick={clearProgram} style={{
          flex: 1, background: '#FEE2E2', color: '#EF4444', border: 'none',
          borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: 15,
        }}>
          🗑 Clear
        </button>
      </div>

      <div style={{ marginTop: 16, fontSize: 22 }}>
        {[1,2,3].map(i => <span key={i} style={{ color: i <= stars ? '#FBBF24' : '#D1D5DB' }}>★</span>)}
      </div>
    </div>
  );
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function move(pos, dir) {
  if (dir === 'move_right') return { x: pos.x + 1, y: pos.y };
  if (dir === 'move_left')  return { x: pos.x - 1, y: pos.y };
  if (dir === 'move_up')    return { x: pos.x,     y: pos.y - 1 };
  if (dir === 'move_down')  return { x: pos.x,     y: pos.y + 1 };
  return pos;
}
