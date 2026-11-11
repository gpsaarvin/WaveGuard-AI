import React from 'react';

interface FFTChartProps {
  frequencies_khz?: number[];
  magnitudes?: number[];
  dominant_freq_khz?: number;
  height?: number;
}

export const FFTChart: React.FC<FFTChartProps> = ({
  frequencies_khz = [],
  magnitudes = [],
  dominant_freq_khz = 250.0,
  height = 200
}) => {
  // Fallback FFT spectrum centered at 250 kHz with Lamb wave harmonics
  const freqs = frequencies_khz.length > 0 ? frequencies_khz : Array.from({ length: 200 }, (_, i) => i * 3);
  const mags = magnitudes.length > 0 ? magnitudes : freqs.map((f) => {
    const mainPeak = Math.exp(-Math.pow((f - 250) / 35, 2));
    const harmonic = 0.28 * Math.exp(-Math.pow((f - 500) / 45, 2));
    const lowFreq = 0.12 * Math.exp(-Math.pow(f / 60, 2));
    return mainPeak + harmonic + lowFreq + Math.random() * 0.04;
  });

  const maxMag = Math.max(...mags, 1.0);
  const maxFreq = freqs[freqs.length - 1] || 600;

  const w = 600;
  const h = height;
  const padBottom = 20;
  const plotH = h - padBottom;

  // Build path
  const pathD = freqs
    .map((f, i) => {
      const x = (f / maxFreq) * w;
      const y = plotH - (mags[i] / maxMag) * (plotH - 15);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${w} ${plotH} L 0 ${plotH} Z`;

  return (
    <div className="relative flex flex-col bg-[#020e21] rounded-xl p-4 shadow-xl border border-[#3b494b]/30">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3b494b]/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#00f0ff]">equalizer</span>
          <span className="font-mono text-xs text-[#00f0ff] font-bold tracking-tight uppercase">
            FFT FREQUENCY SPECTRUM
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#b9cacb]">
          <span>DOMINANT:</span>
          <span className="px-1.5 py-0.5 rounded bg-[#132033] text-[#00f0ff] font-bold">
            {dominant_freq_khz.toFixed(1)} kHz
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ height: `${h}px` }}>
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <linearGradient id="fftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct, idx) => (
            <line
              key={idx}
              x1="0"
              y1={plotH * pct}
              x2={w}
              y2={plotH * pct}
              stroke="#1d2a3e"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#fftGrad)" />

          {/* Spectrum Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
          />

          {/* Dominant Frequency Marker Pin */}
          {dominant_freq_khz > 0 && (
            <g transform={`translate(${(dominant_freq_khz / maxFreq) * w}, 10)`}>
              <line x1="0" y1="0" x2="0" y2={plotH - 10} stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="0" cy="5" r="3.5" fill="#00f0ff" />
            </g>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[#b9cacb] font-mono text-[10px] pt-1 border-t border-[#3b494b]/20">
        <span>0 kHz</span>
        <span className="text-[#00f0ff]">fc = 250 kHz (Acoustic Center)</span>
        <span>{maxFreq.toFixed(0)} kHz</span>
      </div>
    </div>
  );
};

