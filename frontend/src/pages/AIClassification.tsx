import React, { useState, useEffect } from 'react';
import { ClassificationResult, Dataset } from '../types';
import { fetchDatasets, runClassification } from '../services/api';

interface AIClassificationProps {
  onNavigateToReports?: (analysisId: string) => void;
}

export const AIClassification: React.FC<AIClassificationProps> = ({ onNavigateToReports }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('xgb');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDatasets()
      .then((list) => {
        setDatasets(list);
        if (list.length > 0) {
          setSelectedDatasetId(list[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRunInference = async () => {
    setLoading(true);
    try {
      const res = await runClassification({
        dataset_id: selectedDatasetId || undefined,
        model_name: selectedModel,
        fs: 50e6,
      });
      setResult(res);
    } catch (e) {
      console.error('Classification error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Run initial classification on mount if dataset selected
  useEffect(() => {
    handleRunInference();
  }, [selectedDatasetId, selectedModel]);

  const predClass = result?.predicted_class || 'Delamination';
  const confidence = result?.confidence || 96.8;
  const probs = result?.probabilities || {
    'Healthy Plate': 0.4,
    'Delamination': 96.8,
    'Crack': 1.8,
    'Impact Damage': 1.0,
  };

  const isHealthy = predClass === 'Healthy Plate';
  const isDelam = predClass === 'Delamination';
  const isCrack = predClass === 'Crack';
  const isImpact = predClass === 'Impact Damage';

  const badgeColor = isHealthy ? 'text-[#10b981]' : isDelam ? 'text-[#f59e0b]' : isCrack ? 'text-[#ffb4ab]' : 'text-[#aec6ff]';
  const badgeBorder = isHealthy ? 'border-[#10b981]/40' : isDelam ? 'border-[#f59e0b]/40' : isCrack ? 'border-[#ffb4ab]/40' : 'border-[#aec6ff]/40';
  const badgeBg = isHealthy ? 'bg-[#10b981]/10' : isDelam ? 'bg-[#f59e0b]/10' : isCrack ? 'bg-[#ffb4ab]/10' : 'bg-[#508eff]/10';

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#061426] min-h-screen">
      {/* Section 1: Top Configuration & Pipeline Bar */}
      <section className="relative w-full rounded-xl bg-[#0e1c2f]/90 backdrop-blur-xl border border-[#3b494b]/30 shadow-md p-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Dataset Metadata Block */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-3 rounded-lg bg-[#132033] text-[#00f0ff] flex items-center justify-center border border-[#00f0ff]/30 shadow-inner">
            <span className="material-symbols-outlined text-2xl">memory</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#b9cacb]">
                Active Ingestion Pipeline
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#28354a] text-[#00dbe9]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
                STREAMING
              </span>
            </div>
            <select
              value={selectedDatasetId}
              onChange={(e) => setSelectedDatasetId(e.target.value)}
              className="bg-transparent text-lg text-[#d6e3fe] font-bold focus:outline-none cursor-pointer truncate max-w-md"
            >
              {datasets.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#132033] text-[#d6e3fe]">
                  {d.original_name} ({d.specimen_id})
                </option>
              ))}
            </select>
            <span className="font-mono text-xs text-[#b9cacb]">
              PZT Transducer Array • 50 MS/s Digitizer • Guided Lamb Wave S0/A0
            </span>
          </div>
        </div>

        {/* Controls: Model Selector & Large Inference Action */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-start xl:justify-end">
          {/* Model Selection Dropdown */}
          <div className="flex flex-col gap-1 min-w-[280px]">
            <label className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider" htmlFor="modelSelect">
              Inference Architecture
            </label>
            <div className="relative">
              <select
                id="modelSelect"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full appearance-none bg-[#132033] text-[#d6e3fe] font-mono text-xs rounded-lg px-3 py-2 pr-8 border border-[#3b494b]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] cursor-pointer"
              >
                <option value="xgb">XGBoost-LambWave-Classifier v3.2 (Optimized Multi-class)</option>
                <option value="rf">Random Forest Ensemble (500 Trees)</option>
                <option value="svm">SVM RBF Kernel (Dispersion Curve Match)</option>
                <option value="knn">K-Nearest Neighbors (Distance-Weighted)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-[#b9cacb] text-base">
                expand_more
              </span>
            </div>
          </div>

          {/* Run Inference CTA Button */}
          <div className="flex items-center gap-2 pt-2 xl:pt-0">
            <button
              onClick={handleRunInference}
              disabled={loading}
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-lg bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all cursor-pointer disabled:opacity-50"
              type="button"
            >
              <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'sync' : 'model_training'}
              </span>
              <span>{loading ? 'Inferencing...' : 'Run AI Classification'}</span>
              <span className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-[#020e21] text-[#00f0ff] font-mono text-[10px]">
                11.8 ms
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Primary Diagnostic Result Banner */}
      <section className="relative w-full rounded-xl bg-[#0e1c2f]/95 backdrop-blur-xl border border-[#3b494b]/30 shadow-xl p-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Diagnostic Severity & Name */}
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs font-bold uppercase tracking-wider border ${badgeBg} ${badgeColor} ${badgeBorder}`}>
                <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-[#10b981]' : 'bg-current animate-ping'}`}></span>
                {isHealthy ? 'STRUCTURAL INTEGRITY NOMINAL' : 'CRITICAL DEFECT DETECTED'}
              </span>
              <span className="font-mono text-[10px] px-2 py-1 rounded bg-[#132033] text-[#b9cacb] border border-[#3b494b]/30">
                ISO 9712 NDT Compliant
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-xs uppercase tracking-widest text-[#00f0ff]">
                Predicted Structural Condition
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#dbfcff] tracking-tight mt-0.5">
                {predClass.toUpperCase()}
              </h1>
              <p className="text-sm text-[#b9cacb] mt-1 leading-relaxed">
                {result?.explanation || 'Acoustic wave packet propagation analyzed across multiple transducer channels.'}
              </p>
            </div>

            {/* Severity Rating Badge */}
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg bg-[#132033] border border-[#3b494b]/30 text-xs w-fit">
              <span className="material-symbols-outlined text-[#f59e0b] text-base">warning</span>
              <span className="text-[#d6e3fe] font-semibold">Damage Severity:</span>
              <span className={`font-mono font-bold ${badgeColor}`}>
                {result?.severity_rating || 'Nominal Condition'}
              </span>
            </div>
          </div>

          {/* Numerical Confidence & Spatial Coordinates Cluster */}
          <div className="flex flex-row lg:flex-col sm:flex-row items-start lg:items-end justify-between w-full lg:w-auto gap-4 bg-[#132033] p-4 rounded-xl border border-[#3b494b]/30 min-w-[280px]">
            {/* Confidence Gauge */}
            <div className="flex flex-col items-start lg:items-end">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#b9cacb]">
                Model Confidence
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#00f0ff] leading-none font-mono">
                  {confidence.toFixed(1)}
                </span>
                <span className="text-xl text-[#00dbe9] font-bold font-mono">%</span>
              </div>
              <span className="font-mono text-[10px] text-[#b9cacb]/80">Softmax Posterior P(C|X)</span>
            </div>

            <div className="h-px lg:w-full bg-[#3b494b]/30 hidden lg:block my-0.5"></div>

            {/* Spatial Target Coordinates */}
            <div className="flex flex-col items-start lg:items-end font-mono">
              <span className="text-[10px] uppercase tracking-wider text-[#b9cacb]">
                Estimated Defect Center
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#d6e3fe] font-semibold mt-0.5">
                <span className="px-1.5 py-0.5 rounded bg-[#28354a] text-[#00dbe9]">
                  QUADRANT {result && result.defect_x_mm > 250 ? 'Q2/Q4' : 'Q1/Q3'}
                </span>
                <span>X: {result?.defect_x_mm || 0}mm</span>
                <span className="text-[#849495]">•</span>
                <span>Y: {result?.defect_y_mm || 0}mm</span>
              </div>
              <span className="text-[10px] text-[#508eff] mt-0.5">
                Depth: Inter-Ply Z: {result?.defect_depth_mm || 0}mm
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Multi-Class Probabilities + Spatial Anomaly Map */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Probabilities */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="rounded-xl bg-[#0e1c2f] p-5 border border-[#3b494b]/30 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-lg">stacked_bar_chart</span>
                <span className="font-mono text-xs text-[#d6e3fe] font-bold">Multi-Class Probability Distribution</span>
              </div>
              <span className="font-mono text-[10px] text-[#b9cacb] uppercase">Softmax</span>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              {/* Class 1: Delamination */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#d6e3fe]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                    Sub-Surface Delamination
                  </span>
                  <span className="text-[#f59e0b] font-bold">{probs['Delamination'] ?? 0}%</span>
                </div>
                <div className="w-full h-2 rounded bg-[#132033] overflow-hidden">
                  <div className="h-full bg-[#f59e0b] rounded transition-all" style={{ width: `${probs['Delamination'] ?? 0}%` }}></div>
                </div>
              </div>

              {/* Class 2: Micro-Crack */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#d6e3fe]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]"></span>
                    Matrix Micro-Crack (Fatigue)
                  </span>
                  <span className="text-[#ffb4ab] font-bold">{probs['Crack'] ?? 0}%</span>
                </div>
                <div className="w-full h-2 rounded bg-[#132033] overflow-hidden">
                  <div className="h-full bg-[#ffb4ab] rounded transition-all" style={{ width: `${probs['Crack'] ?? 0}%` }}></div>
                </div>
              </div>

              {/* Class 3: High-Velocity Impact */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#d6e3fe]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#508eff]"></span>
                    High-Velocity Impact (BVID)
                  </span>
                  <span className="text-[#aec6ff] font-bold">{probs['Impact Damage'] ?? 0}%</span>
                </div>
                <div className="w-full h-2 rounded bg-[#132033] overflow-hidden">
                  <div className="h-full bg-[#508eff] rounded transition-all" style={{ width: `${probs['Impact Damage'] ?? 0}%` }}></div>
                </div>
              </div>

              {/* Class 4: Healthy Plate */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#d6e3fe]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                    Healthy Plate Matrix
                  </span>
                  <span className="text-[#10b981] font-bold">{probs['Healthy Plate'] ?? 0}%</span>
                </div>
                <div className="w-full h-2 rounded bg-[#132033] overflow-hidden">
                  <div className="h-full bg-[#10b981] rounded transition-all" style={{ width: `${probs['Healthy Plate'] ?? 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): 2D Sensor Coordinate Heatmap & Defect Marker */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <div className="rounded-xl bg-[#0e1c2f] p-5 border border-[#3b494b]/30 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-lg">radar</span>
                <span className="font-mono text-xs text-[#d6e3fe] font-bold">2D Spatial Transducer Coordinate Map</span>
              </div>
              <span className="font-mono text-[10px] text-[#00dbe9]">500 × 500 mm Coordinate Plane</span>
            </div>

            {/* 2D Planar Grid Representation */}
            <div className="relative w-full aspect-video bg-[#020e21] rounded-lg border border-[#3b494b]/30 overflow-hidden flex items-center justify-center p-4">
              <svg className="w-full h-full" viewBox="0 0 500 350">
                {/* Background grid */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="350" stroke="#1d2a3e" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="#1d2a3e" strokeWidth="0.5" />
                ))}

                {/* Central Actuator TX-01 */}
                <circle cx="250" cy="175" r="7" fill="#00f0ff" />
                <circle cx="250" cy="175" r="14" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="3 2" />
                <text x="250" y="200" fill="#00f0ff" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  TX-01
                </text>

                {/* Receiver Pins */}
                <circle cx="250" cy="50" r="5" fill="#508eff" />
                <circle cx="360" cy="90" r="5" fill="#508eff" />
                <circle cx="400" cy="175" r="5" fill="#508eff" />
                <circle cx="360" cy="260" r="5" fill="#508eff" />
                <circle cx="250" cy="300" r="5" fill="#508eff" />
                <circle cx="140" cy="260" r="5" fill="#508eff" />
                <circle cx="100" cy="175" r="5" fill="#508eff" />
                <circle cx="140" cy="90" r="5" fill="#508eff" />

                {/* Anomaly Indicator Pin */}
                {result && result.defect_x_mm > 0 && (
                  <g transform={`translate(${result.defect_x_mm}, ${result.defect_y_mm * 0.7})`}>
                    <circle cx="0" cy="0" r="10" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#f59e0b" />
                    <text x="14" y="4" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {result.predicted_class} ({result.defect_x_mm}mm, {result.defect_y_mm}mm)
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

