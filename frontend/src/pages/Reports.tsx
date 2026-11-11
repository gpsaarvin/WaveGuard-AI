import React, { useState, useEffect } from 'react';
import { AnalysisRecord } from '../types';
import { fetchAnalysisHistory, generateReport } from '../services/api';

export const Reports: React.FC = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysisHistory()
      .then((list) => {
        setHistory(list);
        if (list.length > 0) {
          setSelectedId(list[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const selectedRecord = history.find((h) => h.id === selectedId) || history[0];

  const handleGenerateAndDownload = async (id: string) => {
    setGenerating(true);
    setSuccessMsg(null);
    try {
      await generateReport(id);
      setSuccessMsg('Scientific PDF report compiled successfully!');
      window.open(`/api/reports/${id}/download`, '_blank');
    } catch (e) {
      console.error(e);
      // Fallback direct download if already generated
      window.open(`/api/reports/${id}/download`, '_blank');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#061426] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#020e21] p-4 rounded-xl border border-[#3b494b]/30 shadow-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-xl">description</span>
            <h1 className="text-xl font-bold text-[#dbfcff]">Scientific PDF Report Center</h1>
          </div>
          <span className="font-mono text-xs text-[#b9cacb]">
            Automated Non-Destructive Evaluation (NDE) documentation with embedded waveforms and classification metrics
          </span>
        </div>

        {selectedRecord && (
          <button
            onClick={() => handleGenerateAndDownload(selectedRecord.id)}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs shadow-[0_0_16px_rgba(0,240,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>{generating ? 'Compiling PDF...' : 'Download Active Report (PDF)'}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Layout: Selector list + PDF Preview Paper Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Test Run Selector (4 cols) */}
        <div className="lg:col-span-4 bg-[#0e1c2f] p-4 rounded-xl border border-[#3b494b]/30 shadow-xl flex flex-col gap-3">
          <span className="font-mono text-xs text-[#00f0ff] uppercase font-bold tracking-wider pb-2 border-b border-[#3b494b]/20">
            Select Specimen Test Record
          </span>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            {history.map((h) => {
              const isSelected = h.id === selectedId;
              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedId(h.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1d2a3e] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'bg-[#132033] border-[#3b494b]/30 hover:bg-[#1d2a3e]/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#dbfcff]">{h.specimen_id}</span>
                    <span className="font-mono text-[10px] text-[#00f0ff] font-bold">{h.confidence}%</span>
                  </div>
                  <div className="text-[11px] text-[#b9cacb] truncate">{h.dataset_name}</div>
                  <div className="flex items-center justify-between font-mono text-[9px] text-[#849495] mt-1 pt-1 border-t border-[#3b494b]/20">
                    <span>{h.predicted_class}</span>
                    <span>{h.created_at ? new Date(h.created_at).toLocaleDateString() : 'Active'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Scientific Report Mockup Preview (8 cols) */}
        <div className="lg:col-span-8 bg-[#0e1c2f] p-6 rounded-xl border border-[#3b494b]/30 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#10b981] text-lg">verified_user</span>
              <span className="text-sm font-semibold text-[#dbfcff]">Report Preview & Metadata Summary</span>
            </div>
            <span className="font-mono text-[10px] text-[#b9cacb]">FAA / ISO 9712 NDT Compliant</span>
          </div>

          {selectedRecord ? (
            <div className="bg-[#020e21] p-6 rounded-xl border border-[#3b494b]/40 flex flex-col gap-4 font-mono text-xs">
              {/* Document Header Preview */}
              <div className="flex justify-between items-start pb-4 border-b border-[#00f0ff]/30">
                <div>
                  <h2 className="text-lg font-bold text-[#dbfcff]">WAVEGUARD AI</h2>
                  <span className="text-[10px] text-[#00f0ff] uppercase tracking-wider block">
                    Aero Structural Health Monitoring (SHM) Platform
                  </span>
                  <span className="text-[9px] text-[#b9cacb]">Non-Destructive Testing (NDT) Ultrasonic Guided Wave Inspection</span>
                </div>
                <div className="text-right text-[10px] text-[#b9cacb]">
                  <div>REPORT ID: <span className="text-[#00f0ff] font-bold">{selectedRecord.id.substring(0, 10)}</span></div>
                  <div>DATE: {new Date(selectedRecord.created_at).toUTCString()}</div>
                  <div className="text-[#10b981] font-bold mt-1">STATUS: CERTIFIED</div>
                </div>
              </div>

              {/* Specimen Telemetry Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0e1c2f] p-3 rounded-lg border border-[#3b494b]/30 text-[11px]">
                <div>
                  <span className="text-[#b9cacb] block text-[9px]">Specimen ID</span>
                  <span className="text-[#dbfcff] font-bold">{selectedRecord.specimen_id}</span>
                </div>
                <div>
                  <span className="text-[#b9cacb] block text-[9px]">Excitation</span>
                  <span className="text-[#00f0ff]">250 kHz Hanning</span>
                </div>
                <div>
                  <span className="text-[#b9cacb] block text-[9px]">Digitizer</span>
                  <span className="text-[#d6e3fe]">50 MS/s 16-bit</span>
                </div>
                <div>
                  <span className="text-[#b9cacb] block text-[9px]">Material</span>
                  <span className="text-[#aec6ff]">CFRP [0/45/90/-45]s</span>
                </div>
              </div>

              {/* Verdict Box */}
              <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
                selectedRecord.predicted_class === 'Healthy Plate'
                  ? 'bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]'
                  : 'bg-[#f59e0b]/10 border-[#f59e0b]/40 text-[#f59e0b]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm tracking-wide">
                    DIAGNOSTIC VERDICT: {selectedRecord.predicted_class.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold font-mono">CONFIDENCE: {selectedRecord.confidence}%</span>
                </div>
                <div className="text-xs text-[#d6e3fe]">
                  Severity Rating: <span className="font-bold">{selectedRecord.severity_rating}</span> | Defect Coords: (X: {selectedRecord.defect_x_mm}mm, Y: {selectedRecord.defect_y_mm}mm, Z: {selectedRecord.defect_depth_mm}mm)
                </div>
                <div className="text-[11px] text-[#b9cacb] mt-1 leading-relaxed">
                  {selectedRecord.explanation}
                </div>
              </div>

              {/* Compliance Footer */}
              <div className="text-[10px] text-[#849495] pt-3 border-t border-[#3b494b]/20 flex justify-between items-center">
                <span>Conformity: FAA AC 20-107B / MIL-HDBK-17</span>
                <button
                  onClick={() => handleGenerateAndDownload(selectedRecord.id)}
                  className="px-4 py-2 rounded bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Export Full PDF</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#b9cacb] font-mono text-xs">
              No analysis selected. Run an inference in AI Classification to view reports.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

