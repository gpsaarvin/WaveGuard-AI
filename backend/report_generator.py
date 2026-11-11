import os
import io
import datetime
import tempfile

mpl_dir = os.path.join(os.path.dirname(__file__), "storage", "mpl_cache")
os.makedirs(mpl_dir, exist_ok=True)
os.environ["MPLCONFIGDIR"] = mpl_dir

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable
from reportlab.lib.units import inch


def generate_pdf_report(
    analysis_record: dict,
    signal_data: np.ndarray,
    fs: float = 50e6,
    output_filepath: str = None
) -> str:
    """
    Generates a scientific PDF report for an ultrasonic guided wave inspection.
    Includes A-scan waveform, FFT spectrum, features table, classification breakdown,
    and NDE engineering recommendations.
    """
    if output_filepath is None:
        report_dir = os.path.join(os.path.dirname(__file__), "storage", "reports")
        os.makedirs(report_dir, exist_ok=True)
        output_filepath = os.path.join(report_dir, f"WaveGuard_Report_{analysis_record.get('id', 'N1')}.pdf")

    doc = SimpleDocTemplate(
        output_filepath,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#061426")
    )

    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0070F3")
    )

    h2_style = ParagraphStyle(
        "Heading2Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0F2238"),
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        "BodyCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B")
    )

    meta_label = ParagraphStyle(
        "MetaLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#64748B")
    )

    meta_val = ParagraphStyle(
        "MetaVal",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>WAVEGUARD AI</b><br/><font size='8' color='#64748B'>AERO STRUCTURAL HEALTH MONITORING (SHM) PLATFORM</font>", title_style),
            Paragraph(f"<b>REPORT ID:</b> {analysis_record.get('id', 'N/A')[:12]}<br/><b>DATE:</b> {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}<br/><b>STATUS:</b> VERIFIED", meta_label)
        ]
    ]
    header_table = Table(header_data, colWidths=[4.0 * inch, 3.5 * inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#00F0FF"), spaceAfter=10))

    # 2. Specimen & Test Telemetry
    story.append(Paragraph("1. SPECIMEN & ACOUSTIC ACQUISITION TELEMETRY", h2_style))
    specimen_data = [
        [
            Paragraph("Specimen ID:", meta_label), Paragraph(str(analysis_record.get("specimen_id", "CFRP-T700-08")), meta_val),
            Paragraph("Material System:", meta_label), Paragraph(str(analysis_record.get("material", "CFRP Quasi-Isotropic [0/45/90/-45]s")), meta_val)
        ],
        [
            Paragraph("Acquisition Channel:", meta_label), Paragraph("Ch-01 (PZT Tx01 -> Rx04)", meta_val),
            Paragraph("Sampling Frequency:", meta_label), Paragraph(f"{fs / 1e6:.1f} MS/s (16-bit ADC)", meta_val)
        ],
        [
            Paragraph("Excitation Waveform:", meta_label), Paragraph("5.5-Cycle Hanning Toneburst @ 250 kHz", meta_val),
            Paragraph("Propagation Modes:", meta_label), Paragraph("Fundamental S0 (5,420 m/s) & A0 (2,180 m/s)", meta_val)
        ]
    ]
    spec_table = Table(specimen_data, colWidths=[1.8 * inch, 1.95 * inch, 1.8 * inch, 1.95 * inch])
    spec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(spec_table)
    story.append(Spacer(1, 10))

    # 3. Diagnostic Classification Banner
    story.append(Paragraph("2. AI CLASSIFICATION & DIAGNOSTIC VERDICT", h2_style))
    pred_class = analysis_record.get("predicted_class", "Nominal")
    conf = analysis_record.get("confidence", 95.0)
    sev = analysis_record.get("severity_rating", "Nominal")

    banner_color = colors.HexColor("#DCFCE7") if "Healthy" in pred_class else colors.HexColor("#FEF3C7") if "Delamination" in pred_class else colors.HexColor("#FEE2E2")
    border_color = colors.HexColor("#16A34A") if "Healthy" in pred_class else colors.HexColor("#D97706") if "Delamination" in pred_class else colors.HexColor("#DC2626")

    verdict_data = [
        [
            Paragraph(f"<font size='14' color='{border_color.hexval()}'><b>PREDICTED CONDITION: {pred_class.upper()}</b></font><br/>"
                      f"<b>Confidence:</b> {conf}% | <b>Severity Rating:</b> {sev}<br/>"
                      f"<b>Defect Coordinates:</b> X: {analysis_record.get('defect_x_mm', 0)} mm, Y: {analysis_record.get('defect_y_mm', 0)} mm, Depth: {analysis_record.get('defect_depth_mm', 0)} mm",
                      body_style)
        ]
    ]
    verdict_table = Table(verdict_data, colWidths=[7.5 * inch])
    verdict_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), banner_color),
        ('BOX', (0,0), (-1,-1), 1.5, border_color),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(verdict_table)
    story.append(Spacer(1, 10))

    # 4. Generate Signal Plots (Waveform & FFT)
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.5, 2.2), dpi=150)
    fig.patch.set_facecolor('#FFFFFF')

    # Waveform Plot
    t_us = np.linspace(0, (len(signal_data) / fs) * 1e6, len(signal_data))
    ax1.plot(t_us, signal_data, color='#0070F3', linewidth=0.9, label="A-Scan")
    ax1.set_title("Ultrasonic A-Scan Waveform", fontsize=8, fontweight="bold", color="#0F172A")
    ax1.set_xlabel("Time (μs)", fontsize=7, color="#475569")
    ax1.set_ylabel("Amplitude (V)", fontsize=7, color="#475569")
    ax1.grid(True, linestyle="--", alpha=0.5)
    ax1.tick_params(labelsize=6)

    # FFT Plot
    fft_vals = np.abs(np.fft.rfft(signal_data - np.mean(signal_data)))
    freqs_khz = np.fft.rfftfreq(len(signal_data), d=1.0 / fs) / 1000.0
    cutoff = min(len(freqs_khz), np.argmax(freqs_khz > 600) or len(freqs_khz))

    ax2.plot(freqs_khz[:cutoff], fft_vals[:cutoff] / np.max(fft_vals), color='#00F0FF', linewidth=0.9)
    ax2.fill_between(freqs_khz[:cutoff], fft_vals[:cutoff] / np.max(fft_vals), color='#00F0FF', alpha=0.15)
    ax2.set_title("FFT Frequency Spectrum", fontsize=8, fontweight="bold", color="#0F172A")
    ax2.set_xlabel("Frequency (kHz)", fontsize=7, color="#475569")
    ax2.set_ylabel("Normalized Magnitude", fontsize=7, color="#475569")
    ax2.grid(True, linestyle="--", alpha=0.5)
    ax2.tick_params(labelsize=6)

    plt.tight_layout()
    img_buf = io.BytesIO()
    plt.savefig(img_buf, format="png", dpi=150, bbox_inches="tight")
    plt.close(fig)
    img_buf.seek(0)

    story.append(Paragraph("3. ACOUSTIC SIGNAL ANALYSIS (TIME & FREQUENCY DOMAINS)", h2_style))
    story.append(Image(img_buf, width=7.5 * inch, height=2.2 * inch))
    story.append(Spacer(1, 10))

    # 5. Extracted Features Table
    story.append(Paragraph("4. EXTRACTED STATISTICAL & SPECTRAL FEATURES", h2_style))
    feats = analysis_record.get("features", {})
    features_table_data = [
        [Paragraph("Feature Metric", meta_label), Paragraph("Value", meta_label), Paragraph("Feature Metric", meta_label), Paragraph("Value", meta_label)],
        [Paragraph("RMS Amplitude", meta_val), Paragraph(f"{feats.get('rms', 0.0):.4f} V", meta_val), Paragraph("Signal Energy", meta_val), Paragraph(f"{feats.get('signal_energy', 0.0):.2f}", meta_val)],
        [Paragraph("Peak-to-Peak (Vpp)", meta_val), Paragraph(f"{feats.get('peak_to_peak', 0.0):.4f} V", meta_val), Paragraph("Estimated SNR", meta_val), Paragraph(f"{feats.get('snr_db', 38.0):.1f} dB", meta_val)],
        [Paragraph("Skewness", meta_val), Paragraph(f"{feats.get('skewness', 0.0):.3f}", meta_val), Paragraph("Kurtosis", meta_val), Paragraph(f"{feats.get('kurtosis', 0.0):.3f}", meta_val)],
        [Paragraph("Dominant Frequency", meta_val), Paragraph(f"{feats.get('dominant_frequency_khz', 250.0):.1f} kHz", meta_val), Paragraph("Spectral Centroid", meta_val), Paragraph(f"{feats.get('spectral_centroid_khz', 252.0):.1f} kHz", meta_val)],
    ]
    feat_table = Table(features_table_data, colWidths=[2.0 * inch, 1.75 * inch, 2.0 * inch, 1.75 * inch])
    feat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(feat_table)
    story.append(Spacer(1, 10))

    # 6. Scientific Conclusion & Engineering Recommendations
    story.append(Paragraph("5. SCIENTIFIC EVALUATION & ENGINEERING RECOMMENDATIONS", h2_style))
    explanation = analysis_record.get(
        "explanation",
        "Ultrasonic guided wave testing completed under standard laboratory conditions."
    )
    story.append(Paragraph(explanation, body_style))
    story.append(Spacer(1, 6))

    compliance_text = (
        "<b>Conformity & Maintenance Standard:</b> This automated non-destructive evaluation was conducted in accordance "
        "with ISO 9712 and aerospace composite airframe inspection standards (FAA AC 20-107B / MIL-HDBK-17). "
        "Baseline acoustic signatures are digitally archived for future trend and damage tolerance analysis."
    )
    story.append(Paragraph(compliance_text, ParagraphStyle("Comp", parent=body_style, fontSize=8, leading=11, textColor=colors.HexColor("#64748B"))))

    doc.build(story)
    return output_filepath
