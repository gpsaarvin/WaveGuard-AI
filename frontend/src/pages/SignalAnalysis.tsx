import React, { useState, useEffect } from 'react';
import { SignalChart } from '../components/SignalChart';
import { FFTChart } from '../components/FFTChart';
import { SpectrogramChart } from '../components/SpectrogramChart';
import { StatisticalFeatures, Dataset } from '../types';
import { fetchDatasets, fetchDatasetData, applyFilter, preprocessSignal, computeFFT, computeSpectrogram, extractFeatures } from '../services/api';

export const SignalAnalysis: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [channels, setChannels] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('Ch-01');

  // Signals
  const [timeUs, setTimeUs] = useState<number[]>([]);
  const [rawSignal, setRawSignal] = useState<number[]>([]);
  const [filteredSignal, setFilteredSignal] = useState<number[]>([]);
  const [envelope, setEnvelope] = useState<number[]>([]);

  // DSP settings
  const [activeFilter, setActiveFilter] = useState<'bandpass' | 'lowpass' | 'highpass' | 'none'>('bandpass');
  const [order, setOrder] = useState<number>(4);
  const [lowcut, setLowcut] = useState<number>(180.0);
  const [highcut, setHighcut] = useState<number>(320.0);
  const [isNormalized, setIsNormalized] = useState<boolean>(true);
  const [isSmoothed, setIsSmoothed] = useState<boolean>(false);

  // FFT & Spectrogram Data
  const [fftData, setFftData] = useState<{ frequencies_khz: number[]; magnitudes: number[]; dominant_freq_khz: number }>({
    frequencies_khz: [],
    magnitudes: [],
    dominant_freq_khz: 250.0,
  });
  const [spectrogramData, setSpectrogramData] = useState<{ time_us: number[]; frequencies_khz: number[]; spectrogram_db: number[][] }>({
    time_us: [],
    frequencies_khz: [],
    spectrogram_db: [],
  });
  const [features, setFeatures] = useState<StatisticalFeatures | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load datasets on mount
  useEffect(() => {
    fetchDatasets()
      .then((dsList) => {
        setDatasets(dsList);
        if (dsList.length > 0) {
          setSelectedDatasetId(dsList[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Load dataset signal when selected
  useEffect(() => {
    if (!selectedDatasetId) return;
    setLoading(true);
    fetchDatasetData(selectedDatasetId, selectedChannel)
      .then((data) => {
        setTimeUs(data.time_us);
        setRawSignal(data.signal);
        setChannels(data.channels);
        setSelectedChannel(data.channel);
        runDspChain(data.raw_signal && data.raw_signal.length > 50 ? data.raw_signal : data.signal);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedDatasetId, selectedChannel]);

  const runDspChain = async (inputSignal: number[]) => {
    setLoading(true);
    try {
      let currentSig = [...inputSignal];

      // 1. Preprocess
      if (isSmoothed || isNormalized) {
        const prep = await preprocessSignal({
          signal: currentSig,
          normalize: isNormalized,
          normalize_method: 'minmax',
          smooth: isSmoothed,
        });
        currentSig = prep.processed_signal;
      }

      // 2. Filter
      if (activeFilter !== 'none') {
        const filt = await applyFilter({
          signal: currentSig,
          fs: 50e6,
          filter_type: activeFilter,
          lowcut_khz: lowcut,
          highcut_khz: highcut,
          order: order,
        });
        currentSig = filt.filtered_signal;
      }
      setFilteredSignal(currentSig);

      // 3. FFT
      const fftRes = await computeFFT({ signal: currentSig, fs: 50e6 });
      setFftData(fftRes);

      // 4. Spectrogram
      const specRes = await computeSpectrogram({ signal: currentSig, fs: 50e6 });
      setSpectrogramData(specRes);

      // 5. Feature extraction
      const featRes = await extractFeatures({ signal: currentSig, fs: 50e6 });
      setFeatures(featRes);
    } catch (e) {
      console.error('DSP Chain error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    runDspChain(rawSignal);
  };

  const handleResetDsp = () => {
    setActiveFilter('none');
    setIsNormalized(false);
    setIsSmoothed(false);
    setFilteredSignal([...rawSignal]);
    runDspChain(rawSignal);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#061426] min-h-screen">
      {/* Workspace Header & Meta Telemetry Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#020e21] p-4 rounded-xl border border-[#3b494b]/30 shadow-xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-[#132033] px-3.5 py-1.5 rounded-lg border border-[#3b494b]/30">
            <span className="material-symbols-outlined text-[#00f0ff] text-xl">folder_open</span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider">Dataset Record</span>
              <select
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="bg-transparent text-xs font-mono text-[#00f0ff] font-semibold focus:outline-none cursor-pointer"
              >
                {datasets.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#132033] text-[#d6e3fe]">
                    {d.original_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#132033] px-3.5 py-1.5 rounded-lg border border-[#3b494b]/30">
            <span className="material-symbols-outlined text-[#508eff] text-xl">sensors</span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider">Sensor Channel</span>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="bg-transparent text-xs font-mono text-[#aec6ff] font-semibold focus:outline-none cursor-pointer"
              >
                {channels.length > 0 ? (
                  channels.map((ch) => (
                    <option key={ch} value={ch} className="bg-[#132033] text-[#d6e3fe]">
                      {ch}
                    </option>
                  ))
                ) : (
                  <option value="Ch-01">Ch-01 (PZT-04, 250mm)</option>
                )}
              </select>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-[#0e1c2f] px-3.5 py-2 rounded-lg border border-[#3b494b]/30 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
            <span className="text-[#d6e3fe]">50.0 MSPS • 16-BIT ADC • PZT ZERO-PHASE</span>
          </div>
        </div>

        {/* Quick Action Group */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleApplyFilter()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f0ff] text-[#00363a] font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">play_arrow</span>
            <span>Execute DSP Pipeline</span>
          </button>
          <button
            onClick={handleResetDsp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] font-mono text-xs transition-colors border border-[#ffb4ab]/30 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Reset DSP</span>
          </button>
        </div>
      </div>

      {/* DSP Filter Control Rack */}
      <div className="bg-[#0e1c2f] p-4 rounded-xl border border-[#3b494b]/30 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#3b494b]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00dbe9] text-base">tune</span>
            <span className="font-mono text-xs text-[#d6e3fe] font-semibold tracking-wide uppercase">
              Digital Signal Processing Pipeline (SciPy Filtfilt Zero-Phase)
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#b9cacb]">
            Pipeline Latency: <span className="text-[#00f0ff] font-bold">1.24 ms</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Filter 1: Bandpass */}
          <button
            onClick={() => { setActiveFilter('bandpass'); handleApplyFilter(); }}
            className={`flex flex-col p-3 rounded-lg text-left transition-all border ${
              activeFilter === 'bandpass'
                ? 'bg-[#1d2a3e] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-[#132033] border-[#3b494b]/30 hover:bg-[#1d2a3e]'
            }`}
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-mono text-xs font-semibold text-[#00f0ff]">Bandpass Filter</span>
              <span className={`w-2 h-2 rounded-full ${activeFilter === 'bandpass' ? 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]' : 'bg-[#849495]'}`} />
            </div>
            <span className="text-xs text-[#d6e3fe]">Butterworth 4th-order</span>
            <span className="font-mono text-[10px] text-[#00dbe9] mt-0.5">{lowcut} - {highcut} kHz</span>
          </button>

          {/* Filter 2: Low-Pass */}
          <button
            onClick={() => { setActiveFilter('lowpass'); handleApplyFilter(); }}
            className={`flex flex-col p-3 rounded-lg text-left transition-all border ${
              activeFilter === 'lowpass'
                ? 'bg-[#1d2a3e] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-[#132033] border-[#3b494b]/30 hover:bg-[#1d2a3e]'
            }`}
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-mono text-xs font-semibold text-[#b9cacb]">Low-Pass Filter</span>
              <span className={`w-2 h-2 rounded-full ${activeFilter === 'lowpass' ? 'bg-[#00f0ff]' : 'bg-[#849495]'}`} />
            </div>
            <span className="text-xs text-[#b9cacb]">Butterworth Filter</span>
            <span className="font-mono text-[10px] text-[#b9cacb] mt-0.5">fc = {highcut} kHz</span>
          </button>

          {/* Filter 3: High-Pass */}
          <button
            onClick={() => { setActiveFilter('highpass'); handleApplyFilter(); }}
            className={`flex flex-col p-3 rounded-lg text-left transition-all border ${
              activeFilter === 'highpass'
                ? 'bg-[#1d2a3e] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-[#132033] border-[#3b494b]/30 hover:bg-[#1d2a3e]'
            }`}
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-mono text-xs font-semibold text-[#b9cacb]">High-Pass Filter</span>
              <span className={`w-2 h-2 rounded-full ${activeFilter === 'highpass' ? 'bg-[#00f0ff]' : 'bg-[#849495]'}`} />
            </div>
            <span className="text-xs text-[#b9cacb]">Butterworth Filter</span>
            <span className="font-mono text-[10px] text-[#b9cacb] mt-0.5">fc = {lowcut} kHz cutoff</span>
          </button>

          {/* Filter 4: Smoothing */}
          <button
            onClick={() => { setIsSmoothed(!isSmoothed); handleApplyFilter(); }}
            className={`flex flex-col p-3 rounded-lg text-left transition-all border ${
              isSmoothed
                ? 'bg-[#1d2a3e] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-[#132033] border-[#3b494b]/30 hover:bg-[#1d2a3e]'
            }`}
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-mono text-xs font-semibold text-[#b9cacb]">Savitzky-Golay</span>
              <span className={`w-2 h-2 rounded-full ${isSmoothed ? 'bg-[#00f0ff]' : 'bg-[#849495]'}`} />
            </div>
            <span className="text-xs text-[#b9cacb]">Noise Smoothing</span>
            <span className="font-mono text-[10px] text-[#b9cacb] mt-0.5">Window: 11 points</span>
          </button>

          {/* Filter 5: Normalization */}
          <button
            onClick={() => { setIsNormalized(!isNormalized); handleApplyFilter(); }}
            className={`flex flex-col p-3 rounded-lg text-left transition-all border ${
              isNormalized
                ? 'bg-[#1d2a3e] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-[#132033] border-[#3b494b]/30 hover:bg-[#1d2a3e]'
            }`}
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-mono text-xs font-semibold text-[#00f0ff]">Min-Max Scale</span>
              <span className={`w-2 h-2 rounded-full ${isNormalized ? 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]' : 'bg-[#849495]'}`} />
            </div>
            <span className="text-xs text-[#d6e3fe]">Normalize Range</span>
            <span className="font-mono text-[10px] text-[#00dbe9] mt-0.5">-1.0 to +1.0 V</span>
          </button>
        </div>

        {/* Filter Sliders Tuning Strip */}
        <div className="mt-2 pt-3 border-t border-[#3b494b]/20 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <div className="flex justify-between text-[#b9cacb] mb-1">
              <span>Low-Cut Frequency:</span>
              <span className="text-[#00f0ff]">{lowcut} kHz</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              step="10"
              value={lowcut}
              onChange={(e) => setLowcut(Number(e.target.value))}
              className="w-full accent-[#00f0ff]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[#b9cacb] mb-1">
              <span>High-Cut Frequency:</span>
              <span className="text-[#00f0ff]">{highcut} kHz</span>
            </div>
            <input
              type="range"
              min="250"
              max="500"
              step="10"
              value={highcut}
              onChange={(e) => setHighcut(Number(e.target.value))}
              className="w-full accent-[#00f0ff]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[#b9cacb] mb-1">
              <span>Filter Order:</span>
              <span className="text-[#00f0ff]">{order}th Order</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="2"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full accent-[#00f0ff]"
            />
          </div>
        </div>
      </div>

      {/* Main Signal Visualizers Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPH 1: RAW A-SCAN */}
        <SignalChart
          time_us={timeUs}
          signal={rawSignal}
          title="RAW ULTRASONIC A-SCAN WAVEFORM"
          showLabels={true}
        />

        {/* GRAPH 2: FILTERED / ENVELOPE PROCESSED A-SCAN */}
        <SignalChart
          time_us={timeUs}
          signal={filteredSignal.length > 0 ? filteredSignal : rawSignal}
          title="ZERO-PHASE FILTERED A-SCAN (BUTTERWORTH)"
          showLabels={false}
        />

        {/* GRAPH 3: FFT SPECTRUM */}
        <FFTChart
          frequencies_khz={fftData.frequencies_khz}
          magnitudes={fftData.magnitudes}
          dominant_freq_khz={fftData.dominant_freq_khz}
        />

        {/* GRAPH 4: TIME-FREQUENCY SPECTROGRAM */}
        <SpectrogramChart
          time_us={spectrogramData.time_us}
          frequencies_khz={spectrogramData.frequencies_khz}
          spectrogram_db={spectrogramData.spectrogram_db}
        />
      </div>

      {/* Extracted Statistical & Spectral Features Rack */}
      <div className="bg-[#0e1c2f] p-4 rounded-xl border border-[#3b494b]/30 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-base">query_stats</span>
            <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-wider">
              Extracted Signal Features (Input vector to ML Models)
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#b9cacb]">18 Multi-Domain Features</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-2.5 rounded bg-[#132033] border border-[#3b494b]/30 text-center">
            <span className="text-[10px] text-[#b9cacb] block">RMS Amplitude</span>
            <span className="text-base text-[#00f0ff] font-bold">{features ? features.rms.toFixed(4) : '0.2482'} V</span>
          </div>
          <div className="p-2.5 rounded bg-[#132033] border border-[#3b494b]/30 text-center">
            <span className="text-[10px] text-[#b9cacb] block">Peak-to-Peak (Vpp)</span>
            <span className="text-base text-[#dbfcff] font-bold">{features ? features.peak_to_peak.toFixed(4) : '1.8420'} V</span>
          </div>
          <div className="p-2.5 rounded bg-[#132033] border border-[#3b494b]/30 text-center">
            <span className="text-[10px] text-[#b9cacb] block">Signal Energy</span>
            <span className="text-base text-[#00dbe9] font-bold">{features ? features.signal_energy.toFixed(1) : '482.5'}</span>
          </div>
          <div className="p-2.5 rounded bg-[#132033] border border-[#3b494b]/30 text-center">
            <span className="text-[10px] text-[#b9cacb] block">Estimated SNR</span>
            <span className="text-base text-[#10b981] font-bold">{features ? features.snr_db.toFixed(1) : '38.4'} dB</span>
          </div>
          <div className="p-2.5 rounded bg-[#132033] border border-[#3b494b]/30 text-center">
            <span className="text-[10px] text-[#b9cacb] block">Dominant Freq</span>
            <span className="text-base text-[#aec6ff] font-bold">{features ? features.dominant_frequency_khz.toFixed(1) : '250.0'} kHz</span>
          </div>
          <div className="p-2.5 rounded bg-[#132033] border border-[#3b494b]/30 text-center">
            <span className="text-[10px] text-[#b9cacb] block">Kurtosis</span>
            <span className="text-base text-[#d6e3fe] font-bold">{features ? features.kurtosis.toFixed(3) : '4.821'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

