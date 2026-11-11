import {
  Dataset,
  DatasetData,
  StatisticalFeatures,
  ClassificationResult,
  AnalysisRecord,
  DashboardStats,
  ModelMetric
} from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') || '/api';

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to load dashboard metrics');
  return res.json();
}

export async function fetchDatasets(): Promise<Dataset[]> {
  const res = await fetch(`${API_BASE}/datasets`);
  if (!res.ok) throw new Error('Failed to fetch datasets');
  return res.json();
}

export async function fetchDatasetData(id: string, channel?: string): Promise<DatasetData> {
  const url = channel
    ? `${API_BASE}/datasets/${id}/data?channel=${encodeURIComponent(channel)}`
    : `${API_BASE}/datasets/${id}/data`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch dataset signal');
  return res.json();
}

export async function uploadDatasetFile(formData: FormData): Promise<Dataset> {
  const res = await fetch(`${API_BASE}/datasets/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

export async function deleteDataset(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/datasets/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete dataset');
}

export async function applyFilter(data: {
  signal: number[];
  fs?: number;
  filter_type: string;
  lowcut_khz?: number;
  highcut_khz?: number;
  order?: number;
}): Promise<{ filtered_signal: number[] }> {
  const res = await fetch(`${API_BASE}/signal/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Filtering failed');
  return res.json();
}

export async function preprocessSignal(data: {
  signal: number[];
  normalize?: boolean;
  normalize_method?: string;
  smooth?: boolean;
  window_size?: number;
}): Promise<{ processed_signal: number[] }> {
  const res = await fetch(`${API_BASE}/signal/preprocess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Preprocessing failed');
  return res.json();
}

export async function computeFFT(data: {
  signal: number[];
  fs?: number;
}): Promise<{
  frequencies_khz: number[];
  magnitudes: number[];
  dominant_freq_khz: number;
  peak_magnitude: number;
}> {
  const res = await fetch(`${API_BASE}/signal/fft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('FFT calculation failed');
  return res.json();
}

export async function computeSpectrogram(data: {
  signal: number[];
  fs?: number;
  nperseg?: number;
  noverlap?: number;
}): Promise<{
  time_us: number[];
  frequencies_khz: number[];
  spectrogram_db: number[][];
}> {
  const res = await fetch(`${API_BASE}/signal/spectrogram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Spectrogram calculation failed');
  return res.json();
}

export async function extractFeatures(data: {
  signal: number[];
  fs?: number;
  dataset_id?: string;
  channel_name?: string;
}): Promise<StatisticalFeatures> {
  const res = await fetch(`${API_BASE}/features/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Feature extraction failed');
  return res.json();
}

export async function runClassification(data: {
  dataset_id?: string;
  signal?: number[];
  channel?: string;
  model_name?: string;
  fs?: number;
}): Promise<ClassificationResult> {
  const res = await fetch(`${API_BASE}/classification/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Classification inference failed');
  return res.json();
}

export async function fetchEvaluation(): Promise<{
  benchmark_dataset: string;
  split: string;
  classes: string[];
  models: Record<string, ModelMetric>;
}> {
  const res = await fetch(`${API_BASE}/model/evaluation`);
  if (!res.ok) throw new Error('Failed to load model evaluation metrics');
  return res.json();
}

export async function fetchAnalysisHistory(search?: string, condition?: string): Promise<AnalysisRecord[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (condition) params.append('condition', condition);

  const res = await fetch(`${API_BASE}/analysis/history?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch analysis history');
  return res.json();
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/analysis/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete analysis record');
}

export async function generateReport(analysis_id: string): Promise<{ download_url: string }> {
  const res = await fetch(`${API_BASE}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysis_id }),
  });
  if (!res.ok) throw new Error('Report generation failed');
  return res.json();
}

