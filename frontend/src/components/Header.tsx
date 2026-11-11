import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onQuickAcquire?: () => void;
  onQuickReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onQuickAcquire, onQuickReport }) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${h}:${m}:${s} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#061426]/85 backdrop-blur-xl border-b border-[#3b494b]/30 z-40 flex items-center justify-between px-6">
      {/* Specimen Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00f0ff] text-lg">radar</span>
          <span className="text-base text-[#d6e3fe] tracking-tight font-medium">CFRP-T700-Plate-A22</span>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 uppercase tracking-wider">
          Guided Wave Active
        </span>
      </div>

      {/* Telemetry Strip */}
      <div className="hidden xl:flex items-center gap-5 px-4 py-1 rounded bg-[#0e1c2f] border border-[#3b494b]/20 font-mono text-xs text-[#b9cacb]">
        <div className="flex items-center gap-1.5">
          <span>FREQ:</span>
          <span className="text-[#dbfcff] font-semibold">250 kHz</span>
        </div>
        <span className="text-[#3b494b]">|</span>
        <div className="flex items-center gap-1.5">
          <span>FS:</span>
          <span className="text-[#dbfcff] font-semibold">50 MS/s</span>
        </div>
        <span className="text-[#3b494b]">|</span>
        <div className="flex items-center gap-1.5">
          <span>ACTUATOR:</span>
          <span className="text-[#00dbe9] font-semibold">PZT-01 DISC</span>
        </div>
      </div>

      {/* Quick Actions & UTC Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onQuickAcquire}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1d2a3e] hover:bg-[#2d3a4e] text-[#d6e3fe] text-xs font-medium border border-[#3b494b]/40 transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-base text-[#00dbe9] leading-none">sensors</span>
            <span>Acquire</span>
          </button>
          <button
            onClick={onQuickReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-semibold text-xs transition-all shadow-[0_0_12px_rgba(0,240,255,0.25)]"
            type="button"
          >
            <span className="material-symbols-outlined text-base leading-none">summarize</span>
            <span>Report</span>
          </button>
        </div>

        <div className="h-5 w-px bg-[#3b494b]/40"></div>

        {/* System Time & GPS lock */}
        <div className="flex items-center gap-2.5">
          <button
            aria-label="Notifications"
            className="relative p-1.5 rounded hover:bg-[#1d2a3e] text-[#b9cacb] hover:text-[#d6e3fe] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-xl leading-none">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ffb4ab] ring-2 ring-[#061426]"></span>
          </button>
          <div className="flex flex-col items-end pl-1 font-mono text-xs">
            <span className="text-[#d6e3fe] leading-tight font-semibold">{utcTime || '14:32:08 UTC'}</span>
            <span className="text-[#b9cacb] text-[9px] uppercase tracking-wider">GPS Locked</span>
          </div>
        </div>
      </div>
    </header>
  );
};

