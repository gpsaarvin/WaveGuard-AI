import React, { useState } from 'react';

export const Settings: React.FC = () => {
  const [researcherName, setResearcherName] = useState<string>('Dr. A. Sharma');
  const [labId, setLabId] = useState<string>('LAB-04 (Aero SHM NDE)');
  const [defaultFs, setDefaultFs] = useState<string>('50');
  const [defaultFc, setDefaultFc] = useState<string>('250');
  const [defaultModel, setDefaultModel] = useState<string>('xgb');
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#061426] min-h-screen max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#020e21] p-4 rounded-xl border border-[#3b494b]/30 shadow-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-xl">tune</span>
            <h1 className="text-xl font-bold text-[#dbfcff]">Platform Settings & Preferences</h1>
          </div>
          <span className="font-mono text-xs text-[#b9cacb]">
            Configure hardware digitization thresholds, default ML inference engine, and NDT research parameters
          </span>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>Preferences updated and saved to local state!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Laboratory & Operator Profile */}
        <div className="bg-[#0e1c2f] p-6 rounded-xl border border-[#3b494b]/30 shadow-xl flex flex-col gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#3b494b]/20">
            <span className="material-symbols-outlined text-[#00f0ff] text-base">person</span>
            <span className="text-sm font-bold text-[#dbfcff]">Research Operator & Laboratory Identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#b9cacb]">Lead Researcher / Inspector Name</label>
              <input
                type="text"
                value={researcherName}
                onChange={(e) => setResearcherName(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#132033] text-[#d6e3fe] border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#b9cacb]">Laboratory Station ID</label>
              <input
                type="text"
                value={labId}
                onChange={(e) => setLabId(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#132033] text-[#d6e3fe] border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              />
            </div>
          </div>
        </div>

        {/* Acoustic Acquisition Parameters */}
        <div className="bg-[#0e1c2f] p-6 rounded-xl border border-[#3b494b]/30 shadow-xl flex flex-col gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#3b494b]/20">
            <span className="material-symbols-outlined text-[#00f0ff] text-base">sensors</span>
            <span className="text-sm font-bold text-[#dbfcff]">Ultrasonic Guided Wave Acquisition Defaults</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#b9cacb]">Sampling Rate (MS/s)</label>
              <input
                type="number"
                value={defaultFs}
                onChange={(e) => setDefaultFs(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#132033] text-[#d6e3fe] border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#b9cacb]">Toneburst Center Frequency (kHz)</label>
              <input
                type="number"
                value={defaultFc}
                onChange={(e) => setDefaultFc(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#132033] text-[#d6e3fe] border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#b9cacb]">Default ML Model</label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#132033] text-[#00f0ff] border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] cursor-pointer"
              >
                <option value="xgb">XGBoost-LambWave v3.2</option>
                <option value="rf">Random Forest (500 Trees)</option>
                <option value="svm">SVM (RBF Kernel)</option>
                <option value="knn">K-Nearest Neighbors</option>
              </select>
            </div>
          </div>
        </div>

        {/* About Project & Academic Compliance */}
        <div className="bg-[#0e1c2f] p-6 rounded-xl border border-[#3b494b]/30 shadow-xl flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#3b494b]/20">
            <span className="material-symbols-outlined text-[#00f0ff] text-base">info</span>
            <span className="text-sm font-bold text-[#dbfcff]">About WaveGuard AI</span>
          </div>

          <div className="text-[#b9cacb] leading-relaxed space-y-2">
            <p>
              <span className="text-[#00f0ff] font-bold">WaveGuard AI</span> is a production-grade academic research platform designed for
              non-destructive evaluation (NDE) of aerospace carbon fibre composite plates using ultrasonic guided Lamb waves.
            </p>
            <p>
              Engineered with zero-phase digital filtering, Fourier and Hilbert envelope extraction, multi-class machine learning
              (XGBoost, Random Forest, SVM, KNN), and automated ISO 9712 / FAA compliant PDF report generation.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-[10px] text-[#00dbe9]">
              <span>FastAPI Backend: v2.4.0</span>
              <span>•</span>
              <span>Python: 3.13</span>
              <span>•</span>
              <span>React: 18.3</span>
              <span>•</span>
              <span>Tailwind CSS: v3.4</span>
              <span>•</span>
              <span>Three.js Engine</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs font-mono shadow-[0_0_16px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

