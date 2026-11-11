import React, { useRef, useEffect, useState } from 'react';

interface Plate3DCanvasProps {
  selectedDefect?: string; // 'healthy', 'delam', 'crack', 'bvid', 'all'
  viewMode?: 'energy' | 'strain' | 'modes';
  interactive?: boolean;
}

export const Plate3DCanvas: React.FC<Plate3DCanvasProps> = ({
  selectedDefect = 'all',
  viewMode = 'energy',
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState<number>(24);
  const [rotZ, setRotZ] = useState<number>(-12);
  const [scale, setScale] = useState<number>(0.95);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [wavePhase, setWavePhase] = useState<number>(0);

  // Auto-propagation wave animation loop
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setWavePhase((prev) => (prev + 0.02) % 1);
      if (isRotating) {
        setRotZ((prev) => (prev + 0.08) % 360);
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isRotating]);

  // Mouse drag to orbit
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !interactive) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotZ((prev) => prev + dx * 0.4);
    setRotX((prev) => Math.max(0, Math.min(65, prev - dy * 0.4)));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleReset = () => {
    setRotX(24);
    setRotZ(-12);
    setScale(0.95);
    setIsRotating(false);
  };

  // Sensor definitions in 500x500mm plate:
  // Center is (250, 250)
  const sensors = [
    { id: 'TX-01', x: 250, y: 250, isTx: true, label: 'TX (250kHz)' },
    { id: 'RX-01', x: 250, y: 70, isTx: false },
    { id: 'RX-02', x: 377, y: 123, isTx: false },
    { id: 'RX-03', x: 430, y: 250, isTx: false },
    { id: 'RX-04', x: 377, y: 377, isTx: false },
    { id: 'RX-05', x: 250, y: 430, isTx: false },
    { id: 'RX-06', x: 123, y: 377, isTx: false },
    { id: 'RX-07', x: 70, y: 250, isTx: false },
    { id: 'RX-08', x: 123, y: 123, isTx: false },
  ];

  const showDelam = selectedDefect === 'all' || selectedDefect === 'delam';
  const showCrack = selectedDefect === 'all' || selectedDefect === 'crack';
  const showBvid = selectedDefect === 'all' || selectedDefect === 'bvid';

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-full min-h-[520px] flex items-center justify-center select-none overflow-hidden"
      style={{ perspective: '1100px', cursor: interactive ? 'grab' : 'default' }}
    >
      {/* 3D Stage Toolbar Overlay */}
      {interactive && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-[#020e21]/80 backdrop-blur-md p-1.5 rounded-lg border border-[#3b494b]/30">
          <button
            onClick={() => setScale((s) => Math.min(1.4, s + 0.1))}
            className="p-1.5 rounded hover:bg-[#1d2a3e] text-[#b9cacb] hover:text-[#00f0ff] transition-colors"
            title="Zoom In"
            type="button"
          >
            <span className="material-symbols-outlined text-base leading-none">zoom_in</span>
          </button>
          <button
            onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}
            className="p-1.5 rounded hover:bg-[#1d2a3e] text-[#b9cacb] hover:text-[#00f0ff] transition-colors"
            title="Zoom Out"
            type="button"
          >
            <span className="material-symbols-outlined text-base leading-none">zoom_out</span>
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded transition-colors ${
              isRotating ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'hover:bg-[#1d2a3e] text-[#b9cacb]'
            }`}
            title="Toggle Continuous Orbit"
            type="button"
          >
            <span className="material-symbols-outlined text-base leading-none">3d_rotation</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-[#1d2a3e] text-[#b9cacb] hover:text-[#d6e3fe] transition-colors"
            title="Reset View"
            type="button"
          >
            <span className="material-symbols-outlined text-base leading-none">restart_alt</span>
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
              showGrid ? 'bg-[#1d2a3e] text-[#00dbe9]' : 'text-[#b9cacb]'
            }`}
            title="Toggle 50mm Grid"
            type="button"
          >
            Grid
          </button>
        </div>
      )}

      {/* Plate 3D Canvas Transform Box */}
      <div
        className="relative w-[480px] h-[480px] transition-transform duration-75 origin-center"
        style={{
          transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Carbon Fibre Composite Base Plate */}
        <div className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl bg-[#080d14] border-2 border-[#1d2a3e]/80">
          {/* Twill Weave Carbon Texture Background */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(0,240,255,0.08) 0%, transparent 75%),
                repeating-linear-gradient(45deg, #09101a 0px, #09101a 2px, #0d1726 2px, #0d1726 4px),
                repeating-linear-gradient(-45deg, #050a12 0px, #050a12 2px, #111d2e 2px, #111d2e 4px)
              `,
              backgroundBlendMode: 'overlay',
            }}
          />

          {/* 50mm Structural Grid Lines */}
          {showGrid && (
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-25 pointer-events-none">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="border-b border-r border-[#00f0ff]/30" />
              ))}
            </div>
          )}

          {/* Specimen Boundary Aluminum Edge Clamps */}
          <div className="absolute top-0 inset-x-0 h-3.5 bg-[#1d2a3e]/90 border-b border-[#3b494b]/40 flex justify-around items-center px-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#849495]" />
            ))}
          </div>
          <div className="absolute bottom-0 inset-x-0 h-3.5 bg-[#1d2a3e]/90 border-t border-[#3b494b]/40 flex justify-around items-center px-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#849495]" />
            ))}
          </div>
          <div className="absolute left-0 inset-y-0 w-3.5 bg-[#1d2a3e]/90 border-r border-[#3b494b]/40 flex flex-col justify-around items-center py-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#849495]" />
            ))}
          </div>
          <div className="absolute right-0 inset-y-0 w-3.5 bg-[#1d2a3e]/90 border-l border-[#3b494b]/40 flex flex-col justify-around items-center py-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#849495]" />
            ))}
          </div>

          {/* Animated Ultrasonic Guided Wave Rings (S0 and A0 Lamb Modes) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
            <defs>
              <radialGradient id="burstGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#508eff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* S0 Fast Symmetric Wave Wavefront */}
            <circle
              cx="250"
              cy="250"
              r={50 + wavePhase * 180}
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2"
              opacity={1 - wavePhase}
              strokeDasharray="4 2"
            />

            {/* A0 Dispersive Antisymmetric Wavefront */}
            <circle
              cx="250"
              cy="250"
              r={25 + wavePhase * 120}
              fill="none"
              stroke="#508eff"
              strokeWidth="2.5"
              opacity={0.85 - wavePhase * 0.7}
            />

            {/* Secondary Reflected Wavefront from Delamination Defect */}
            {showDelam && (
              <circle
                cx="318"
                cy="184"
                r={(wavePhase * 90) % 90}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeDasharray="3 3"
                opacity={Math.max(0, 0.9 - ((wavePhase * 90) % 90) / 90)}
              />
            )}

            {/* Sensor Interconnect Transmission Paths */}
            {sensors
              .filter((s) => !s.isTx)
              .map((s, idx) => (
                <line
                  key={idx}
                  x1="250"
                  y1="250"
                  x2={s.x}
                  y2={s.y}
                  stroke="#508eff"
                  strokeWidth="0.75"
                  strokeOpacity="0.35"
                  strokeDasharray="2 3"
                />
              ))}
          </svg>

          {/* Central Actuator (TX-01) with Pulsing Core */}
          <div className="absolute left-[240px] top-[240px] w-5 h-5 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="absolute w-8 h-8 rounded-full bg-[#00f0ff]/30 animate-ping"></span>
            <div className="relative w-4 h-4 rounded-full bg-[#00f0ff] shadow-[0_0_14px_#00f0ff] border border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00363a]"></div>
            </div>
          </div>

          {/* Receivers Array (RX-01 through RX-08) */}
          {sensors
            .filter((s) => !s.isTx)
            .map((s) => (
              <div
                key={s.id}
                className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#508eff] border border-[#d6e3fe] shadow-[0_0_8px_rgba(80,142,255,0.7)] flex items-center justify-center group"
                style={{ left: `${s.x}px`, top: `${s.y}px` }}
              >
                <div className="w-1 h-1 rounded-full bg-[#061426]"></div>
                <div className="absolute -bottom-4 font-mono text-[8px] text-[#00f0ff] whitespace-nowrap opacity-75 group-hover:opacity-100">
                  {s.id}
                </div>
              </div>
            ))}

          {/* DEFECT 1: Sub-Surface Delamination Anomaly (318mm, 184mm) */}
          {showDelam && (
            <div
              className="absolute left-[318px] top-[184px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-9 h-7 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b] shadow-[0_0_16px_rgba(245,158,11,0.5)] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></span>
              </div>
              <div className="mt-1 px-1.5 py-0.5 rounded bg-[#020e21]/90 border border-[#f59e0b]/40 font-mono text-[8px] text-[#f59e0b] whitespace-nowrap shadow-md">
                DELAMINATION [Q2: 318, 184]
              </div>
            </div>
          )}

          {/* DEFECT 2: Matrix Micro-Crack (195mm, 340mm) */}
          {showCrack && (
            <div
              className="absolute left-[195px] top-[340px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-8 h-3 -rotate-45 bg-[#ffb4ab]/30 border border-[#f43f5e] shadow-[0_0_12px_rgba(244,63,94,0.6)] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#f43f5e] animate-ping"></div>
              </div>
              <div className="mt-1 px-1.5 py-0.5 rounded bg-[#020e21]/90 border border-[#f43f5e]/40 font-mono text-[8px] text-[#ffb4ab] whitespace-nowrap shadow-md">
                FATIGUE CRACK [Q3: 195, 340]
              </div>
            </div>
          )}

          {/* DEFECT 3: High-Velocity Impact Damage BVID (245mm, 260mm) */}
          {showBvid && (
            <div
              className="absolute left-[245px] top-[260px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-8 h-8 rounded-full bg-[#8b5cf6]/25 border border-[#8b5cf6] shadow-[0_0_16px_rgba(139,92,246,0.6)] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] animate-ping"></div>
              </div>
              <div className="mt-1 px-1.5 py-0.5 rounded bg-[#020e21]/90 border border-[#8b5cf6]/40 font-mono text-[8px] text-[#d0bcff] whitespace-nowrap shadow-md">
                BVID IMPACT [245, 260]
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plate Simulation Legend / Disclaimer */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <span className="font-mono text-[9px] text-[#b9cacb]/80 bg-[#020e21]/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#3b494b]/30">
          PHYSICAL SIMULATION • LAMB WAVE DISPERSION MATRIX • NO REAL SENSORS REQUIRED
        </span>
      </div>
    </div>
  );
};

