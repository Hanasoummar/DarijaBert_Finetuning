"""
DarijaBERT Classifier API
FastAPI backend for Moroccan Arabic text classification
"""
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import PeftModel
import torch
import numpy as np
import pandas as pd
from io import StringIO, BytesIO
from typing import List, Dict, Optional
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ──────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────
MODEL_ID = os.getenv("MODEL_ID", "HanaSoummar/DarijaBERT-finetuned_model_with_LORA")
HF_TOKEN = os.getenv("HF_TOKEN", None)

# Your 10 classes (from your fine-tuning notebook)
CLASS_NAMES = [
    "Actualités",
    "Cuisine", 
    "Culture",
    "Divertissement",
    "Santé",
    "Sport",
    "Technologie",
    "Voyage",
    "Économie",
    "Éducation"
]

# ──────────────────────────────────────────────
# FASTAPI APP
# ──────────────────────────────────────────────
app = FastAPI(
    title="DarijaBERT Classifier API",
    description="Production-grade Arabic dialect text classification using BERT + LoRA",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# MODEL LOADING
# ──────────────────────────────────────────────
class ModelManager:
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.id2label = {}
        self.label2id = {}
        self.num_labels = 0
        self.loaded = False
        self.load_time = 0

    def load(self):
        start = time.time()
        print(f"🔧 Loading model: {MODEL_ID}")

        try:
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                MODEL_ID, 
                token=HF_TOKEN
            )

            # Load base model
            base_model = AutoModelForSequenceClassification.from_pretrained(
                MODEL_ID,
                token=HF_TOKEN,
                num_labels=len(CLASS_NAMES)
            )

            # Try to load as PEFT/LoRA model
            try:
                self.model = PeftModel.from_pretrained(base_model, MODEL_ID)
                print("✅ Loaded as PEFT/LoRA model")
            except:
                self.model = base_model
                print("✅ Loaded as standard model")

            self.model.eval()

            # Extract labels from config or use defaults
            config = self.model.config
            self.num_labels = config.num_labels

            if hasattr(config, 'id2label') and config.id2label:
                self.id2label = {int(k): v for k, v in config.id2label.items()}
            else:
                self.id2label = {i: name for i, name in enumerate(CLASS_NAMES)}

            if hasattr(config, 'label2id') and config.label2id:
                self.label2id = config.label2id
            else:
                self.label2id = {name: i for i, name in enumerate(CLASS_NAMES)}

            self.loaded = True
            self.load_time = time.time() - start
            print(f"✅ Model loaded in {self.load_time:.2f}s")
            print(f"📊 Classes: {list(self.id2label.values())}")

        except Exception as e:
            print(f"❌ Failed to load model: {e}")
            raise

    def predict(self, text: str, max_length: int = 128):
        if not self.loaded:
            raise HTTPException(503, "Model not loaded")

        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            padding="max_length",
            truncation=True,
            max_length=max_length,
        )

        with torch.no_grad():
            outputs = self.model(**inputs)

        logits = outputs.logits.squeeze()
        probs = torch.softmax(logits, dim=-1).numpy()
        pred_idx = int(np.argmax(probs))

        # Build results
        class_probs = []
        for i in range(self.num_labels):
            class_probs.append({
                "class": self.id2label.get(i, f"Class {i}"),
                "probability": round(float(probs[i]) * 100, 2),
                "logit": round(float(logits[i]), 4)
            })

        # Sort by probability descending
        class_probs.sort(key=lambda x: x["probability"], reverse=True)

        return {
            "prediction": self.id2label.get(pred_idx, f"Class {pred_idx}"),
            "confidence": round(float(probs[pred_idx]) * 100, 2),
            "predicted_index": pred_idx,
            "all_probabilities": class_probs,
            "input_text": text,
            "model_id": MODEL_ID,
            "inference_time_ms": 0  # Will be set by endpoint
        }

# Global model instance
model_manager = ModelManager()

# ──────────────────────────────────────────────
# PYDANTIC MODELS
# ──────────────────────────────────────────────
class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Darija text to classify")
    max_length: int = Field(128, ge=32, le=512, description="Max token length")

class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    predicted_index: int
    all_probabilities: List[Dict]
    input_text: str
    model_id: str
    inference_time_ms: float

class BatchPredictRequest(BaseModel):
    texts: List[str] = Field(..., min_items=1, max_items=100, description="List of texts to classify")
    max_length: int = Field(128, ge=32, le=512)

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_id: str
    num_classes: int
    classes: List[str]
    load_time_seconds: float

# ──────────────────────────────────────────────
# LIFECYCLE
# ──────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    model_manager.load()

# ──────────────────────────────────────────────
# ENDPOINTS
# ──────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "DarijaBERT Classifier API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health():
    return HealthResponse(
        status="healthy" if model_manager.loaded else "loading",
        model_loaded=model_manager.loaded,
        model_id=MODEL_ID,
        num_classes=model_manager.num_labels,
        classes=[model_manager.id2label.get(i, f"Class {i}") for i in range(model_manager.num_labels)],
        load_time_seconds=round(model_manager.load_time, 2)
    )

@app.post("/predict", response_model=PredictResponse, tags=["Prediction"])
async def predict(request: PredictRequest):
    start = time.time()
    result = model_manager.predict(request.text, request.max_length)
    result["inference_time_ms"] = round((time.time() - start) * 1000, 2)
    return result

@app.post("/predict/batch", tags=["Prediction"])
async def predict_batch(request: BatchPredictRequest):
    start = time.time()
    results = []

    for text in request.texts:
        result = model_manager.predict(text, request.max_length)
        results.append(result)

    total_time = round((time.time() - start) * 1000, 2)

    return {
        "results": results,
        "total_processed": len(results),
        "total_time_ms": total_time,
        "model_id": MODEL_ID
    }

@app.post("/predict/csv", tags=["Prediction"])
async def predict_csv(file: UploadFile = File(...), max_length: int = 128):
    if not file.filename.endswith('.csv'):
        raise HTTPException(400, "Only CSV files are supported")

    contents = await file.read()
    df = pd.read_csv(StringIO(contents.decode('utf-8')))

    if 'Text' not in df.columns:
        raise HTTPException(400, "CSV must contain a 'Text' column")

    results = []
    for _, row in df.iterrows():
        result = model_manager.predict(str(row['Text']), max_length)
        results.append(result)

    # Add predictions to dataframe
    df['Predicted_Label'] = [r['prediction'] for r in results]
    df['Confidence'] = [r['confidence'] for r in results]

    # Convert to CSV
    output = BytesIO()
    df.to_csv(output, index=False, encoding='utf-8')
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=predictions_{file.filename}"}
    )

# ──────────────────────────────────────────────
# RUN
# ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
