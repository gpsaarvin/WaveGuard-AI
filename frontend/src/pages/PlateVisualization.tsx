import React, { useState } from 'react';
import { Plate3DCanvas } from '../components/Plate3DCanvas';

export const PlateVisualization: React.FC = () => {
  const [selectedDefect, setSelectedDefect] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'energy' | 'strain' | 'modes'>('energy');

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#061426]">
      {/* Top Specimen & Control Bar */}
      <div className="px-6 py-3 bg-[#020e21] border-b border-[#3b494b]/30 flex flex-wrap items-center justify-between gap-4 shadow-md relative z-20">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5 bg-[#1d2a3e] px-4 py-1.5 rounded-lg shadow-sm border border-[#3b494b]/30">
            <span className="material-symbols-outlined text-[#00f0ff] text-xl leading-none">token</span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#b9cacb] uppercase">Specimen Profile</span>
              <div className="flex items-center gap-2">
                <span className="text-base text-[#d6e3fe] font-semibold tracking-tight">CFRP-Q240</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#28354a] text-[#00dbe9]">[0/±45/90]s</span>
                <span className="text-xs text-[#b9cacb]">500 × 500 × 3.2 mm</span>
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-[#28354a] hidden md:block"></div>

          {/* View Mode Filter Pills */}
          <div className="flex items-center bg-[#0e1c2f] p-1 rounded-xl shadow-inner gap-1 border border-[#3b494b]/30">
            <button
              onClick={() => setViewMode('energy')}
              className={`px-3 py-1.5 rounded font-mono text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'energy'
                  ? 'text-[#00363a] bg-[#00f0ff] font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-[#b9cacb] hover:text-[#d6e3fe] hover:bg-[#1d2a3e]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-base">waves</span>
              <span>Wave Energy Density</span>
            </button>
            <button
              onClick={() => setViewMode('strain')}
              className={`px-3 py-1.5 rounded font-mono text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'strain'
                  ? 'text-[#00363a] bg-[#00f0ff] font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-[#b9cacb] hover:text-[#d6e3fe] hover:bg-[#1d2a3e]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-base">square_foot</span>
              <span>Surface Strain (εxy)</span>
            </button>
            <button
              onClick={() => setViewMode('modes')}
              className={`px-3 py-1.5 rounded font-mono text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'modes'
                  ? 'text-[#00363a] bg-[#00f0ff] font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-[#b9cacb] hover:text-[#d6e3fe] hover:bg-[#1d2a3e]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Lamb Amplitude A₀/S₀</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport and Side Panels Grid */}
      <div className="p-6 grid grid-cols-12 gap-6">
        {/* Defect Simulation Condition Switcher Banner */}
        <div className="col-span-12 flex flex-wrap items-center justify-between gap-4 p-4 bg-[#0e1c2f] rounded-xl shadow-md border border-[#3b494b]/30">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
              <span className="font-mono text-xs text-[#d6e3fe] font-semibold tracking-wider">STATE INJECTION:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedDefect('healthy')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  selectedDefect === 'healthy'
                    ? 'bg-[#10b981] text-[#00363a] font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-[#1d2a3e] text-[#b9cacb] hover:text-[#10b981]'
                }`}
                type="button"
              >
                Nominal Baseline
              </button>
              <button
                onClick={() => setSelectedDefect('all')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  selectedDefect === 'all'
                    ? 'bg-[#00f0ff] text-[#00363a] font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-[#1d2a3e] text-[#b9cacb] hover:text-[#00f0ff]'
                }`}
                type="button"
              >
                Multi-Defect Scan (Default)
              </button>
              <button
                onClick={() => setSelectedDefect('delam')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  selectedDefect === 'delam'
                    ? 'bg-[#f59e0b] text-[#00363a] font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-[#1d2a3e] text-[#b9cacb] hover:text-[#f59e0b]'
                }`}
                type="button"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-[#f59e0b] mr-1.5"></span>
                Sub-surface Delamination
              </button>
              <button
                onClick={() => setSelectedDefect('crack')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  selectedDefect === 'crack'
                    ? 'bg-[#f43f5e] text-[#ffffff] font-bold shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'bg-[#1d2a3e] text-[#b9cacb] hover:text-[#ffb4ab]'
                }`}
                type="button"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-[#ffb4ab] mr-1.5"></span>
                Matrix Micro-Crack
              </button>
              <button
                onClick={() => setSelectedDefect('bvid')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  selectedDefect === 'bvid'
                    ? 'bg-[#8b5cf6] text-[#ffffff] font-bold shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                    : 'bg-[#1d2a3e] text-[#b9cacb] hover:text-[#aec6ff]'
                }`}
                type="button"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-[#aec6ff] mr-1.5"></span>
                BVID Impact Damage
              </button>
            </div>
          </div>

          {/* Ultrasonic Telemetry Chips */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#132033] text-[#b9cacb] border border-[#3b494b]/30">
              <span>S₀ VELOCITY:</span>
              <span className="text-[#00dbe9] font-bold">5,420 m/s</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#132033] text-[#b9cacb] border border-[#3b494b]/30">
              <span>A₀ VELOCITY:</span>
              <span className="text-[#00f0ff] font-bold">2,180 m/s</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#132033] text-[#b9cacb] border border-[#3b494b]/30">
              <span>ATTENUATION:</span>
              <span className="text-[#aec6ff] font-bold">0.42 dB/cm</span>
            </div>
          </div>
        </div>

        {/* Center 3D Plate Visualization Arena (Columns 1-8 Desktop) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-4">
          <div className="relative bg-[#020e21] rounded-xl overflow-hidden shadow-xl border border-[#3b494b]/30 min-h-[580px] p-2">
            {/* Live HUD Corner Data */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
              <div className="flex items-center gap-2 bg-[#1d2a3e]/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#00f0ff]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
                <span className="font-mono text-xs text-[#dbfcff] font-bold">LAMB PROPAGATION ENGINE</span>
              </div>
              <span className="font-mono text-[10px] text-[#b9cacb] bg-[#132033]/70 backdrop-blur-sm px-2 py-0.5 rounded">
                COORDS: [0 - 500 mm] × [0 - 500 mm]
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1 pointer-events-none">
              <div className="bg-[#1d2a3e]/80 backdrop-blur-md px-2.5 py-1 rounded font-mono text-[10px] text-[#b9cacb] flex items-center gap-2 border border-[#3b494b]/30">
                <span>TX/RX ARRAY:</span>
                <span className="text-[#00f0ff] font-semibold">1-TX / 8-RX CIRCULAR</span>
              </div>
              <span className="font-mono text-[10px] text-[#00dbe9] bg-[#132033]/70 px-2 py-0.5 rounded">
                SAMPLING: 50 MS/s (250 kHz Tone)
              </span>
            </div>

            <Plate3DCanvas selectedDefect={selectedDefect} viewMode={viewMode} interactive={true} />
          </div>
        </div>

        {/* Right Side Telemetry & Transducer Status (Columns 9-12 Desktop) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
          {/* Anomaly Localization Report */}
          <div className="p-4 rounded-xl bg-[#0e1c2f] border border-[#3b494b]/30 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
              <span className="font-mono text-xs text-[#00f0ff] uppercase font-bold tracking-wider">
                Defect Localization Matrix
              </span>
              <span className="font-mono text-[10px] text-[#b9cacb]">ToF Triangulation</span>
            </div>

            {selectedDefect === 'healthy' ? (
              <div className="p-4 rounded-lg bg-[#132033] text-center font-mono text-xs text-[#10b981]">
                ✓ NOMINAL STRUCTURAL BASELINE CONFIRMED. NO DEFECT DETECTED.
              </div>
            ) : (
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#132033] flex items-center justify-between">
                  <span className="text-[#b9cacb]">Primary Defect:</span>
                  <span className="text-[#f59e0b] font-bold">Sub-Surface Delamination</span>
                </div>
                <div className="p-2.5 rounded bg-[#132033] flex items-center justify-between">
                  <span className="text-[#b9cacb]">Coordinates (X, Y):</span>
                  <span className="text-[#00f0ff] font-bold">318.0 mm, 184.0 mm</span>
                </div>
                <div className="p-2.5 rounded bg-[#132033] flex items-center justify-between">
                  <span className="text-[#b9cacb]">Through-Thickness:</span>
                  <span className="text-[#d6e3fe]">Ply Interface 6-7 (0.85 mm)</span>
                </div>
                <div className="p-2.5 rounded bg-[#132033] flex items-center justify-between">
                  <span className="text-[#b9cacb]">Estimated Area:</span>
                  <span className="text-[#ffb4ab] font-bold">18.5 cm² Debond</span>
                </div>
              </div>
            )}
          </div>

          {/* Transducer Array Status Strip */}
          <div className="p-4 rounded-xl bg-[#0e1c2f] border border-[#3b494b]/30 shadow-lg flex flex-col gap-2.5">
            <span className="font-mono text-xs text-[#00f0ff] uppercase font-bold tracking-wider pb-1 border-b border-[#3b494b]/20">
              Transducer PZT Network
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              <div className="p-2 rounded bg-[#132033] border border-[#00f0ff]/30">
                <span className="text-[#00f0ff] font-bold block">TX-01 (Center)</span>
                <span className="text-[#b9cacb]">250 kHz Toneburst</span>
              </div>
              <div className="p-2 rounded bg-[#132033] border border-[#508eff]/30">
                <span className="text-[#aec6ff] font-bold block">RX-01 (North)</span>
                <span className="text-[#10b981]">SYNC (18.4 µs)</span>
              </div>
              <div className="p-2 rounded bg-[#132033] border border-[#508eff]/30">
                <span className="text-[#aec6ff] font-bold block">RX-03 (East)</span>
                <span className="text-[#f59e0b]">ATTEN (-3.2dB)</span>
              </div>
              <div className="p-2 rounded bg-[#132033] border border-[#508eff]/30">
                <span className="text-[#aec6ff] font-bold block">RX-04 (SE)</span>
                <span className="text-[#ffb4ab]">SCATTER ECHO</span>
              </div>
            </div>
          </div>

          {/* Theoretical Lamb Wave Dispersion Curves Info */}
          <div className="p-4 rounded-xl bg-[#0e1c2f] border border-[#3b494b]/30 shadow-lg flex flex-col gap-2 font-mono text-xs">
            <span className="text-[#00f0ff] font-bold uppercase tracking-wider">
              Dispersion Matrix (CFRP [0/45/90/-45]s)
            </span>
            <div className="text-[11px] text-[#b9cacb] leading-relaxed">
              At excitation frequency-thickness product <span className="text-[#00f0ff] font-bold">f·d = 0.8 MHz·mm</span>:
              <ul className="list-disc list-inside mt-1 space-y-1 text-[#d6e3fe]">
                <li><span className="text-[#00f0ff]">S0 Mode:</span> Group velocity 5,420 m/s (Near non-dispersive)</li>
                <li><span className="text-[#aec6ff]">A0 Mode:</span> Group velocity 2,180 m/s (Highly dispersive)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

