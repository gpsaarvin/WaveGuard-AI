import React from 'react';
import { Plate3DCanvas } from '../components/Plate3DCanvas';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onExploreModules: (module: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis, onExploreModules }) => {
  return (
    <div className="relative min-h-screen bg-[#061426] text-[#d6e3fe] flex flex-col overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 h-20 bg-[#061426]/90 backdrop-blur-xl border-b border-[#3b494b]/30 px-6 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#508eff] flex items-center justify-center shadow-[0_0_16px_rgba(0,240,255,0.4)]">
            <span className="material-symbols-outlined text-[#00363a] text-2xl font-bold">radar</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-[#dbfcff] leading-none">WaveGuard AI</span>
            <span className="text-[10px] text-[#b9cacb] uppercase tracking-widest mt-1 font-mono">
              Composite Aero SHM Platform
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#b9cacb]">
          <button onClick={() => onExploreModules('dashboard')} className="hover:text-[#00f0ff] transition-colors">
            Dashboard
          </button>
          <button onClick={() => onExploreModules('plate-visualization')} className="hover:text-[#00f0ff] transition-colors">
            3D Plate
          </button>
          <button onClick={() => onExploreModules('signal-analysis')} className="hover:text-[#00f0ff] transition-colors">
            DSP & Filters
          </button>
          <button onClick={() => onExploreModules('ai-classification')} className="hover:text-[#00f0ff] transition-colors">
            AI Classification
          </button>
          <button onClick={() => onExploreModules('model-evaluation')} className="hover:text-[#00f0ff] transition-colors">
            Benchmarks
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartAnalysis}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_28px_rgba(0,240,255,0.55)] cursor-pointer"
          >
            <span>Start Analysis</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-16 pt-12 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto w-full">
        {/* Left Column: Hero Text */}
        <div className="flex-1 flex flex-col gap-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132033] border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs w-fit">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
            <span>ULTRASONIC GUIDED WAVE CLASSIFICATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#dbfcff] leading-tight">
            Structural Health Intelligence for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#aec6ff]">
              Carbon Fibre Composites
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#b9cacb] leading-relaxed max-w-2xl">
            An advanced software-only research platform integrating ultrasonic Lamb wave dispersion analysis,
            zero-phase digital signal processing, statistical feature extraction, and multi-class Machine Learning
            to classify delamination, matrix micro-cracking, and impact damage with high precision.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartAnalysis}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#508eff] hover:from-[#7df4ff] hover:to-[#aec6ff] text-[#00363a] font-bold text-base transition-all shadow-[0_0_24px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">sensors</span>
              <span>Launch Platform</span>
            </button>
            <button
              onClick={() => onExploreModules('plate-visualization')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0e1c2f] hover:bg-[#1d2a3e] text-[#00f0ff] border border-[#00f0ff]/40 font-semibold text-base transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">3d_rotation</span>
              <span>Inspect 3D Plate</span>
            </button>
          </div>

          {/* Specimen Telemetry Specs Badge Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#3b494b]/30">
            <div className="flex flex-col">
              <span className="font-mono text-xs text-[#b9cacb]">SPECIMEN</span>
              <span className="font-bold text-sm text-[#d6e3fe]">CFRP [0/45/90/-45]s</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs text-[#b9cacb]">EXCITATION</span>
              <span className="font-bold text-sm text-[#00f0ff]">250 kHz Burst</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs text-[#b9cacb]">ACCURACY</span>
              <span className="font-bold text-sm text-[#00dbe9]">98.4% Holdout</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs text-[#b9cacb]">COMPLIANCE</span>
              <span className="font-bold text-sm text-[#aec6ff]">ISO 9712 / FAA</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Plate Interactive Arena */}
        <div className="flex-1 w-full max-w-xl aspect-square relative rounded-2xl overflow-hidden glass-panel-elevated p-2">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#020e21]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff]">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
            <span>INTERACTIVE 3D COMPOSITE SPECIMEN</span>
          </div>
          <Plate3DCanvas selectedDefect="all" interactive={true} />
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-6 lg:px-16 py-16 bg-[#020e21]/70 border-t border-[#3b494b]/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-2">
            <span className="font-mono text-xs text-[#00f0ff] tracking-widest uppercase">
              End-to-End Scientific Architecture
            </span>
            <h2 className="text-3xl font-bold text-[#dbfcff]">
              Complete NDE Guided Wave Workflow
            </h2>
            <p className="text-sm text-[#b9cacb]">
              From raw dataset ingestion and digital filtering to multi-class machine learning classification and certification reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-[#0e1c2f]/80 border border-[#3b494b]/30 hover:border-[#00f0ff]/50 transition-all flex flex-col gap-3 group">
              <div className="w-12 h-12 rounded-lg bg-[#132033] text-[#00f0ff] flex items-center justify-center border border-[#00f0ff]/30 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">layers</span>
              </div>
              <h3 className="font-bold text-lg text-[#d6e3fe]">3D Carbon Fibre Simulation</h3>
              <p className="text-xs text-[#b9cacb] leading-relaxed">
                Explore an interactive 3D carbon fibre plate with twill weave texture, simulated piezoelectric transmitter/receiver arrays, and dynamic S0/A0 wave propagation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-[#0e1c2f]/80 border border-[#3b494b]/30 hover:border-[#00f0ff]/50 transition-all flex flex-col gap-3 group">
              <div className="w-12 h-12 rounded-lg bg-[#132033] text-[#508eff] flex items-center justify-center border border-[#508eff]/30 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">tune</span>
              </div>
              <h3 className="font-bold text-lg text-[#d6e3fe]">Digital Signal Processing</h3>
              <p className="text-xs text-[#b9cacb] leading-relaxed">
                Zero-phase Butterworth filtering (bandpass, lowpass, highpass), wavelet smoothing, Hilbert envelope computation, and FFT spectral decomposition.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-[#0e1c2f]/80 border border-[#3b494b]/30 hover:border-[#00f0ff]/50 transition-all flex flex-col gap-3 group">
              <div className="w-12 h-12 rounded-lg bg-[#132033] text-[#00dbe9] flex items-center justify-center border border-[#00dbe9]/30 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">model_training</span>
              </div>
              <h3 className="font-bold text-lg text-[#d6e3fe]">Multi-Class AI Classification</h3>
              <p className="text-xs text-[#b9cacb] leading-relaxed">
                Classify structural conditions into Healthy Baseline, Sub-surface Delamination, Micro-Crack, and High-Velocity Impact Damage using XGBoost, RF, SVM, and KNN.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-[#0e1c2f]/80 border border-[#3b494b]/30 hover:border-[#00f0ff]/50 transition-all flex flex-col gap-3 group">
              <div className="w-12 h-12 rounded-lg bg-[#132033] text-[#f59e0b] flex items-center justify-center border border-[#f59e0b]/30 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">location_searching</span>
              </div>
              <h3 className="font-bold text-lg text-[#d6e3fe]">Defect Localization & Severity</h3>
              <p className="text-xs text-[#b9cacb] leading-relaxed">
                Estimate 2D defect coordinates (X, Y in mm) and through-thickness inter-ply depth using Time-of-Flight (ToF) and multi-channel dispersion matrices.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl bg-[#0e1c2f]/80 border border-[#3b494b]/30 hover:border-[#00f0ff]/50 transition-all flex flex-col gap-3 group">
              <div className="w-12 h-12 rounded-lg bg-[#132033] text-[#a855f7] flex items-center justify-center border border-[#a855f7]/30 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">analytics</span>
              </div>
              <h3 className="font-bold text-lg text-[#d6e3fe]">Rigorous Model Evaluation</h3>
              <p className="text-xs text-[#b9cacb] leading-relaxed">
                Compare models with 10-fold stratified cross-validation, multi-class confusion matrices, precision, recall, and harmonic F1-scores without data leakage.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl bg-[#0e1c2f]/80 border border-[#3b494b]/30 hover:border-[#00f0ff]/50 transition-all flex flex-col gap-3 group">
              <div className="w-12 h-12 rounded-lg bg-[#132033] text-[#10b981] flex items-center justify-center border border-[#10b981]/30 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
              </div>
              <h3 className="font-bold text-lg text-[#d6e3fe]">Downloadable PDF Reports</h3>
              <p className="text-xs text-[#b9cacb] leading-relaxed">
                Generate publication-ready scientific PDF inspection reports containing embedded waveform and FFT charts, extracted feature tables, and NDE certification recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#3b494b]/30 bg-[#020e21] px-6 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-[#b9cacb]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff]"></span>
            <span>WaveGuard AI • Ultrasonic Guided Wave Classification for Carbon Fibre Composites</span>
          </div>
          <div className="flex items-center gap-6">
            <span>ISO 9712 NDT Compliant</span>
            <span>FAA AC 20-107B</span>
            <span>Academic Software Research Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

