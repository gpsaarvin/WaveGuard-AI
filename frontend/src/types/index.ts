export interface Dataset {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  row_count: number;
  col_count: number;
  columns: string[];
  missing_values_count: number;
  sampling_rate_mhz: number;
  actuator_freq_khz: number;
  material: string;
  specimen_id: string;
  sample_type: string;
  status: string;
  upload_timestamp: string;
}

export interface DatasetData {
  dataset_id: string;
  filename: string;
  specimen_id: string;
  material: string;
  sampling_rate_mhz: number;
  actuator_freq_khz: number;
  channel: string;
  channels: string[];
  total_points: number;
  time_us: number[];
  signal: number[];
  raw_signal: number[];
}

export interface StatisticalFeatures {
  mean: number;
  std: number;
  rms: number;
  peak: number;
  peak_to_peak: number;
  variance?: number;
  skewness: number;
  kurtosis: number;
  crest_factor?: number;
  shape_factor?: number;
  impulse_factor?: number;
  clearance_factor?: number;
  signal_energy: number;
  snr_db: number;
  dominant_frequency_khz: number;
  spectral_centroid_khz: number;
  spectral_spread_khz?: number;
  time_of_flight_us?: number;
}

export interface ClassificationResult {
  analysis_id?: string;
  predicted_class: "Healthy Plate" | "Delamination" | "Crack" | "Impact Damage" | string;
  confidence: number;
  probabilities: {
    "Healthy Plate": number;
    "Delamination": number;
    "Crack": number;
    "Impact Damage": number;
    [key: string]: number;
  };
  model_used: string;
  defect_x_mm: number;
  defect_y_mm: number;
  defect_depth_mm: number;
  severity_rating: string;
  explanation: string;
  features?: StatisticalFeatures;
  created_at?: string;
}

export interface AnalysisRecord {
  id: string;
  dataset_id?: string;
  dataset_name: string;
  specimen_id: string;
  material: string;
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
  model_used: string;
  defect_x_mm: number;
  defect_y_mm: number;
  defect_depth_mm: number;
  severity_rating: string;
  explanation: string;
  report_path?: string;
  status: string;
  created_at: string;
}

export interface ModelMetric {
  name: string;
  key: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  cv_scores: number[];
  confusion_matrix: number[][];
  n_samples: number;
}

export interface DashboardStats {
  total_datasets: number;
  total_analyses: number;
  healthy_count: number;
  defect_count: number;
  delamination_count: number;
  crack_count: number;
  impact_count: number;
  healthy_ratio: number;
  benchmark_accuracy: number;
  recent_activity: AnalysisRecord[];
  active_specimen: {
    id: string;
    material: string;
    dimensions: string;
    frequency_khz: number;
    sampling_rate_msps: number;
    s0_velocity_ms: number;
    a0_velocity_ms: number;
  };
}

