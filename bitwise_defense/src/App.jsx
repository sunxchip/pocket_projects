import { useCallback, useEffect, useRef, useState } from 'react';
import HelpModal from './components/HelpModal.jsx';
import { applyOp, OPS, parseOperand, toBinary, toHex } from './game/bitOps.js';
import { bitsForLevel, createEnemy, spawnIntervalForLevel, speedForLevel } from './game/enemyFactory.js';
import './App.css';

const MAX_HP = 7;
const LEVEL_UP_SCORE = 1500;
const FLOOR_Y = 90; // percent of play-field height where the "danger line" sits

function formatEnemyValue(enemy) {
  switch (enemy.displayFormat) {
    case 'hex':
      return toHex(enemy.value, enemy.bits);
    case 'bin':
      return toBinary(enemy.value, enemy.bits);
    default:
      return String(enemy.value);
  }
}

export default function App() {
  const [enemies, setEnemies] = useState([]);
  const [targetId, setTargetId] = useState(null);
  const [op, setOp] = useState('XOR');
  const [operand, setOperand] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [hp, setHp] = useState(MAX_HP);
  const [gameOver, setGameOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [flash, setFlash] = useState(null); // { id, kind: 'crush' | 'error' }

  const fieldRef = useRef(null);
  const stateRef = useRef({ level });
  stateRef.current = { level };

  const target = enemies.find((e) => e.id === targetId) || null;
  const bits = bitsForLevel(level);

  // --- spawning -------------------------------------------------------
  useEffect(() => {
    if (gameOver) return undefined;
    const interval = setInterval(() => {
      setEnemies((prev) => [...prev, createEnemy(stateRef.current.level, 5 + Math.random() * 85)]);
    }, spawnIntervalForLevel(level));
    return () => clearInterval(interval);
  }, [level, gameOver]);

  // --- main animation loop --------------------------------------------
  useEffect(() => {
    if (gameOver) return undefined;
    let rafId;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const speed = speedForLevel(stateRef.current.level);
      const fieldHeight = fieldRef.current?.clientHeight || 600;
      const deltaPercent = ((speed * dt) / fieldHeight) * 100;

      setEnemies((prev) => {
        const survivors = [];
        let hpLost = 0;
        for (const enemy of prev) {
          const nextY = enemy.y + deltaPercent;
          if (nextY >= FLOOR_Y) {
            hpLost += 1;
          } else {
            survivors.push({ ...enemy, y: nextY });
          }
        }
        if (hpLost > 0) {
          setHp((h) => Math.max(0, h - hpLost));
        }
        return survivors;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [gameOver]);

  // --- HP / level / game-over watchers ----------------------------------
  useEffect(() => {
    if (hp <= 0) setGameOver(true);
  }, [hp]);

  useEffect(() => {
    const expectedLevel = Math.floor(score / LEVEL_UP_SCORE) + 1;
    if (expectedLevel !== level) setLevel(expectedLevel);
  }, [score, level]);

  const restart = useCallback(() => {
    setEnemies([]);
    setTargetId(null);
    setOp('XOR');
    setOperand('');
    setScore(0);
    setLevel(1);
    setHp(MAX_HP);
    setGameOver(false);
  }, []);

  // --- attack resolution -------------------------------------------------
  const operandNeeded = !OPS[op].unary;
  const parsedOperand = operandNeeded ? parseOperand(operand) : 0;
  const operandValid = !operandNeeded || parsedOperand !== null;
  const previewResult = target && operandValid ? applyOp(op, target.value, parsedOperand ?? 0, target.bits) : null;

  const handleApply = () => {
    if (!target || !operandValid) {
      setFlash({ id: target?.id ?? 'none', kind: 'error' });
      setTimeout(() => setFlash(null), 250);
      return;
    }
    const result = applyOp(op, target.value, parsedOperand ?? 0, target.bits);
    if (result === 0) {
      setScore((s) => s + 150);
      setFlash({ id: target.id, kind: 'crush' });
      setEnemies((prev) => prev.filter((e) => e.id !== target.id));
      setTargetId(null);
      setOperand('');
      setTimeout(() => setFlash(null), 300);
    } else {
      setEnemies((prev) => prev.map((e) => (e.id === target.id ? { ...e, value: result } : e)));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleApply();
  };

  return (
    <div className="game-shell">
      <header className="hud">
        <div className="hud-stat">
          <span className="hud-label">SCORE</span>
          <span className="hud-value score">{score.toLocaleString()}</span>
        </div>
        <div className="hud-stat">
          <span className="hud-label">LEVEL</span>
          <span className="hud-value level">{level} ({bits}-BIT)</span>
        </div>
        <div className="hud-stat hp-stat">
          <span className="hud-label">HP</span>
          <span className="hud-value hp">
            {Array.from({ length: MAX_HP }).map((_, i) => (
              <span key={i} className={`hp-pip ${i < hp ? 'filled' : ''}`}>█</span>
            ))}
          </span>
        </div>
        <button className="help-btn" onClick={() => setShowHelp(true)} aria-label="how to play">?</button>
      </header>

      <div className="play-field" ref={fieldRef}>
        <div className="floor-line" style={{ top: `${FLOOR_Y}%` }} />
        {enemies.map((enemy) => (
          <button
            key={enemy.id}
            className={[
              'enemy-block',
              enemy.id === targetId ? 'targeted' : '',
              flash?.id === enemy.id && flash.kind === 'crush' ? 'crushed' : '',
              flash?.id === enemy.id && flash.kind === 'error' ? 'errored' : '',
            ].join(' ').trim()}
            style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
            onClick={() => setTargetId(enemy.id)}
          >
            <span className="enemy-main">{formatEnemyValue(enemy)}</span>
            <span className="enemy-sub">{toBinary(enemy.value, enemy.bits)}</span>
          </button>
        ))}

        {gameOver && (
          <div className="game-over-overlay">
            <h1>GAME OVER</h1>
            <p>FINAL SCORE: {score.toLocaleString()}</p>
            <button className="restart-btn" onClick={restart}>RESTART</button>
          </div>
        )}
      </div>

      <div className="guide-line">
        {target ? (
          <span>
            <span className="guide-target">Target({formatEnemyValue(target)})</span>{' '}
            <span className="guide-op">{OPS[op].symbol}</span>{' '}
            {operandNeeded && (
              <span className="guide-operand">My Operand({operand || '?'})</span>
            )}{' '}
            = {previewResult !== null ? (
              <span className="guide-result">{toBinary(previewResult, target.bits)} (0x{previewResult.toString(16).toUpperCase()})</span>
            ) : (
              <span className="guide-result invalid">INVALID OPERAND</span>
            )}
          </span>
        ) : (
          <span className="guide-placeholder">적 블록을 클릭해서 타겟을 지정하세요.</span>
        )}
      </div>

      <footer className="toolbox">
        <div className="op-buttons">
          {Object.keys(OPS).map((key) => (
            <button
              key={key}
              className={`op-btn op-${key.toLowerCase()} ${op === key ? 'active' : ''}`}
              onClick={() => setOp(key)}
            >
              [{OPS[key].symbol}]
            </button>
          ))}
        </div>

        <div className="operand-row">
          <label className="field operand-field">
            <span className="field-label">MY OPERAND (2진수/16진수/10진수)</span>
            <input
              className="operand-input"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              value={operandNeeded ? operand : 'N/A (단항 연산자)'}
              disabled={!operandNeeded}
              placeholder="예: 01000 / 0xB4 / 42"
              onChange={(e) => setOperand(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </label>

          <label className="field result-field">
            <span className="field-label">RESULT</span>
            <span className={`field-value result-value ${previewResult === 0 ? 'zero' : ''}`}>
              {previewResult !== null
                ? `${toBinary(previewResult, target?.bits ?? bits)} (0x${previewResult.toString(16).toUpperCase()})`
                : '-----'}
            </span>
          </label>
        </div>

        <button className="apply-btn" onClick={handleApply} disabled={!target || !operandValid}>
          {previewResult === 0 ? '⚡ CRUSH! ⚡' : 'APPLY'}
        </button>
      </footer>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
