import React, { useState, useRef } from 'react';

interface SignalChartProps {
  time_us?: number[];
  signal?: number[];
  filtered_signal?: number[];
  title?: string;
  height?: number;
  showLabels?: boolean;
}

export const SignalChart: React.FC<SignalChartProps> = ({
  time_us = [],
  signal = [],
  filtered_signal,
  title = 'ULTRASONIC A-SCAN WAVEFORM',
  height = 240,
  showLabels = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<{ time: number; amp: number; x: number; y: number } | null>(null);

  // Fallback realistic toneburst signal if none provided
  const points = signal.length > 0 ? signal : Array.from({ length: 400 }, (_, i) => {
    const t = (i / 400) * 140; // 0 to 140 μs
    // S0 burst at 40 μs
    const s0 = Math.exp(-Math.pow((t - 40) / 6, 2)) * 0.45 * Math.sin(2 * Math.PI * 0.25 * t);
    // A0 burst at 100 μs
    const a0 = Math.exp(-Math.pow((t - 100) / 10, 2)) * 0.95 * Math.sin(2 * Math.PI * 0.24 * t);
    // Defect echo at 68 μs
    const echo = Math.exp(-Math.pow((t - 68) / 5, 2)) * 0.35 * Math.sin(2 * Math.PI * 0.25 * t);
    return s0 + a0 + echo;
  });

  const tPoints = time_us.length === points.length ? time_us : Array.from({ length: points.length }, (_, i) => (i / points.length) * 140);

  const maxAmp = Math.max(...points.map((p) => Math.abs(p)), 0.1);
  const minTime = tPoints[0] || 0;
  const maxTime = tPoints[tPoints.length - 1] || 140;

  const w = 800;
  const h = height;
  const padTop = 20;
  const padBottom = 25;
  const plotH = h - padTop - padBottom;
  const midY = padTop + plotH / 2;

  // Build SVG path
  const pathD = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * w;
      const y = midY - (val / (maxAmp * 1.15)) * (plotH / 2);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  // Filtered path if present
  let filteredPathD = '';
  if (filtered_signal && filtered_signal.length === points.length) {
    filteredPathD = filtered_signal
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * w;
        const y = midY - (val / (maxAmp * 1.15)) * (plotH / 2);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const idx = Math.floor((relX / rect.width) * points.length);
    if (idx >= 0 && idx < points.length) {
      setHoverData({
        time: tPoints[idx],
        amp: points[idx],
        x: relX,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="relative flex flex-col bg-[#020e21] rounded-xl p-4 shadow-xl border border-[#3b494b]/30">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3b494b]/20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
          <span className="font-mono text-xs text-[#00f0ff] font-bold tracking-tight uppercase">{title}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#b9cacb]">
          <span className="px-1.5 py-0.5 rounded bg-[#132033] text-[#00dbe9]">
            {minTime.toFixed(1)} – {maxTime.toFixed(1)} µs
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#132033] text-[#508eff]">
            ±{maxAmp.toFixed(2)} V
          </span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverData(null)}
        className="relative w-full overflow-hidden select-none"
        style={{ height: `${h}px` }}
      >
        {/* Background Grid */}
        <svg className="absolute inset-0 w-full h-full text-[#1d2a3e]" preserveAspectRatio="none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <pattern id="sigGrid" width="40" height="24" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sigGrid)" />
          {/* Zero baseline */}
          <line x1="0" y1={midY} x2={w} y2={midY} stroke="#3b494b" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        {/* Scientific Annotations (S0, Anomaly, A0) */}
        {showLabels && (
          <>
            <div className="absolute left-[28%] top-2 flex flex-col items-center pointer-events-none">
              <span className="font-mono text-[9px] text-[#00f0ff] bg-[#132033]/90 px-1.5 py-0.5 rounded border border-[#00f0ff]/30 shadow">
                S0 Mode (40.7 µs)
              </span>
              <div className="w-px h-16 bg-[#00f0ff]/30"></div>
            </div>

            <div className="absolute left-[48%] top-5 flex flex-col items-center pointer-events-none">
              <span className="font-mono text-[9px] text-[#ffb4ab] bg-[#132033]/90 px-1.5 py-0.5 rounded border border-[#f43f5e]/40 shadow animate-pulse">
                Defect Reflection (68.5 µs)
              </span>
              <div className="w-px h-14 bg-[#ffb4ab]/40"></div>
            </div>

            <div className="absolute left-[72%] top-2 flex flex-col items-center pointer-events-none">
              <span className="font-mono text-[9px] text-[#aec6ff] bg-[#132033]/90 px-1.5 py-0.5 rounded border border-[#508eff]/40 shadow">
                A0 Dispersive (100.9 µs)
              </span>
              <div className="w-px h-16 bg-[#508eff]/30"></div>
            </div>
          </>
        )}

        {/* Signal Lines */}
        <svg className="w-full h-full z-10" preserveAspectRatio="none" viewBox={`0 0 ${w} ${h}`}>
          {filteredPathD && (
            <path
              d={filteredPathD}
              fill="none"
              stroke="#508eff"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.8"
            />
          )}
          <path
            d={pathD}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
          />
        </svg>

        {/* Hover Crosshair Tooltip */}
        {hoverData && (
          <>
            <div
              className="absolute top-0 bottom-0 w-px bg-[#00f0ff]/60 pointer-events-none"
              style={{ left: `${hoverData.x}px` }}
            />
            <div
              className="absolute pointer-events-none bg-[#0e1c2f]/95 border border-[#00f0ff]/60 rounded px-2 py-1 font-mono text-[10px] text-[#d6e3fe] shadow-xl z-30"
              style={{
                left: `${Math.min(hoverData.x + 10, (containerRef.current?.clientWidth || 300) - 120)}px`,
                top: `${Math.max(10, hoverData.y - 35)}px`,
              }}
            >
              <div>Time: <span className="text-[#00f0ff] font-bold">{hoverData.time.toFixed(2)} µs</span></div>
              <div>Amp: <span className="text-[#dbfcff] font-bold">{hoverData.amp.toFixed(4)} V</span></div>
            </div>
          </>
        )}
      </div>

      {/* Axis Scale Strip */}
      <div className="flex items-center justify-between text-[#b9cacb] font-mono text-[10px] pt-1.5 border-t border-[#3b494b]/20">
        <span>0 µs (Excitation)</span>
        <span className="text-[#00f0ff]">40.7 µs (S0 Arrival)</span>
        <span className="text-[#ffb4ab]">68.5 µs (Debond Echo)</span>
        <span className="text-[#aec6ff]">100.9 µs (A0 Arrival)</span>
        <span>{maxTime.toFixed(1)} µs</span>
      </div>
    </div>
  );
};

