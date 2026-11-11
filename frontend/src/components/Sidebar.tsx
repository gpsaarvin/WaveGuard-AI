import React from 'react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'plate-visualization', label: 'Plate Visualization', icon: 'layers' },
    { id: 'signal-analysis', label: 'Signal Analysis', icon: 'graphic_eq' },
    { id: 'ai-classification', label: 'AI Classification', icon: 'model_training' },
    { id: 'model-evaluation', label: 'Model Evaluation', icon: 'analytics' },
    { id: 'dataset-management', label: 'Dataset Management', icon: 'dataset' },
    { id: 'analysis-history', label: 'Analysis History', icon: 'history' },
    { id: 'reports', label: 'Reports', icon: 'description' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#020e21] border-r border-[#3b494b]/30 z-50 flex flex-col justify-between backdrop-blur-xl select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('landing')}
          className="h-16 px-4 flex items-center justify-between border-b border-[#3b494b]/30 bg-[#0e1c2f]/40 cursor-pointer hover:bg-[#0e1c2f]/70 transition-colors"
          title="Go to Home / Landing Page"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00f0ff] to-[#508eff] flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              <span className="material-symbols-outlined text-[#00363a] text-xl font-bold">radar</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-tight text-[#dbfcff] leading-none">WaveGuard AI</span>
              <span className="text-[10px] text-[#b9cacb] uppercase tracking-widest mt-0.5 font-mono">Research Platform</span>
            </div>
          </div>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#28354a] text-[#00dbe9] border border-[#00dbe9]/30 tracking-wider">
            v2.4
          </span>
        </div>

        {/* Section Label */}
        <div className="px-4 py-3">
          <span className="font-mono text-[10px] text-[#b9cacb]/70 uppercase tracking-wider px-1">
            Aero SHM Modules
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col px-2 gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-[#1d2a3e] text-[#00f0ff] border-l-2 border-[#00f0ff] font-medium shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                    : 'text-[#b9cacb] hover:bg-[#1d2a3e]/60 hover:text-[#d6e3fe]'
                }`}
              >
                <span className={`material-symbols-outlined text-lg leading-none ${isActive ? 'text-[#00f0ff]' : 'text-[#b9cacb]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Telemetry & Researcher Footer */}
      <div className="flex flex-col border-t border-[#3b494b]/30 bg-[#0e1c2f]/60">
        <div className="p-2.5 mx-3 my-2 rounded bg-[#020e21] border border-[#3b494b]/30 font-mono text-[10px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-[#d6e3fe]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
              SYS NOMINAL
            </span>
            <span className="text-[#dbfcff]">PZT SYNC</span>
          </div>
          <div className="text-[#b9cacb] flex items-center justify-between">
            <span>GPU INFERENCE</span>
            <span className="text-[#00dbe9]">ONLINE (0.8ms)</span>
          </div>
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t border-[#3b494b]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1d2a3e] border border-[#00f0ff]/40 flex items-center justify-center text-xs font-bold text-[#00f0ff]">
              AS
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#d6e3fe] font-semibold leading-snug">Dr. A. Sharma</span>
              <span className="text-[10px] text-[#b9cacb] font-mono">Lead Researcher</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#132033] text-[#b9cacb] border border-[#3b494b]/40">
            LAB-04
          </span>
        </div>
      </div>
    </aside>
  );
};

