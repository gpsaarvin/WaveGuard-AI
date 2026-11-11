import React, { useState, useEffect } from 'react';
import { AnalysisRecord } from '../types';
import { fetchAnalysisHistory, deleteAnalysis, generateReport } from '../services/api';

export const AnalysisHistory: React.FC = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [search, setSearch] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadHistory = () => {
    setLoading(true);
    fetchAnalysisHistory(search, conditionFilter)
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadHistory();
  }, [search, conditionFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this inspection record?')) {
      try {
        await deleteAnalysis(id);
        loadHistory();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDownloadReport = (recordId: string) => {
    window.open(`/api/reports/${recordId}/download`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#061426] min-h-screen">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#020e21] p-4 rounded-xl border border-[#3b494b]/30 shadow-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-xl">history</span>
            <h1 className="text-xl font-bold text-[#dbfcff]">Specimen Inspection & Analysis History</h1>
          </div>
          <span className="font-mono text-xs text-[#b9cacb]">
            Chronological archive of all ultrasonic guided wave inference runs and certifications
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search specimen or file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#132033] text-xs font-mono text-[#d6e3fe] border border-[#3b494b]/30 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
            />
            <span className="material-symbols-outlined absolute left-2 top-2 text-xs text-[#b9cacb]">
              search
            </span>
          </div>

          {/* Condition Filter */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#132033] text-xs font-mono text-[#00f0ff] border border-[#3b494b]/30 focus:outline-none cursor-pointer"
          >
            <option value="All">All Conditions</option>
            <option value="Healthy Plate">Healthy Plate</option>
            <option value="Delamination">Delamination</option>
            <option value="Crack">Crack</option>
            <option value="Impact Damage">Impact Damage</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#0e1c2f] rounded-xl border border-[#3b494b]/30 shadow-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/20">
          <span className="font-mono text-xs text-[#00f0ff] uppercase font-bold tracking-wider">
            Inspection Records ({history.length})
          </span>
          <span className="font-mono text-[10px] text-[#b9cacb]">FAA / ISO 9712 Traceable</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-[10px] text-[#b9cacb] uppercase tracking-wider bg-[#020e21] border-b border-[#3b494b]/30">
                <th className="py-3 px-3">Analysis ID / Specimen</th>
                <th className="py-3 px-3">Dataset Source</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">Model Architecture</th>
                <th className="py-3 px-3">Date (UTC)</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b494b]/20">
              {history.map((row) => (
                <tr key={row.id} className="hover:bg-[#132033] transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-[#dbfcff] block">{row.specimen_id}</span>
                    <span className="text-[10px] text-[#b9cacb]">{row.id.substring(0, 8)}...</span>
                  </td>
                  <td className="py-3 px-3 text-[#d6e3fe]">{row.dataset_name}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] border ${
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
                      {row.predicted_class}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#00f0ff] font-bold">{row.confidence}%</td>
                  <td className="py-3 px-3 text-[#b9cacb] text-[11px]">{row.model_used}</td>
                  <td className="py-3 px-3 text-[#b9cacb] text-[10px]">
                    {row.created_at ? new Date(row.created_at).toLocaleString() : 'Just now'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedRecord(row)}
                        className="p-1.5 rounded hover:bg-[#1d2a3e] text-[#00f0ff] transition-colors"
                        title="View Detailed Results"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                      <button
                        onClick={() => handleDownloadReport(row.id)}
                        className="p-1.5 rounded hover:bg-[#1d2a3e] text-[#10b981] transition-colors"
                        title="Download PDF Report"
                      >
                        <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 rounded hover:bg-[#93000a]/30 text-[#ffb4ab] transition-colors"
                        title="Delete Record"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal / Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-[#020e21]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1c2f] border border-[#00f0ff]/40 rounded-2xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-xl">description</span>
                <span className="text-sm font-bold text-[#dbfcff]">Analysis Record: {selectedRecord.specimen_id}</span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded hover:bg-[#132033] text-[#b9cacb] hover:text-[#d6e3fe]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#132033]">
                <span className="text-[#b9cacb] block text-[10px]">Predicted Condition</span>
                <span className="text-base text-[#00f0ff] font-bold">{selectedRecord.predicted_class}</span>
              </div>
              <div className="p-2.5 rounded bg-[#132033]">
                <span className="text-[#b9cacb] block text-[10px]">Confidence</span>
                <span className="text-base text-[#10b981] font-bold">{selectedRecord.confidence}%</span>
              </div>
              <div className="p-2.5 rounded bg-[#132033]">
                <span className="text-[#b9cacb] block text-[10px]">Defect Coordinates</span>
                <span className="text-xs text-[#d6e3fe] font-bold">X: {selectedRecord.defect_x_mm}mm, Y: {selectedRecord.defect_y_mm}mm</span>
              </div>
              <div className="p-2.5 rounded bg-[#132033]">
                <span className="text-[#b9cacb] block text-[10px]">Severity</span>
                <span className="text-xs text-[#ffb4ab] font-bold">{selectedRecord.severity_rating}</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[#132033] flex flex-col gap-1">
              <span className="text-[10px] text-[#00f0ff] font-bold">Scientific Explanation:</span>
              <p className="text-xs text-[#b9cacb] leading-relaxed">{selectedRecord.explanation}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleDownloadReport(selectedRecord.id)}
                className="px-4 py-2 rounded-lg bg-[#00f0ff] text-[#00363a] font-bold hover:bg-[#7df4ff] transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>Download Scientific PDF</span>
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-[#132033] hover:bg-[#1d2a3e] text-[#d6e3fe]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

