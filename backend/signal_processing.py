import numpy as np
import scipy.signal as signal
import scipy.stats as stats
from typing import Dict, Any, Tuple, Optional, List


def apply_butterworth_filter(
    sig: np.ndarray,
    fs: float,
    filter_type: str = "bandpass",
    lowcut: float = 150000.0,
    highcut: float = 350000.0,
    order: int = 4
) -> np.ndarray:
    """
    Applies Butterworth zero-phase digital filtering (filtfilt) to ultrasonic guided wave signals.
    Prevents phase shift distortion which is critical for Time-of-Flight (ToF) estimation.
    """
    nyq = 0.5 * fs
    sig_clean = np.nan_to_num(sig, nan=0.0)

    if filter_type == "bandpass":
        low = max(lowcut / nyq, 0.001)
        high = min(highcut / nyq, 0.999)
        if low >= high:
            return sig_clean
        b, a = signal.butter(order, [low, high], btype="bandpass")
    elif filter_type == "lowpass":
        cutoff = min(max(highcut / nyq, 0.001), 0.999)
        b, a = signal.butter(order, cutoff, btype="lowpass")
    elif filter_type == "highpass":
        cutoff = min(max(lowcut / nyq, 0.001), 0.999)
        b, a = signal.butter(order, cutoff, btype="highpass")
    else:
        return sig_clean

    try:
        filtered = signal.filtfilt(b, a, sig_clean)
        return filtered
    except Exception:
        return sig_clean


def normalize_signal(sig: np.ndarray, method: str = "minmax") -> np.ndarray:
    """
    Normalizes ultrasonic waveform to [-1, +1] range or zero-mean unit-variance.
    """
    sig_clean = np.nan_to_num(sig, nan=0.0)
    if method == "minmax":
        max_abs = np.max(np.abs(sig_clean))
        if max_abs > 1e-12:
            return sig_clean / max_abs
        return sig_clean
    elif method == "zscore":
        std = np.std(sig_clean)
        if std > 1e-12:
            return (sig_clean - np.mean(sig_clean)) / std
        return sig_clean
    return sig_clean


def smooth_signal(sig: np.ndarray, window_size: int = 11, method: str = "savgol") -> np.ndarray:
    """
    Smoothes high-frequency electronic noise using Savitzky-Golay or rolling mean.
    """
    sig_clean = np.nan_to_num(sig, nan=0.0)
    if len(sig_clean) <= window_size:
        return sig_clean

    if method == "savgol":
        w = window_size if window_size % 2 == 1 else window_size + 1
        poly = min(3, w - 1)
        try:
            return signal.savgol_filter(sig_clean, w, poly)
        except Exception:
            pass

    # Fallback moving average
    box = np.ones(window_size) / window_size
    return np.convolve(sig_clean, box, mode="same")


def compute_fft(sig: np.ndarray, fs: float) -> Dict[str, Any]:
    """
    Computes Fast Fourier Transform (FFT) spectrum.
    Returns frequencies (in kHz), normalized magnitudes, dominant frequency, and spectral power.
    """
    N = len(sig)
    if N == 0:
        return {"frequencies_khz": [], "magnitudes": [], "dominant_freq_khz": 0.0, "peak_magnitude": 0.0}

    # Windowing to minimize spectral leakage
    window = signal.windows.hann(N)
    sig_windowed = (sig - np.mean(sig)) * window

    fft_vals = np.fft.rfft(sig_windowed)
    freqs = np.fft.rfftfreq(N, d=1.0 / fs)

    magnitudes = np.abs(fft_vals)
    max_mag = np.max(magnitudes) if np.max(magnitudes) > 0 else 1.0
    norm_magnitudes = magnitudes / max_mag

    # Frequencies in kHz
    freqs_khz = freqs / 1000.0

    dom_idx = int(np.argmax(magnitudes))
    dominant_freq_khz = float(freqs_khz[dom_idx]) if dom_idx < len(freqs_khz) else 0.0

    # Downsample points for efficient web visualization if too large
    max_pts = 600
    if len(freqs_khz) > max_pts:
        step = int(np.ceil(len(freqs_khz) / max_pts))
        sampled_freqs = freqs_khz[::step].tolist()
        sampled_mags = norm_magnitudes[::step].tolist()
    else:
        sampled_freqs = freqs_khz.tolist()
        sampled_mags = norm_magnitudes.tolist()

    return {
        "frequencies_khz": [round(f, 2) for f in sampled_freqs],
        "magnitudes": [round(float(m), 4) for m in sampled_mags],
        "dominant_freq_khz": round(dominant_freq_khz, 2),
        "peak_magnitude": round(float(np.max(magnitudes)), 4)
    }


def compute_spectrogram(
    sig: np.ndarray,
    fs: float,
    nperseg: int = 128,
    noverlap: int = 96
) -> Dict[str, Any]:
    """
    Computes Short-Time Fourier Transform (STFT) Spectrogram.
    Returns 2D matrix of spectral density in dB over time (μs) and frequency (kHz).
    """
    if len(sig) < nperseg:
        nperseg = max(16, len(sig) // 2)
        noverlap = nperseg // 2

    f, t, Sxx = signal.spectrogram(
        sig,
        fs=fs,
        window="hann",
        nperseg=nperseg,
        noverlap=noverlap,
        scaling="density"
    )

    # Convert power to decibels (dB)
    Sxx_db = 10.0 * np.log10(np.maximum(Sxx, 1e-12))
    # Normalize between -60 dB and 0 dB
    max_db = np.max(Sxx_db)
    Sxx_norm = np.clip(Sxx_db - max_db, -60.0, 0.0)

    # Convert to microseconds and kHz
    t_us = (t * 1e6).round(2).tolist()
    f_khz = (f / 1000.0).round(2).tolist()

    # Downsample matrix if needed for lightweight transmission
    if len(t_us) > 120:
        step_t = int(np.ceil(len(t_us) / 120))
        t_us = t_us[::step_t]
        Sxx_norm = Sxx_norm[:, ::step_t]

    if len(f_khz) > 80:
        step_f = int(np.ceil(len(f_khz) / 80))
        f_khz = f_khz[::step_f]
        Sxx_norm = Sxx_norm[::step_f, :]

    matrix_data = [[round(float(val), 2) for val in row] for row in Sxx_norm]

    return {
        "time_us": t_us,
        "frequencies_khz": f_khz,
        "spectrogram_db": matrix_data
    }


def compute_hilbert_envelope(sig: np.ndarray) -> Dict[str, Any]:
    """
    Computes the analytic signal and instantaneous Hilbert envelope for Time-of-Flight (ToF).
    """
    analytic = signal.hilbert(sig)
    envelope = np.abs(analytic)
    return {
        "envelope": [round(float(v), 5) for v in envelope.tolist()]
    }


def extract_features(sig: np.ndarray, fs: float) -> Dict[str, float]:
    """
    Extracts comprehensive time-domain, frequency-domain, and statistical features
    from ultrasonic guided wave signals for machine learning classification.
    """
    sig_clean = np.nan_to_num(sig, nan=0.0)
    N = len(sig_clean)
    if N == 0:
        return {}

    # Time-Domain Statistical Metrics
    mean_val = float(np.mean(sig_clean))
    std_val = float(np.std(sig_clean))
    rms_val = float(np.sqrt(np.mean(sig_clean ** 2)))
    peak_val = float(np.max(np.abs(sig_clean)))
    peak_to_peak = float(np.ptp(sig_clean))
    variance = float(np.var(sig_clean))

    skewness = float(stats.skew(sig_clean)) if std_val > 1e-12 else 0.0
    kurtosis_val = float(stats.kurtosis(sig_clean)) if std_val > 1e-12 else 0.0

    # Waveform shape indicators
    crest_factor = float(peak_val / (rms_val + 1e-12))
    shape_factor = float(rms_val / (np.mean(np.abs(sig_clean)) + 1e-12))
    impulse_factor = float(peak_val / (np.mean(np.abs(sig_clean)) + 1e-12))
    clearance_factor = float(peak_val / (np.mean(np.sqrt(np.abs(sig_clean))) ** 2 + 1e-12))

    # Signal Energy & Power
    energy = float(np.sum(sig_clean ** 2))

    # Signal to Noise Ratio estimation (first 10% of signal assumed pre-arrival noise)
    noise_window = int(max(N * 0.1, 10))
    noise_var = float(np.var(sig_clean[:noise_window]))
    signal_var = float(np.var(sig_clean[noise_window:]))
    if noise_var > 1e-12:
        snr_db = float(10.0 * np.log10(max(signal_var / noise_var, 1.0)))
    else:
        snr_db = 42.0

    # Frequency Domain Features
    fft_vals = np.abs(np.fft.rfft(sig_clean - mean_val))
    freqs = np.fft.rfftfreq(N, d=1.0 / fs)

    sum_fft = np.sum(fft_vals) + 1e-12
    spectral_centroid_hz = float(np.sum(freqs * fft_vals) / sum_fft)
    dom_idx = int(np.argmax(fft_vals))
    dom_freq_hz = float(freqs[dom_idx]) if dom_idx < len(freqs) else 0.0

    spectral_spread = float(np.sqrt(np.sum(((freqs - spectral_centroid_hz) ** 2) * fft_vals) / sum_fft))

    # Hilbert Envelope Peak Timing (Time-of-Flight proxy)
    analytic = signal.hilbert(sig_clean)
    envelope = np.abs(analytic)
    peak_envelope_idx = int(np.argmax(envelope))
    time_of_flight_us = float((peak_envelope_idx / fs) * 1e6)

    return {
        "mean": mean_val,
        "std": std_val,
        "rms": rms_val,
        "peak": peak_val,
        "peak_to_peak": peak_to_peak,
        "variance": variance,
        "skewness": skewness,
        "kurtosis": kurtosis_val,
        "crest_factor": crest_factor,
        "shape_factor": shape_factor,
        "impulse_factor": impulse_factor,
        "clearance_factor": clearance_factor,
        "signal_energy": energy,
        "snr_db": snr_db,
        "dominant_frequency_khz": dom_freq_hz / 1000.0,
        "spectral_centroid_khz": spectral_centroid_hz / 1000.0,
        "spectral_spread_khz": spectral_spread / 1000.0,
        "time_of_flight_us": time_of_flight_us
    }

