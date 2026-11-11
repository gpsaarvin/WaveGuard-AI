import React, { useRef, useEffect } from 'react';

interface SpectrogramChartProps {
  time_us?: number[];
  frequencies_khz?: number[];
  spectrogram_db?: number[][];
  height?: number;
}

export const SpectrogramChart: React.FC<SpectrogramChartProps> = ({
  time_us = [],
  frequencies_khz = [],
  spectrogram_db = [],
  height = 200
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nRows = spectrogram_db.length;
    const nCols = nRows > 0 ? spectrogram_db[0].length : 0;

    if (nRows === 0 || nCols === 0) {
      // Draw simulated STFT spectrogram heatmap
      const simRows = 50;
      const simCols = 80;
      const cellW = canvas.width / simCols;
      const cellH = canvas.height / simRows;

      for (let r = 0; r < simRows; r++) {
        const freqRatio = (simRows - 1 - r) / simRows; // high freq on top
        for (let c = 0; c < simCols; c++) {
          const timeRatio = c / simCols;
          // Energy packet 1 at time 0.28, freq 0.4
          const d1 = Math.hypot((timeRatio - 0.28) * 2.5, (freqRatio - 0.42) * 2.2);
          // Energy packet 2 (A0 dispersive) at time 0.7, freq 0.38
          const d2 = Math.hypot((timeRatio - 0.72) * 2.0, (freqRatio - 0.38) * 1.8);
          // Echo packet
          const d3 = Math.hypot((timeRatio - 0.48) * 3.0, (freqRatio - 0.45) * 2.5);

          const intensity = Math.max(0, 1 - d1) * 0.9 + Math.max(0, 1 - d2) * 0.75 + Math.max(0, 1 - d3) * 0.6;
          const clamped = Math.min(1, Math.max(0, intensity));

          // Color ramp: deep dark navy -> scientific blue -> cyan -> bright white
          let rC = Math.floor(clamped * 200);
          let gC = Math.floor(clamped * 240);
          let bC = Math.floor(100 + clamped * 155);

          if (clamped < 0.15) {
            ctx.fillStyle = `rgb(6, 20, 38)`;
          } else {
            ctx.fillStyle = `rgb(${rC}, ${gC}, ${bC})`;
          }
          ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
        }
      }
      return;
    }

    const cellW = canvas.width / nCols;
    const cellH = canvas.height / nRows;

    for (let r = 0; r < nRows; r++) {
      // Flip vertical so 0 kHz is at the bottom
      const yIdx = nRows - 1 - r;
      const row = spectrogram_db[yIdx];
      for (let c = 0; c < nCols; c++) {
        const db = row[c]; // -60 to 0 dB
        const norm = Math.max(0, Math.min(1, (db + 60) / 60));

        let rC = Math.floor(norm * 219);
        let gC = Math.floor(norm * 252);
        let bC = Math.floor(80 + norm * 175);

        ctx.fillStyle = norm < 0.15 ? '#061426' : `rgb(${rC}, ${gC}, ${bC})`;
        ctx.fillRect(c * cellW, r * cellH, cellW + 0.5, cellH + 0.5);
      }
    }
  }, [spectrogram_db]);

  return (
    <div className="relative flex flex-col bg-[#020e21] rounded-xl p-4 shadow-xl border border-[#3b494b]/30">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3b494b]/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#00f0ff]">waterfall_chart</span>
          <span className="font-mono text-xs text-[#00f0ff] font-bold tracking-tight uppercase">
            STFT TIME-FREQUENCY SPECTROGRAM
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#b9cacb]">
          <span>POWER DENSITY:</span>
          <span className="text-[#00dbe9] font-bold">0 to -60 dB</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded bg-[#061426]" style={{ height: `${height}px` }}>
        <canvas ref={canvasRef} width={600} height={height} className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center justify-between text-[#b9cacb] font-mono text-[10px] pt-1 border-t border-[#3b494b]/20">
        <span>0 µs</span>
        <span className="text-[#00f0ff]">Time-Frequency Energy Concentration</span>
        <span>140.0 µs</span>
      </div>
    </div>
  );
};

