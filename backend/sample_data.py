import os
import numpy as np
import pandas as pd


def generate_hanning_toneburst(fc: float, cycles: float = 5.5, fs: float = 50e6) -> np.ndarray:
    """Generates standard Hanning-windowed toneburst excitation."""
    T = cycles / fc
    num_pts = int(T * fs)
    t = np.linspace(0, T, num_pts, endpoint=False)
    hann = 0.5 * (1 - np.cos(2 * np.pi * t / T))
    burst = hann * np.sin(2 * np.pi * fc * t)
    return burst


def simulate_ultrasonic_a_scan(
    defect_type: str = "Healthy Plate",
    fs: float = 50e6,            # 50 MS/s
    fc: float = 250e3,           # 250 kHz
    duration_us: float = 140.0,  # 140 μs
    snr_noise: float = 0.018
) -> np.ndarray:
    """
    Simulates high-precision Lamb wave A-scan in CFRP plate with S0 and A0 modes.
    """
    N = int(duration_us * 1e-6 * fs)
    t = np.linspace(0, duration_us * 1e-6, N, endpoint=False)
    signal = np.zeros(N)

    # Excitation toneburst
    burst = generate_hanning_toneburst(fc=fc, cycles=5.5, fs=fs)
    L_b = len(burst)

    # Physical propagation times in 500x500mm plate:
    # Path length TX-01 to RX-04 = ~220 mm
    # S0 velocity ~ 5,400 m/s -> ToF ~ 40.7 μs
    # A0 velocity ~ 2,180 m/s -> ToF ~ 100.9 μs

    s0_idx = int(40.7e-6 * fs)
    a0_idx = int(100.9e-6 * fs)

    # 1. Fundamental S0 Mode Packet (lower amplitude, fast)
    s0_amp = 0.45
    if s0_idx + L_b < N:
        signal[s0_idx:s0_idx + L_b] += s0_amp * burst

    # 2. Fundamental A0 Mode Packet (larger amplitude, dispersive)
    a0_amp = 1.0
    if defect_type == "Delamination":
        a0_amp = 0.62  # Significant attenuation due to interface debond
    elif defect_type == "Crack":
        a0_amp = 0.48  # High attenuation from scattering
    elif defect_type == "Impact Damage":
        a0_amp = 0.35  # Severe attenuation & phase cancellation

    # Dispersive stretching for A0
    t_a0 = np.linspace(0, 1.3 * (5.5 / fc), int(1.3 * L_b), endpoint=False)
    a0_burst = a0_amp * 0.5 * (1 - np.cos(2 * np.pi * t_a0 / t_a0[-1])) * np.sin(2 * np.pi * fc * 0.95 * t_a0)
    L_a0 = len(a0_burst)
    if a0_idx + L_a0 < N:
        signal[a0_idx:a0_idx + L_a0] += a0_burst

    # 3. Defect-Specific Reflected Echoes
    if defect_type == "Delamination":
        # Sub-surface delamination reflection echo at ~68 μs
        delam_idx = int(68.5e-6 * fs)
        delam_burst = 0.38 * burst
        if delam_idx + L_b < N:
            signal[delam_idx:delam_idx + L_b] += delam_burst

    elif defect_type == "Crack":
        # High-frequency scattering echo at ~58 μs and secondary micro-scattering
        crack_idx = int(58.2e-6 * fs)
        crack_burst = -0.32 * generate_hanning_toneburst(fc=fc * 1.25, cycles=4.0, fs=fs)
        L_c = len(crack_burst)
        if crack_idx + L_c < N:
            signal[crack_idx:crack_idx + L_c] += crack_burst

    elif defect_type == "Impact Damage":
        # Multiple scrambled reflections from internal matrix cracking & fiber breakage
        echo1_idx = int(52.0e-6 * fs)
        echo2_idx = int(74.0e-6 * fs)
        b1 = 0.42 * burst
        b2 = -0.28 * burst
        if echo1_idx + L_b < N:
            signal[echo1_idx:echo1_idx + L_b] += b1
        if echo2_idx + L_b < N:
            signal[echo2_idx:echo2_idx + L_b] += b2

    # Add realistic environmental & pre-amp Gaussian noise
    noise = np.random.normal(0, snr_noise, N)
    signal += noise

    return signal


def create_sample_csv_files(output_dir: str):
    """
    Creates realistic sample CSV datasets for the 4 classes.
    """
    os.makedirs(output_dir, exist_ok=True)
    fs = 50e6  # 50 MS/s
    duration_us = 140.0
    N = int(duration_us * 1e-6 * fs)
    time_us = np.linspace(0, duration_us, N)

    samples = [
        ("CFRP_T700_Healthy_Baseline.csv", "Healthy Plate", "CFRP-T700-08", "CFRP Quasi-Isotropic [0/45/90/-45]s"),
        ("CFRP_T700_Delamination_Defect.csv", "Delamination", "CFRP-M40J-14", "CFRP High-Modulus Carbon"),
        ("CFRP_T700_MicroCrack_Fatigue.csv", "Crack", "GLARE-3-5/4", "Glass-Laminate Carbon Hybrid"),
        ("CFRP_T700_ImpactDamage_BVID.csv", "Impact Damage", "CFRP-IM7-03", "Intermediate Modulus CFRP"),
    ]

    created_info = []

    for fname, defect_class, specimen_id, material in samples:
        fpath = os.path.join(output_dir, fname)
        if not os.path.exists(fpath):
            # Generate 4 sensor channels (PZT-01 to PZT-04)
            ch1 = simulate_ultrasonic_a_scan(defect_type=defect_class, fs=fs)
            ch2 = simulate_ultrasonic_a_scan(defect_type=defect_class, fs=fs, snr_noise=0.02) * 0.92
            ch3 = simulate_ultrasonic_a_scan(defect_type=defect_class, fs=fs, snr_noise=0.015) * 1.05
            ch4 = simulate_ultrasonic_a_scan(defect_type=defect_class, fs=fs, snr_noise=0.022) * 0.88

            df = pd.DataFrame({
                "time_us": np.round(time_us, 3),
                "amplitude_v": np.round(ch1, 6),
                "channel_rx02_v": np.round(ch2, 6),
                "channel_rx03_v": np.round(ch3, 6),
                "channel_rx04_v": np.round(ch4, 6),
                "condition": defect_class
            })

            df.to_csv(fpath, index=False)

        created_info.append({
            "filename": fname,
            "filepath": fpath,
            "condition": defect_class,
            "specimen_id": specimen_id,
            "material": material
        })

    return created_info
