import datetime
import json
import uuid
import os
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = os.path.join(os.path.dirname(__file__), "waveguard.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    original_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    row_count = Column(Integer, default=0)
    col_count = Column(Integer, default=0)
    columns_json = Column(Text, default="[]")
    missing_values_count = Column(Integer, default=0)
    sampling_rate_mhz = Column(Float, default=50.0)
    actuator_freq_khz = Column(Float, default=250.0)
    material = Column(String, default="CFRP Quasi-Isotropic [0/45/90/-45]s")
    specimen_id = Column(String, default="CFRP-T700-08")
    sample_type = Column(String, default="Experimental")  # "Experimental", "Benchmark", "Synthetic"
    status = Column(String, default="Validated")
    upload_timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "original_name": self.original_name,
            "file_path": self.file_path,
            "row_count": self.row_count,
            "col_count": self.col_count,
            "columns": json.loads(self.columns_json or "[]"),
            "missing_values_count": self.missing_values_count,
            "sampling_rate_mhz": self.sampling_rate_mhz,
            "actuator_freq_khz": self.actuator_freq_khz,
            "material": self.material,
            "specimen_id": self.specimen_id,
            "sample_type": self.sample_type,
            "status": self.status,
            "upload_timestamp": self.upload_timestamp.isoformat() if self.upload_timestamp else None
        }


class SignalRecord(Base):
    __tablename__ = "signal_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = Column(String, nullable=False)
    channel_name = Column(String, default="Ch-01")
    filter_applied = Column(String, default="None")
    lowcut_khz = Column(Float, default=0.0)
    highcut_khz = Column(Float, default=0.0)
    order = Column(Integer, default=4)
    normalized = Column(Boolean, default=False)
    smoothed = Column(Boolean, default=False)
    dominant_freq_khz = Column(Float, default=0.0)
    peak_amplitude = Column(Float, default=0.0)
    rms = Column(Float, default=0.0)
    snr_db = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "dataset_id": self.dataset_id,
            "channel_name": self.channel_name,
            "filter_applied": self.filter_applied,
            "lowcut_khz": self.lowcut_khz,
            "highcut_khz": self.highcut_khz,
            "order": self.order,
            "normalized": self.normalized,
            "smoothed": self.smoothed,
            "dominant_freq_khz": self.dominant_freq_khz,
            "peak_amplitude": self.peak_amplitude,
            "rms": self.rms,
            "snr_db": self.snr_db,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class ExtractedFeatures(Base):
    __tablename__ = "extracted_features"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = Column(String, nullable=False)
    channel_name = Column(String, default="Ch-01")
    mean = Column(Float, default=0.0)
    std = Column(Float, default=0.0)
    rms = Column(Float, default=0.0)
    peak = Column(Float, default=0.0)
    peak_to_peak = Column(Float, default=0.0)
    skewness = Column(Float, default=0.0)
    kurtosis = Column(Float, default=0.0)
    signal_energy = Column(Float, default=0.0)
    snr_db = Column(Float, default=0.0)
    dominant_frequency_khz = Column(Float, default=0.0)
    spectral_centroid_khz = Column(Float, default=0.0)
    features_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "dataset_id": self.dataset_id,
            "channel_name": self.channel_name,
            "mean": round(self.mean, 6),
            "std": round(self.std, 6),
            "rms": round(self.rms, 6),
            "peak": round(self.peak, 6),
            "peak_to_peak": round(self.peak_to_peak, 6),
            "skewness": round(self.skewness, 4),
            "kurtosis": round(self.kurtosis, 4),
            "signal_energy": round(self.signal_energy, 4),
            "snr_db": round(self.snr_db, 2),
            "dominant_frequency_khz": round(self.dominant_frequency_khz, 2),
            "spectral_centroid_khz": round(self.spectral_centroid_khz, 2),
            "all_features": json.loads(self.features_json or "{}"),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class TrainedModel(Base):
    __tablename__ = "trained_models"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    algorithm = Column(String, nullable=False)
    accuracy = Column(Float, default=0.0)
    precision_score = Column(Float, default=0.0)
    recall_score = Column(Float, default=0.0)
    f1_score = Column(Float, default=0.0)
    cv_folds = Column(Integer, default=10)
    n_samples = Column(Integer, default=0)
    model_path = Column(String, nullable=True)
    confusion_matrix_json = Column(Text, default="[]")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "algorithm": self.algorithm,
            "accuracy": round(self.accuracy * 100, 2),
            "precision": round(self.precision_score * 100, 2),
            "recall": round(self.recall_score * 100, 2),
            "f1_score": round(self.f1_score * 100, 2),
            "cv_folds": self.cv_folds,
            "n_samples": self.n_samples,
            "confusion_matrix": json.loads(self.confusion_matrix_json or "[]"),
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = Column(String, nullable=True)
    dataset_name = Column(String, nullable=False)
    specimen_id = Column(String, default="CFRP-T700-08")
    material = Column(String, default="CFRP [0/45/90/-45]s")
    predicted_class = Column(String, nullable=False)
    confidence = Column(Float, default=0.0)
    probabilities_json = Column(Text, default="{}")
    model_used = Column(String, default="XGBoost-LambWave-Classifier")
    defect_x_mm = Column(Float, default=0.0)
    defect_y_mm = Column(Float, default=0.0)
    defect_depth_mm = Column(Float, default=0.0)
    severity_rating = Column(String, default="Nominal")
    explanation = Column(Text, default="")
    report_path = Column(String, nullable=True)
    status = Column(String, default="Completed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "dataset_id": self.dataset_id,
            "dataset_name": self.dataset_name,
            "specimen_id": self.specimen_id,
            "material": self.material,
            "predicted_class": self.predicted_class,
            "confidence": round(self.confidence * 100, 1),
            "probabilities": json.loads(self.probabilities_json or "{}"),
            "model_used": self.model_used,
            "defect_x_mm": self.defect_x_mm,
            "defect_y_mm": self.defect_y_mm,
            "defect_depth_mm": self.defect_depth_mm,
            "severity_rating": self.severity_rating,
            "explanation": self.explanation,
            "report_path": self.report_path,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
