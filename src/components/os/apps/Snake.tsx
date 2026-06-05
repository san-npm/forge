'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const CELL = 16;
const COLS = 22;
const ROWS = 20;

interface P { x: number; y: number }
interface Game { snake: P[]; dir: P; food: P }

function spawnFood(snake: P[]): P {
  let f: P;
  do {
    f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === f.x && s.y === f.y));
  return f;
}

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);

  const render = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0c1530';
    ctx.fillRect(0, 0, c.width, c.height);
    // subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 1; i < COLS; i++) { ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, c.height); ctx.stroke(); }
    for (let j = 1; j < ROWS; j++) { ctx.beginPath(); ctx.moveTo(0, j * CELL); ctx.lineTo(c.width, j * CELL); ctx.stroke(); }
    const g = game.current;
    if (!g) return;
    ctx.fillStyle = '#e0463c';
    ctx.fillRect(g.food.x * CELL + 2, g.food.y * CELL + 2, CELL - 4, CELL - 4);
    g.snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#8cf06b' : '#3fa648';
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const start = useCallback(() => {
    game.current = {
      snake: [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }],
      dir: { x: 1, y: 0 },
      food: { x: 14, y: 10 },
    };
    setScore(0);
    setOver(false);
    setRunning(true);
    render();
  }, [render]);

  useEffect(() => { render(); }, [render]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const g = game.current;
      if (!g) return;
      const turn = (x: number, y: number) => { if (g.dir.x !== -x || g.dir.y !== -y) g.dir = { x, y }; };
      switch (e.key) {
        case 'ArrowUp': case 'w': turn(0, -1); break;
        case 'ArrowDown': case 's': turn(0, 1); break;
        case 'ArrowLeft': case 'a': turn(-1, 0); break;
        case 'ArrowRight': case 'd': turn(1, 0); break;
        default: return;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // tick
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const g = game.current;
      if (!g) return;
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || g.snake.some((s) => s.x === head.x && s.y === head.y)) {
        setRunning(false);
        setOver(true);
        return;
      }
      g.snake.unshift(head);
      if (head.x === g.food.x && head.y === g.food.y) {
        setScore((s) => s + 1);
        g.food = spawnFood(g.snake);
      } else {
        g.snake.pop();
      }
      render();
    }, 110);
    return () => clearInterval(id);
  }, [running, render]);

  return (
    <div className="os-snake">
      <div className="os-snake-head">
        <span className="os-snake-title">Snake</span>
        <span className="os-snake-score">Score&nbsp;{score}</span>
        {running && <button type="button" className="os-btn" onClick={start}>Restart</button>}
      </div>
      <div className="os-snake-stage">
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="os-snake-canvas" />
        {!running && (
          <div className="os-snake-overlay">
            <strong>{over ? 'Game over' : 'Snake'}</strong>
            <span>{over ? `Score ${score}` : 'Eat the red squares'}</span>
            <button type="button" className="os-btn os-btn--default" onClick={start}>{over ? 'Play again' : 'Start'}</button>
          </div>
        )}
      </div>
      <p className="os-note os-snake-hint">Arrow keys or W A S D · don’t bite yourself</p>
    </div>
  );
}
