import os
import sys

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import uvicorn

if __name__ == "__main__":
    print("=" * 70)
    print("WaveGuard AI — Aero Composite Guided Wave Classification Platform")
    print("FastAPI Backend Server starting on http://127.0.0.1:8000")
    print("API Documentation (Swagger UI): http://127.0.0.1:8000/docs")
    print("=" * 70)
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

