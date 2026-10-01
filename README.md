# Weather Intelligence Platform 🌤️

An enterprise-grade, high-performance Weather Intelligence Platform designed to deliver real-time weather analytics, forecast visualization, and intelligent atmospheric data processing.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (v3) + Modern Glassmorphism Design
- **Icons:** Lucide React

### Backend
- **Framework:** Python 3.10+ with FastAPI
- **Server:** Uvicorn (ASGI)
- **Validation:** Pydantic v2
- **CORS:** Starlette CORS Middleware

---

## 📁 Project Structure

```
weather-intelligence-platform/
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py
│   └── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **npm** or **pnpm** / **yarn**

---

### 1️⃣ Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a Python virtual environment:**
   - On Windows (PowerShell):
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - On macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the FastAPI backend server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The API server will start at:* `http://localhost:8000`  
   *API Interactive Docs (Swagger):* `http://localhost:8000/docs`

---

### 2️⃣ Frontend Setup

1. **Open a new terminal tab/window and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Run the Vite development server:**
   ```bash
   npm run dev
   ```
   *The frontend application will be available at:* `http://localhost:5173`

---

## 🧪 Verifying Initial Installation

1. **Verify Backend Health Endpoint:**
   - Open browser or terminal and request `GET http://localhost:8000/api/health`.
   - Expected JSON response:
     ```json
     {
       "status": "ok",
       "message": "Weather Intelligence Platform API is running"
     }
     ```

2. **Verify Frontend Application:**
   - Open `http://localhost:5173` in your browser.
   - You should see the **Weather Intelligence Platform** header along with live status verification communicating with the backend health endpoint.

---

## 📌 Current Development Stage
- **Phase 1: Initial Foundation Setup (Completed)**
  - Basic Vite + React + TypeScript + Tailwind CSS structure created.
  - FastAPI server with CORS & health check endpoint configured.
  - Root directory environment and documentation established.
