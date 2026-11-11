import os
import sys
import subprocess
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=" * 70)
    print("           WAVEGUARD AI — RESEARCH PLATFORM LAUNCHER")
    print("  Ultrasonic Guided Wave Classification for Carbon Fibre Plates")
    print("=" * 70)

    # 1. Start Python FastAPI Backend
    print("[1/2] Starting FastAPI Backend on http://127.0.0.1:8000...")
    backend_proc = subprocess.Popen(
        [sys.executable, os.path.join(backend_dir, "run_backend.py")],
        cwd=backend_dir
    )

    time.sleep(2)

    # 2. Start Vite Frontend
    print("[2/2] Starting Vite Frontend on http://localhost:3000...")
    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=True
    )

    print("\n" + "=" * 70)
    print("WaveGuard AI is live!")
    print("Frontend URL:  http://localhost:3000")
    print("Backend API:   http://127.0.0.1:8000")
    print("Swagger Docs:  http://127.0.0.1:8000/docs")
    print("Opening browser at http://localhost:3000 ...")
    print("Press Ctrl+C to terminate both servers.")
    print("=" * 70 + "\n")

    try:
        import webbrowser
        time.sleep(1)
        webbrowser.open("http://localhost:3000")
    except Exception:
        pass

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down WaveGuard AI...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()

