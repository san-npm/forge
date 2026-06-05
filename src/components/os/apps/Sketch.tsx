'use client';

import { useEffect, useRef, useState } from 'react';

const COLORS = ['#1c1c1e', '#e0463c', '#f4b333', '#3fa648', '#3f7bd0', '#9b59c8', '#ffffff'];

export default function Sketch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#1c1c1e');
  const [size, setSize] = useState(4);
  const [erase, setErase] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  };

  const stroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = pos(e);
    const l = last.current ?? p;
    ctx.strokeStyle = erase ? '#ffffff' : color;
    ctx.lineWidth = erase ? size * 3 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => { drawing.current = true; last.current = pos(e); stroke(e); };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => { if (drawing.current) stroke(e); };
  const up = () => { drawing.current = false; last.current = null; };

  const clear = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
  };
  const savePng = () => {
    const url = canvasRef.current!.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'openletz-sketch.png';
    a.click();
  };

  return (
    <div className="os-sketch">
      <div className="os-sketch-tools">
        {COLORS.map((c) => (
          <button key={c} type="button" className={`os-swatch${color === c && !erase ? ' on' : ''}`}
            style={{ background: c }} onClick={() => { setColor(c); setErase(false); }} aria-label={`colour ${c}`} />
        ))}
        <span className="os-tool-sep" />
        <button type="button" className={`os-tool-btn${erase ? ' on' : ''}`} onClick={() => setErase((v) => !v)}>Eraser</button>
        <label className="os-tool-size">Size
          <input type="range" min={1} max={22} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </label>
        <span className="os-tool-sep" />
        <button type="button" className="os-tool-btn" onClick={clear}>Clear</button>
        <button type="button" className="os-tool-btn" onClick={savePng}>Save PNG</button>
      </div>
      <canvas
        ref={canvasRef} width={560} height={300} className="os-canvas"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
      />
      <p className="os-note" style={{ marginTop: 8 }}>
        A little MacPaint. Draw something — then hit “New Project” and we’ll build the real thing.
      </p>
    </div>
  );
}
