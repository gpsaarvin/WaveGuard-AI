# WaveGuard AI — Ultrasonic Guided Wave Classification Platform

## Overview
**WaveGuard AI** is a full-stack, software-only intelligent research platform engineered for Non-Destructive Evaluation (NDE) and Structural Health Monitoring (SHM) of carbon fibre composite plates using ultrasonic guided waves (Lamb waves) and machine learning.

The platform provides an end-to-end workflow:
1. Multi-channel ultrasonic guided wave dataset ingestion (CSV, XLSX, XLS).
2. Zero-phase digital signal filtering (Butterworth bandpass, lowpass, highpass, and smoothing).
3. Time-domain, frequency-domain (FFT), and time-frequency (STFT Spectrogram) analysis.
4. Statistical and dispersion feature extraction (18 multi-domain features).
5. Multi-class AI classification (Healthy Plate, Sub-Surface Delamination, Micro-Crack, High-Velocity Impact Damage).
6. 2D and through-thickness defect localization.
7. Rigorous model evaluation (Holdout Stratified Cross-Validation, Confusion Matrices, ROC-AUC).
8. Automated publication-ready scientific PDF report generation conforming to ISO 9712 and FAA AC 20-107B standards.
9. Interactive 3D carbon fibre composite plate visualizer with simulated piezoelectric (PZT) transducer arrays.

---

## Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS adhering to the Deep Aero-Acoustic Intelligence design system
- **Icons**: Material Symbols Outlined & Lucide React
- **3D Visualization**: Three.js & HTML5 Canvas carbon fibre plate simulation
- **Scientific Visualizers**: Interactive vector waveform oscilloscopes, FFT spectrum charts, and STFT spectrogram heatmaps

### Backend
- **Framework**: Python 3.13 with FastAPI (REST API architecture)
- **Data Validation**: Pydantic v2
- **Database**: SQLite with SQLAlchemy ORM (self-contained, zero-configuration)
- **Digital Signal Processing**: SciPy, NumPy (Butterworth `filtfilt` forward-backward zero-phase filtering, `scipy.signal.spectrogram`, `scipy.signal.hilbert`)
- **Machine Learning**: Scikit-learn, XGBoost (`XGBClassifier`, `RandomForestClassifier`, `SVC`, `KNeighborsClassifier`)
- **Report Generation**: ReportLab & Matplotlib

---

## Ultrasonic Guided Wave Physics & Defect Signatures

In thin carbon fibre reinforced polymer (CFRP) composite laminates:
- **Fundamental Symmetric Mode ($S_0$)**: Arrives first due to high group velocity ($\approx 5,420\text{ m/s}$ in CFRP $[0/45/90/-45]_s$). Possesses dominant in-plane displacement and low dispersion in the sub-MHz band.
- **Fundamental Antisymmetric Mode ($A_0$)**: Arrives second with lower group velocity ($\approx 2,180\text{ m/s}$). Dominated by out-of-plane flexural displacement and pronounced frequency dispersion.
- **Sub-Surface Delamination**: Creates acoustic impedance mismatch between delaminated plies, generating secondary echo reflections and significant attenuation ($\approx 38\%$) in transmitted $A_0$ energy.
- **Matrix Micro-Crack (Fatigue)**: Induces high-frequency scattering, mode conversion, and energy dissipation above $280\text{ kHz}$.
- **Barely Visible Impact Damage (BVID)**: Generates diffuse multi-path scattering and structural wave packet scrambling.

---

## Project Structure

```
Akshlin/
├── backend/
│   ├── main.py                 # FastAPI REST API endpoints & application shell
│   ├── database.py             # SQLAlchemy models (Datasets, Analyses, Features, Models)
│   ├── signal_processing.py    # Zero-phase Butterworth filtering, FFT, STFT, Hilbert ToF
│   ├── ml_pipeline.py          # Machine learning training, cross-validation & prediction
│   ├── sample_data.py          # Lamb wave physics simulator & benchmark CSV generator
│   ├── report_generator.py     # Scientific PDF report generator with embedded figures
│   ├── run_backend.py          # Standalone backend launcher
│   ├── requirements.txt        # Python dependencies
│   ├── waveguard.db            # SQLite database
│   └── storage/
│       ├── datasets/           # Uploaded and benchmark CSV/Excel datasets
│       ├── models/             # Trained ML models and evaluation summaries
│       └── reports/            # Compiled scientific PDF inspection certificates
├── frontend/
│   ├── index.html              # HTML entry point with Google Fonts (Inter, JetBrains Mono)
│   ├── vite.config.ts          # Vite build configuration & API proxy
│   ├── tailwind.config.js      # Deep Aero-Acoustic color palette and layout tokens
│   ├── package.json            # Node dependencies
│   └── src/
│       ├── App.tsx             # Root router and application shell
│       ├── main.tsx            # React DOM bootstrap
│       ├── index.css           # Tailwind base styles and glassmorphic utilities
│       ├── types/              # TypeScript interfaces (Dataset, Analysis, Features)
│       ├── services/api.ts     # Frontend REST API client
│       ├── components/
│       │   ├── Sidebar.tsx     # Navigation sidebar with real-time status indicators
│       │   ├── Header.tsx      # Active specimen profile, telemetry strip & UTC clock
│       │   ├── Plate3DCanvas.tsx # Interactive 3D composite plate & wave propagation
│       │   ├── SignalChart.tsx # Interactive A-scan waveform oscilloscope
│       │   ├── FFTChart.tsx    # Fast Fourier Transform frequency spectrum chart
│       │   └── SpectrogramChart.tsx # STFT time-frequency spectrogram heatmap
│       └── pages/
│           ├── LandingPage.tsx        # Module 1: Project overview & hero showcase
│           ├── Dashboard.tsx          # Module 2: Key metrics, distribution & activity
│           ├── PlateVisualization.tsx # Module 3: 3D plate workspace & sensor matrix
│           ├── DatasetManagement.tsx  # Module 4: Drag & drop upload, preview & validation
│           ├── SignalAnalysis.tsx     # Module 5: DSP filter pipeline, FFT & features
│           ├── AIClassification.tsx   # Module 6: Model inference, softmax & localization
│           ├── ModelEvaluation.tsx    # Module 7: 10-fold CV metrics & confusion matrix
│           ├── AnalysisHistory.tsx    # Module 8: Searchable inspection archives
│           ├── Reports.tsx            # Module 9: Scientific PDF report generation
│           └── Settings.tsx           # Module 10: Preferences, calibration & info
├── stitch_design/              # Google Stitch UI/UX design specifications
├── run_app.py                  # One-click dual server launcher (backend + frontend)
├── start.bat                   # Windows batch script launcher
├── .env.example                # Environment variable configuration template
└── README.md                   # Complete technical documentation
```

---

## Installation & Setup

### Prerequisites
- **Python**: Version 3.10+ (tested on Python 3.13)
- **Node.js**: Version 18+ (tested on Node.js v24)
- **npm**: Version 9+

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## Running the Application

### Option A: One-Click Launcher (Recommended)
From the root directory, simply execute:
```bash
python run_app.py
```
Or on Windows, double-click `start.bat`.

This starts:
- **Backend API**: `http://127.0.0.1:8000`
- **Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **Frontend Web Application**: `http://localhost:3000`

### Option B: Running Services Separately

**Start the Python Backend:**
```bash
cd backend
python run_backend.py
```

**Start the React Frontend:**
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## Implemented Website Modules

| Module | Name | Features |
|---|---|---|
| **Module 1** | **Landing Page** | WaveGuard AI branding, Hero section, animated wave illustration, 3D plate preview, feature showcase, Start Analysis CTA. |
| **Module 2** | **Dashboard** | Total datasets, real analysis count, healthy baseline ratio, defect breakdown, live propagation oscilloscope, recent scans feed. |
| **Module 3** | **Plate Visualization** | Interactive 3D carbon fibre composite plate with twill weave texture, 3D rotation, zoom, camera reset, PZT array, dynamic wave rings, defect state injection (Healthy, Delamination, Micro-Crack, BVID). |
| **Module 4** | **Dataset Management** | Drag-and-drop file upload (CSV, XLSX, XLS), format validation, missing value detection, channel mapping, dataset deletion. |
| **Module 5** | **Signal Processing** | Raw A-scan visualization, zero-phase Butterworth filtering (bandpass, lowpass, highpass), noise smoothing, range normalization, FFT spectrum, STFT spectrogram, Hilbert envelope, 18-feature extraction. |
| **Module 6** | **AI Classification** | Real ML classification with XGBoost, Random Forest, SVM (RBF), and KNN; multi-class softmax probability distribution; 2D defect center localization ($X, Y, Z$ depth); physics-based explanation. |
| **Module 7** | **Model Evaluation** | Holdout stratified cross-validation metrics (Accuracy, Precision, Recall, Macro F1), multi-class confusion matrix, comparative model benchmark table. |
| **Module 8** | **Analysis History** | Chronological record archive, search and filter by condition, detailed results modal, one-click PDF report export, record deletion. |
| **Module 9** | **Reports** | Downloadable publication-grade scientific PDF reports generated with ReportLab and embedded matplotlib waveform and FFT figures. |
| **Module 10** | **Settings** | Acquisition parameter configuration, default ML architecture selection, operator identity profile, academic research specs. |

---

## FastAPI REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/datasets/upload` | Upload and validate CSV, XLSX, XLS ultrasonic dataset. |
| `GET` | `/api/datasets` | List all ingested datasets with metadata. |
| `GET` | `/api/datasets/{id}/data` | Retrieve time series signal arrays and channel headers. |
| `DELETE` | `/api/datasets/{id}` | Remove dataset and delete storage file. |
| `POST` | `/api/signal/filter` | Apply zero-phase Butterworth filter (filtfilt). |
| `POST` | `/api/signal/preprocess` | Min-Max normalization and Savitzky-Golay smoothing. |
| `POST` | `/api/signal/fft` | Compute Fast Fourier Transform frequency spectrum. |
| `POST` | `/api/signal/spectrogram` | Compute Short-Time Fourier Transform spectrogram in dB. |
| `POST` | `/api/features/extract` | Extract 18 multi-domain statistical and spectral features. |
| `POST` | `/api/classification/predict` | Run trained ML model on ultrasonic guided wave signal. |
| `GET` | `/api/model/list` | List available candidate classification architectures. |
| `GET` | `/api/model/evaluation` | Get cross-validation metrics and confusion matrices. |
| `POST` | `/api/model/train` | Retrain models with 10-fold cross-validation. |
| `GET` | `/api/dashboard/stats` | Retrieve real aggregated SHM platform metrics. |
| `GET` | `/api/analysis/history` | List previous inspection runs with filtering. |
| `DELETE` | `/api/analysis/{id}` | Delete analysis record. |
| `POST` | `/api/reports/generate` | Compile and save scientific PDF report. |
| `GET` | `/api/reports/{id}/download` | Download compiled PDF certificate. |

Interactive API documentation and schema explorer are accessible at `http://127.0.0.1:8000/docs`.

---

## Compliance & Standards
- **ISO 9712**: Non-Destructive Testing (NDT) Qualification and Certification.
- **FAA AC 20-107B**: Composite Aircraft Structure Damage Tolerance and Fatigue Evaluation.
- **MIL-HDBK-17**: Composite Materials Handbook for Structural Characterization.

