import React, { useState, useEffect, useRef } from 'react';
import { Dataset } from '../types';
import { fetchDatasets, uploadDatasetFile, deleteDataset } from '../services/api';

export const DatasetManagement: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    setLoading(true);
    fetchDatasets()
      .then((list) => {
        setDatasets(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sampling_rate_mhz', '50.0');
    formData.append('actuator_freq_khz', '250.0');
    formData.append('material', 'CFRP Quasi-Isotropic [0/45/90/-45]s');
    formData.append('specimen_id', file.name.replace(/\.[^/.]+$/, ''));

    try {
      const res = await uploadDatasetFile(formData);
      setSuccessMsg(`Dataset "${res.original_name}" validated and ingested successfully! (${res.row_count} rows, ${res.col_count} columns)`);
      loadData();
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete dataset "${name}"?`)) {
      try {
        await deleteDataset(id);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#061426] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#020e21] p-4 rounded-xl border border-[#3b494b]/30 shadow-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-xl">dataset</span>
            <h1 className="text-xl font-bold text-[#dbfcff]">Dataset Management & Ingestion</h1>
          </div>
          <span className="font-mono text-xs text-[#b9cacb]">
            Multi-channel ultrasonic guided wave A-scan repository (CSV, XLSX, XLS)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>Upload New Dataset</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}
      {uploadError && (
        <div className="p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{uploadError}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#00f0ff]/30 hover:border-[#00f0ff] rounded-2xl p-8 bg-[#0e1c2f]/60 hover:bg-[#0e1c2f] transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer group"
      >
        <div className="w-16 h-16 rounded-full bg-[#132033] border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] group-hover:scale-110 transition-transform shadow-[0_0_16px_rgba(0,240,255,0.2)]">
          <span className="material-symbols-outlined text-3xl">cloud_upload</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-base font-bold text-[#d6e3fe]">
            Drag & Drop Ultrasonic Signal Datasets Here, or <span className="text-[#00f0ff] underline">Browse</span>
          </span>
          <span className="font-mono text-xs text-[#b9cacb]">
            Supports standard CSV, XLSX, and XLS formats with multi-channel A-Scan telemetry
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#b9cacb]/80 pt-2">
          <span>Auto-checks missing values</span>
          <span>•</span>
          <span>Detects sampling rate & channels</span>
          <span>•</span>
          <span>Zero-Phase filtfilt compliant</span>
        </div>
      </div>

      {/* Uploaded Datasets List */}
      <div className="bg-[#0e1c2f] rounded-xl border border-[#3b494b]/30 shadow-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#3b494b]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-xl">table_chart</span>
            <h2 className="text-base font-semibold text-[#dbfcff]">Validated Datasets In Repository</h2>
          </div>
          <span className="font-mono text-xs text-[#00dbe9]">{datasets.length} Active Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-[10px] text-[#b9cacb] uppercase tracking-wider bg-[#020e21] border-b border-[#3b494b]/30">
                <th className="py-3 px-3">Dataset Name</th>
                <th className="py-3 px-3">Specimen ID</th>
                <th className="py-3 px-3">Rows</th>
                <th className="py-3 px-3">Channels</th>
                <th className="py-3 px-3">Sampling</th>
                <th className="py-3 px-3">Missing Values</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b494b]/20">
              {datasets.map((d) => (
                <tr key={d.id} className="hover:bg-[#132033] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#d6e3fe]">{d.original_name}</td>
                  <td className="py-3 px-3 text-[#00f0ff]">{d.specimen_id}</td>
                  <td className="py-3 px-3 text-[#b9cacb]">{d.row_count.toLocaleString()}</td>
                  <td className="py-3 px-3 text-[#aec6ff]">
                    {d.columns ? d.columns.filter((c) => !c.toLowerCase().includes('time')).length : d.col_count} channels
                  </td>
                  <td className="py-3 px-3 text-[#b9cacb]">{d.sampling_rate_mhz} MS/s</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${d.missing_values_count === 0 ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#ffb4ab]/10 text-[#ffb4ab]'}`}>
                      {d.missing_values_count} missing
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 text-[10px]">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDelete(d.id, d.original_name)}
                      className="p-1 rounded hover:bg-[#93000a]/30 text-[#ffb4ab] transition-colors"
                      title="Delete Dataset"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

