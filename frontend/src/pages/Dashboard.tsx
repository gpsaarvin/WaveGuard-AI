import React, { useEffect, useState } from 'react';
import { DashboardStats } from '../types';
import { fetchDashboardStats } from '../services/api';

interface DashboardProps {
  onNavigate: (path: string) => void;
  onQuickAcquire?: () => void;
  onQuickReport?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onQuickAcquire, onQuickReport }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard:', err);
        setLoading(false);
      });
  }, []);

  const totalDatasets = stats?.total_datasets ?? 4;
  const totalAnalyses = stats?.total_analyses ?? 4;
  const healthyCount = stats?.healthy_count ?? 1;
  const defectCount = stats?.defect_count ?? 3;
  const delamCount = stats?.delamination_count ?? 1;
  const crackCount = stats?.crack_count ?? 1;
  const impactCount = stats?.impact_count ?? 1;
  const healthyRatio = stats?.healthy_ratio ?? 25.0;
  const accuracy = stats?.benchmark_accuracy ?? 98.4;

  // Donut arc calculation
  const circ = 2 * Math.PI * 38; // 238.76
  const healthyArc = (healthyRatio / 100) * circ;
  const delamRatio = totalAnalyses > 0 ? (delamCount / totalAnalyses) : 0.25;
  const delamArc = delamRatio * circ;
  const crackRatio = totalAnalyses > 0 ? (crackCount / totalAnalyses) : 0.25;
  const crackArc = crackRatio * circ;
  const impactRatio = totalAnalyses > 0 ? (impactCount / totalAnalyses) : 0.25;
  const impactArc = impactRatio * circ;

  return (
    <div className="flex flex-col w-full p-6 space-y-6">
      {/* Top Bar Metadata Cluster */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#00dbe9] uppercase tracking-wider">
              Aero SHM Platform // Telemetry Node 04
            </span>
            <span className="w-1 h-1 rounded-full bg-[#00f0ff]"></span>
            <span className="text-xs text-[#b9cacb]">Real-time Inference Array</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#dbfcff] tracking-tight mt-1 flex items-center gap-2">
            Diagnostics & Structural Health Matrix
          </h1>
        </div>

        {/* Live Status Strip */}
        <div className="flex items-center gap-3 bg-[#0e1c2f] px-4 py-2 rounded-xl shadow-inner border border-[#3b494b]/30">
          <div className="flex items-center gap-2 pr-3 border-r border-[#3b494b]/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
            </span>
            <span className="font-mono text-xs text-[#d6e3fe] font-semibold">SYNCHRONIZED</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#b9cacb]">
            <span>SAMPLING:</span>
            <span className="text-[#dbfcff] font-bold">50 MS/s</span>
          </div>
          <span className="text-[#3b494b]">/</span>
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#b9cacb]">
            <span>EXCITATION:</span>
            <span className="text-[#00dbe9] font-bold">5.5-CYCLE HANNING</span>
          </div>
        </div>
      </div>

      {/* 1. TOP KEY METRIC CARDS (5 Bento Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Card 1: Total Datasets */}
        <div 
          onClick={() => onNavigate('dataset-management')}
          className="group relative overflow-hidden bg-[#0e1c2f]/90 rounded-xl p-4 shadow-md hover:bg-[#132033] border border-[#3b494b]/30 transition-all cursor-pointer"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#00f0ff]/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider">Total Datasets</span>
            <span className="material-symbols-outlined text-[#00dbe9] text-lg">folder_data</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl text-[#d6e3fe] font-bold tracking-tight">{totalDatasets}</span>
            <span className="font-mono text-xs text-[#00dbe9] font-medium">Runs</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#00f0ff] font-semibold">Active Ingestion</span>
            <span className="text-[#b9cacb] font-mono">CSV/Excel</span>
          </div>
          <div className="mt-3 w-full h-7">
            <svg className="w-full h-full text-[#00f0ff]" fill="none" viewBox="0 0 100 24">
              <path d="M0 18 L15 15 L30 19 L45 10 L60 14 L75 8 L90 5 L100 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0 18 L15 15 L30 19 L45 10 L60 14 L75 8 L90 5 L100 2 L100 24 L0 24 Z" fill="currentColor" fillOpacity="0.08" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Analyses */}
        <div 
          onClick={() => onNavigate('analysis-history')}
          className="group relative overflow-hidden bg-[#0e1c2f]/90 rounded-xl p-4 shadow-md hover:bg-[#132033] border border-[#3b494b]/30 transition-all cursor-pointer"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#508eff]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider">Total Analyses</span>
            <span className="material-symbols-outlined text-[#aec6ff] text-lg">manage_search</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl text-[#d6e3fe] font-bold tracking-tight">{totalAnalyses}</span>
            <span className="font-mono text-xs text-[#aec6ff] font-medium">Scans</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#b9cacb]">Active Monitoring</span>
            <span className="text-[#aec6ff] font-semibold">6 Plates</span>
          </div>
          <div className="mt-3 w-full h-7">
            <svg className="w-full h-full text-[#aec6ff]" fill="none" viewBox="0 0 100 24">
              <path d="M0 20 L20 18 L40 12 L55 14 L70 6 L85 10 L100 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0 20 L20 18 L40 12 L55 14 L70 6 L85 10 L100 4 L100 24 L0 24 Z" fill="currentColor" fillOpacity="0.08" />
            </svg>
          </div>
        </div>

        {/* Card 3: Healthy Plate Baseline */}
        <div 
          onClick={() => onNavigate('plate-visualization')}
          className="group relative overflow-hidden bg-[#0e1c2f]/90 rounded-xl p-4 shadow-md hover:bg-[#132033] border border-[#3b494b]/30 transition-all cursor-pointer"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#10b981]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider">Healthy Baseline</span>
            <span className="material-symbols-outlined text-[#10b981] text-lg">verified</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl text-[#d6e3fe] font-bold tracking-tight">{healthyCount}</span>
            <span className="font-mono text-xs text-[#10b981] font-medium">Intact</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#10b981] font-semibold">{healthyRatio}% Baseline</span>
            <span className="text-[#b9cacb]">±0.2% Dev</span>
          </div>
          <div className="mt-3 w-full h-7">
            <div className="w-full bg-[#28354a] rounded-full h-2 overflow-hidden mt-3">
              <div className="bg-[#10b981] h-full rounded-full transition-all" style={{ width: `${healthyRatio}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card 4: Defect Predictions */}
        <div 
          onClick={() => onNavigate('ai-classification')}
          className="group relative overflow-hidden bg-[#0e1c2f]/90 rounded-xl p-4 shadow-md hover:bg-[#132033] border border-[#3b494b]/30 transition-all cursor-pointer"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#93000a]/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider">Defect Predictions</span>
            <span className="material-symbols-outlined text-[#ffb4ab] text-lg">warning</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl text-[#ffb4ab] font-bold tracking-tight">{defectCount}</span>
            <span className="font-mono text-xs text-[#ffb4ab] font-medium">Identified</span>
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
            <span className="text-[#d6e3fe]">{delamCount} Delam</span>
            <span className="text-[#849495]">/</span>
            <span className="text-[#d6e3fe]">{crackCount} Crack</span>
            <span className="text-[#849495]">/</span>
            <span className="text-[#d6e3fe]">{impactCount} BVID</span>
          </div>
          <div className="mt-3 w-full h-7 flex gap-1 items-end">
            <div className="h-4/5 w-1/3 bg-[#f59e0b]/70 rounded-xs" title="Delaminations"></div>
            <div className="h-2/5 w-1/3 bg-[#ffb4ab]/70 rounded-xs" title="Micro-Cracks"></div>
            <div className="h-1/5 w-1/3 bg-[#aec6ff]/50 rounded-xs" title="Impact Damage"></div>
          </div>
        </div>

        {/* Card 5: Benchmark Accuracy */}
        <div 
          onClick={() => onNavigate('model-evaluation')}
          className="group relative overflow-hidden bg-[#0e1c2f]/90 rounded-xl p-4 shadow-md hover:bg-[#132033] border border-[#3b494b]/30 transition-all cursor-pointer"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#00f0ff]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider">Model Accuracy</span>
            <span className="material-symbols-outlined text-[#00f0ff] text-lg">precision_manufacturing</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl text-[#00f0ff] font-bold tracking-tight">{accuracy}%</span>
            <span className="font-mono text-xs text-[#dbfcff] font-medium">Holdout</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#00dbe9] font-medium">XGBoost-LambNet</span>
            <span className="text-[#b9cacb]">F1: 0.98</span>
          </div>
          <div className="mt-3 w-full h-7 flex items-center">
            <div className="w-full bg-[#28354a] rounded-full h-2 overflow-hidden">
              <div className="bg-[#00f0ff] h-full rounded-full transition-all" style={{ width: `${accuracy}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID (2/3 + 1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 cols / 2/3 width) */}
        <div className="xl:col-span-8 flex flex-col space-y-6">
          {/* Classification Distribution Card */}
          <div className="bg-[#0e1c2f]/90 rounded-xl p-6 shadow-xl border border-[#3b494b]/30">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-wider">Diagnostic Partitioning</span>
                <h2 className="text-lg font-semibold text-[#d6e3fe]">Ultrasonic Guided Wave Classification Ratio</h2>
              </div>
              <div className="flex items-center gap-1.5 bg-[#132033] px-2.5 py-1 rounded text-xs font-mono">
                <span className="text-[#b9cacb]">MODE:</span>
                <span className="text-[#dbfcff] font-semibold">A0 / S0 Lamb Decomposed</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Donut Graphic Visualizer */}
              <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#28354a" strokeWidth="12" />
                    {/* Healthy Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="12"
                      strokeDasharray={`${healthyArc} ${circ}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    {/* Delamination Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeDasharray={`${delamArc} ${circ}`}
                      strokeDashoffset={`-${healthyArc}`}
                      strokeLinecap="round"
                    />
                    {/* Crack Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#ffb4ab"
                      strokeWidth="12"
                      strokeDasharray={`${crackArc} ${circ}`}
                      strokeDashoffset={`-${healthyArc + delamArc}`}
                      strokeLinecap="round"
                    />
                    {/* Impact Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#508eff"
                      strokeWidth="12"
                      strokeDasharray={`${impactArc} ${circ}`}
                      strokeDashoffset={`-${healthyArc + delamArc + crackArc}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl text-[#d6e3fe] font-bold leading-none">{totalAnalyses}</span>
                    <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider mt-1">Total Scans</span>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#b9cacb] mt-2">Active Specimen Matrix</span>
              </div>

              {/* Breakdown Legend & Metric Stats */}
              <div className="md:col-span-7 flex flex-col space-y-2.5">
                {/* Item: Healthy */}
                <div className="p-3 rounded-lg bg-[#132033] flex items-center justify-between hover:bg-[#1d2a3e] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.6)]"></span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#d6e3fe] leading-tight">Healthy Plate Matrix</span>
                      <span className="font-mono text-[10px] text-[#b9cacb]">Nominal Acoustic Baseline</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm text-[#00f0ff] font-bold">{healthyRatio}%</span>
                    <span className="font-mono text-[10px] text-[#b9cacb] block">{healthyCount} Scans</span>
                  </div>
                </div>

                {/* Item: Delamination */}
                <div className="p-3 rounded-lg bg-[#132033] flex items-center justify-between hover:bg-[#1d2a3e] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#d6e3fe] leading-tight">Sub-Surface Delamination</span>
                      <span className="font-mono text-[10px] text-[#b9cacb]">Ply Interface Debonding</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm text-[#f59e0b] font-bold">
                      {totalAnalyses > 0 ? ((delamCount / totalAnalyses) * 100).toFixed(1) : '25.0'}%
                    </span>
                    <span className="font-mono text-[10px] text-[#b9cacb] block">{delamCount} Scans</span>
                  </div>
                </div>

                {/* Item: Micro-Crack */}
                <div className="p-3 rounded-lg bg-[#132033] flex items-center justify-between hover:bg-[#1d2a3e] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.5)]"></span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#d6e3fe] leading-tight">Matrix Micro-Crack</span>
                      <span className="font-mono text-[10px] text-[#b9cacb]">High-Frequency Attenuation</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm text-[#ffb4ab] font-bold">
                      {totalAnalyses > 0 ? ((crackCount / totalAnalyses) * 100).toFixed(1) : '25.0'}%
                    </span>
                    <span className="font-mono text-[10px] text-[#b9cacb] block">{crackCount} Scans</span>
                  </div>
                </div>

                {/* Item: High-Velocity Impact */}
                <div className="p-3 rounded-lg bg-[#132033] flex items-center justify-between hover:bg-[#1d2a3e] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#508eff] shadow-[0_0_8px_rgba(80,142,255,0.5)]"></span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#d6e3fe] leading-tight">High-Velocity Impact</span>
                      <span className="font-mono text-[10px] text-[#b9cacb]">Barely Visible Impact Damage (BVID)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm text-[#aec6ff] font-bold">
                      {totalAnalyses > 0 ? ((impactCount / totalAnalyses) * 100).toFixed(1) : '25.0'}%
                    </span>
                    <span className="font-mono text-[10px] text-[#b9cacb] block">{impactCount} Scans</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Specimen Telemetry & Live Wave Dispersion Simulation */}
          <div className="bg-[#0e1c2f]/90 rounded-xl p-6 shadow-xl border border-[#3b494b]/30">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff]">SPECIMEN #A22-LAMB</span>
                  <span className="text-xs text-[#b9cacb]">CFRP Quasi-Isotropic [0/45/90/-45]s</span>
                </div>
                <h2 className="text-lg font-semibold text-[#d6e3fe] mt-1">Live Lamb Wave Propagation Matrix</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#132033] text-[#d6e3fe]">
                  VELOCITY: <span className="text-[#dbfcff] font-bold">5,420 m/s (S0)</span>
                </span>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#132033] text-[#d6e3fe]">
                  BURST: <span className="text-[#00dbe9] font-bold">ACTUATED (250kHz)</span>
                </span>
              </div>
            </div>

            {/* Oscilloscope Canvas */}
            <div className="relative bg-[#020e21] rounded-lg p-4 overflow-hidden border border-[#3b494b]/30">
              <div className="flex items-center justify-between text-[#849495] font-mono text-[10px] mb-2">
                <span>+1.00 V (A-Scan TX01 → RX04)</span>
                <span>TOF Window: 0 – 140.0 µs</span>
              </div>

              <svg className="w-full h-32" fill="none" preserveAspectRatio="none" viewBox="0 0 800 120">
                {/* S0 and A0 packets */}
                <path
                  d="M 0 60 L 120 60 Q 140 60, 160 30 T 180 85 T 200 40 T 220 75 T 240 60 L 320 60 Q 340 60, 360 10 T 380 110 T 400 5 T 420 115 T 440 25 T 460 95 T 480 60 L 800 60"
                  stroke="#00f0ff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_6px_rgba(0,240,255,0.7)]"
                />
                {/* Defect reflection packet */}
                <path
                  d="M 520 60 Q 535 60, 545 45 T 560 75 T 575 52 T 590 60 L 800 60"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="flex items-center justify-between text-[#b9cacb] font-mono text-[10px] border-t border-[#3b494b]/30 pt-1.5 mt-2">
                <span>0 µs (Burst)</span>
                <span className="text-[#00f0ff]">40.7 µs (S0 Arrival)</span>
                <span className="text-[#f59e0b]">68.5 µs (Debond Reflection)</span>
                <span className="text-[#aec6ff]">100.9 µs (A0 Dispersive)</span>
                <span>140.0 µs</span>
              </div>
            </div>

            {/* Telemetry Detail Badges */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-2 rounded bg-[#132033] text-center border border-[#3b494b]/20">
                <span className="text-[10px] text-[#b9cacb] block uppercase">Transducer Tx-Rx</span>
                <span className="text-[#dbfcff] font-bold">PZT-01 → PZT-04</span>
              </div>
              <div className="p-2 rounded bg-[#132033] text-center border border-[#3b494b]/20">
                <span className="text-[10px] text-[#b9cacb] block uppercase">Group Velocity Cg</span>
                <span className="text-[#00dbe9] font-bold">2,180 m/s (A0)</span>
              </div>
              <div className="p-2 rounded bg-[#132033] text-center border border-[#3b494b]/20">
                <span className="text-[10px] text-[#b9cacb] block uppercase">Attenuation</span>
                <span className="text-[#d6e3fe] font-bold">-4.82 dB/m</span>
              </div>
              <div className="p-2 rounded bg-[#132033] text-center border border-[#3b494b]/20">
                <span className="text-[10px] text-[#b9cacb] block uppercase">Defect Loc (X, Y)</span>
                <span className="text-[#f59e0b] font-bold">318mm, 184mm</span>
              </div>
            </div>
          </div>

          {/* Recent Analysis Activity Feed Table */}
          <div className="bg-[#0e1c2f]/90 rounded-xl p-6 shadow-xl border border-[#3b494b]/30">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#508eff] uppercase tracking-wider">Live Ultrasonic Signal Log</span>
                <h2 className="text-lg font-semibold text-[#d6e3fe]">Recent Specimen Scans</h2>
              </div>
              <button
                onClick={() => onNavigate('analysis-history')}
                className="px-3 py-1 rounded bg-[#132033] hover:bg-[#1d2a3e] text-xs font-mono text-[#00f0ff] border border-[#3b494b]/30 transition-colors"
              >
                View Full History →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider bg-[#020e21] border-b border-[#3b494b]/30">
                    <th className="py-2.5 px-3">Specimen ID</th>
                    <th className="py-2.5 px-3">Condition / Classification</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3">Model</th>
                    <th className="py-2.5 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b494b]/20">
                  {(stats?.recent_activity || []).map((row) => (
                    <tr key={row.id} className="hover:bg-[#132033] transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-[#dbfcff] block">{row.specimen_id}</span>
                        <span className="font-mono text-[10px] text-[#b9cacb]">{row.dataset_name}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] border ${
                            row.predicted_class === 'Healthy Plate'
                              ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30'
                              : row.predicted_class === 'Delamination'
                              ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30'
                              : row.predicted_class === 'Crack'
                              ? 'bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/30'
                              : 'bg-[#508eff]/10 text-[#aec6ff] border-[#508eff]/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              row.predicted_class === 'Healthy Plate' ? 'bg-[#10b981]' : 'bg-current animate-pulse'
                            }`}
                          ></span>
                          {row.predicted_class.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#00f0ff]">{row.confidence}%</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-[#b9cacb]">{row.model_used}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onNavigate('ai-classification')}
                          className="p-1.5 rounded hover:bg-[#1d2a3e] text-[#00f0ff] transition-colors"
                          title="View Classification Breakdown"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols / 1/3 width) */}
        <div className="xl:col-span-4 flex flex-col space-y-6">
          {/* Model System Health & Inference Engine */}
          <div className="bg-[#0e1c2f]/90 rounded-xl p-6 shadow-xl border border-[#3b494b]/30">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-xl">memory</span>
                <h2 className="text-base font-semibold text-[#d6e3fe]">Inference Engine</h2>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff]">
                ONLINE
              </span>
            </div>

            <div className="p-3 bg-[#132033] rounded-lg mt-2 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#d6e3fe]">Model Architecture</span>
                <span className="font-mono text-[#00f0ff] font-bold">XGB-LambNet v3.2</span>
              </div>
              <div className="flex items-center justify-between text-[#b9cacb]">
                <span>Inference Latency</span>
                <span className="font-mono text-[#00dbe9] font-bold">11.8 ms / sample</span>
              </div>
              <div className="flex items-center justify-between text-[#b9cacb]">
                <span>Quantization</span>
                <span className="font-mono text-[#d6e3fe]">FP16 SIMD</span>
              </div>
            </div>

            {/* Telemetry Gauges */}
            <div className="mt-4 space-y-3 font-mono text-[10px]">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#b9cacb]">GPU ACCELERATION</span>
                  <span className="text-[#00f0ff]">42.8%</span>
                </div>
                <div className="w-full bg-[#28354a] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#00f0ff] h-full rounded-full" style={{ width: '42.8%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#b9cacb]">DSP BUFFER FIFO</span>
                  <span className="text-[#aec6ff]">37.9%</span>
                </div>
                <div className="w-full bg-[#28354a] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#508eff] h-full rounded-full" style={{ width: '37.9%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#b9cacb]">RING BUFFER HEALTH</span>
                  <span className="text-[#00dbe9]">0 DROPS</span>
                </div>
                <div className="w-full bg-[#28354a] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#10b981] h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTION CENTER */}
          <div className="bg-[#0e1c2f]/90 rounded-xl p-6 shadow-xl border border-[#3b494b]/30">
            <h2 className="text-base font-semibold text-[#d6e3fe] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00f0ff] text-xl">bolt</span>
              <span>Quick Action Center</span>
            </h2>

            <div className="flex flex-col space-y-2.5">
              {/* Action 1: Run Full Specimen Scan */}
              <button
                onClick={() => onNavigate('ai-classification')}
                className="w-full p-3 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#508eff] hover:from-[#7df4ff] hover:to-[#aec6ff] text-[#00363a] font-bold text-sm flex items-center justify-between shadow-[0_0_16px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-xl">sensors</span>
                  <span>Run Full Specimen Scan</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#020e21]/40 uppercase">F5</span>
              </button>

              {/* Action 2: DSP Filter Workbench */}
              <button
                onClick={() => onNavigate('signal-analysis')}
                className="w-full p-3 rounded-lg bg-[#132033] hover:bg-[#1d2a3e] text-[#d6e3fe] flex items-center justify-between transition-colors cursor-pointer border border-[#3b494b]/20"
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#00f0ff] text-lg">tune</span>
                  <div className="text-left">
                    <span className="text-xs font-semibold block">DSP Filter Workbench</span>
                    <span className="font-mono text-[10px] text-[#b9cacb]">Butterworth Bandpass & FFT</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#b9cacb] text-base">chevron_right</span>
              </button>

              {/* Action 3: 3D Plate Inspection */}
              <button
                onClick={() => onNavigate('plate-visualization')}
                className="w-full p-3 rounded-lg bg-[#132033] hover:bg-[#1d2a3e] text-[#d6e3fe] flex items-center justify-between transition-colors cursor-pointer border border-[#3b494b]/20"
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#aec6ff] text-lg">layers</span>
                  <div className="text-left">
                    <span className="text-xs font-semibold block">3D Plate Visualization</span>
                    <span className="font-mono text-[10px] text-[#b9cacb]">Wave Dispersion & Defect Zones</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#b9cacb] text-base">chevron_right</span>
              </button>

              {/* Action 4: Dataset Management */}
              <button
                onClick={() => onNavigate('dataset-management')}
                className="w-full p-3 rounded-lg bg-[#132033] hover:bg-[#1d2a3e] text-[#d6e3fe] flex items-center justify-between transition-colors cursor-pointer border border-[#3b494b]/20"
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#00dbe9] text-lg">folder_open</span>
                  <div className="text-left">
                    <span className="text-xs font-semibold block">Upload Datasets</span>
                    <span className="font-mono text-[10px] text-[#b9cacb]">CSV & Excel A-Scans</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#b9cacb] text-base">chevron_right</span>
              </button>

              {/* Action 5: Generate Report */}
              <button
                onClick={() => onNavigate('reports')}
                className="w-full p-3 rounded-lg bg-[#132033] hover:bg-[#1d2a3e] text-[#d6e3fe] flex items-center justify-between transition-colors cursor-pointer border border-[#3b494b]/20"
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#10b981] text-lg">description</span>
                  <div className="text-left">
                    <span className="text-xs font-semibold block">Generate Scientific Report</span>
                    <span className="font-mono text-[10px] text-[#b9cacb]">ISO 9712 / FAA Compliant PDF</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#b9cacb] text-base">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

