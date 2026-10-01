# 🌦️ Weather Intelligence Platform

### 🌍 Real-Time Weather. Smart Insights. Better Decisions.

A modern, full-stack weather intelligence platform that combines **real-time weather data, forecasts, air quality, interactive maps, radar, AI-powered assistance, travel planning, activities, and city comparison** in one responsive application.

<p align="center">

**React + Vite** · **FastAPI** · **OpenWeather** · **Leaflet** · **CARTO** · **Vercel** · **Render**

</p>

---

## 🚀 Live Application

<p align="center">

### 🌐 Frontend

**[Open Weather Intelligence Platform](YOUR_VERCEL_URL)**

### ⚡ Backend API

**[Open API](https://weather-intelligence-platform-5vne.onrender.com)**

### 📚 API Documentation

**[Swagger / OpenAPI](https://weather-intelligence-platform-5vne.onrender.com/docs)**

</p>

> Replace `YOUR_VERCEL_URL` with your final Vercel deployment URL.

---

# ✨ What Makes It Special?

Weather Intelligence Platform is more than a simple weather application.

It brings together:

🌤️ **Live Weather**

📅 **10-Day Forecast**

🌧️ **Weather Radar**

🗺️ **Interactive Weather Maps**

💨 **Air Quality**

🤖 **AI Weather Advisor**

✈️ **Travel Planner**

🏃 **Weather-Based Activities**

🏙️ **City Comparison**

📍 **GPS Location**

🔎 **Smart City Search**

🔐 **Secure Authentication**

📱 **Responsive Mobile & Desktop UI**

---

# 🎯 Core Features

<table>
<tr>
<td width="50%">

### 🌤️ Dashboard

* Current weather
* Temperature
* Feels-like temperature
* Humidity
* Wind
* Pressure
* Sunrise & sunset
* GPS location
* Smart city search

</td>

<td width="50%">

### 📅 Forecast

* 10-day forecast
* Weather graphs
* Air quality
* Rain information
* Hottest locations
* Coolest locations
* Rainiest locations
* Weather insights

</td>
</tr>

<tr>
<td>

### 🗺️ Weather Map

* Interactive map
* Leaflet integration
* CARTO basemap
* Weather overlays
* Responsive controls
* Lazy-loaded map engine

</td>

<td>

### 🌧️ Radar

* Precipitation radar
* Radar overlays
* Current radar frame
* Cached radar capability
* Lazy-loaded radar resources

</td>
</tr>

<tr>
<td>

### 🤖 AI Weather Advisor

Get weather-aware assistance and intelligent recommendations using the platform's AI integration.

</td>

<td>

### ✈️ Travel Planner

Plan trips while considering weather conditions at your destination.

</td>
</tr>

<tr>
<td>

### 🏃 Activities

Discover activities based on current and forecast weather conditions.

</td>

<td>

### 🏙️ City Comparison

Compare weather conditions between multiple cities.

</td>
</tr>
</table>

---

# 🔐 Guest vs Authenticated Features

The application separates public weather information from personalized features.

### 👤 Without Login

Users can access:

```text
🌤️ Dashboard
📅 Forecast
🗺️ Weather Map
🌧️ Radar
```

### 🔑 After Login

Authenticated users can additionally access:

```text
🤖 AI Weather Advisor
🏃 Activities
✈️ Travel Planner
🏙️ City Comparison
```

Authentication uses **JWT-based authorization**.

---

# 🧭 Application Flow

```text
                         🌦️ WEATHER INTELLIGENCE
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
            👤 Guest User                    🔐 Logged User
                 │                                 │
        ┌────────┼────────┐              ┌─────────┼─────────┐
        ▼        ▼        ▼              ▼         ▼         ▼
     Dashboard Forecast  Map          AI Advisor Activities Travel
                 │        │                       │
                 └────────┼───────────────────────┘
                          ▼
                       Radar
```

---

# 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                       USER                              │
│              💻 Laptop · 📱 Mobile · 🖥️ Desktop         │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     VERCEL                              │
│                                                         │
│              React + TypeScript + Vite                  │
│                                                         │
│  Dashboard │ Forecast │ Map │ Radar │ AI │ Travel       │
└─────────────────────────┬───────────────────────────────┘
                          │
                       HTTPS
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      RENDER                             │
│                                                         │
│                    FastAPI Backend                      │
│                                                         │
│  Weather │ Auth │ Radar │ Cache │ Air Quality │ AI     │
└──────────────┬──────────────┬──────────────┬────────────┘
               │              │              │
               ▼              ▼              ▼
        ┌────────────┐ ┌────────────┐ ┌────────────┐
        │ OpenWeather│ │ Open-Meteo │ │ AI Service │
        └────────────┘ └────────────┘ └────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

| Technology        | Purpose             |
| ----------------- | ------------------- |
| ⚛️ React          | UI framework        |
| ⚡ Vite            | Build tooling       |
| 📘 TypeScript     | Type safety         |
| 🧭 React Router   | Application routing |
| 🗺️ React Leaflet | Interactive maps    |
| 🍃 Leaflet        | Map engine          |
| 🎨 Lucide         | Icons               |

### Backend

| Technology  | Purpose             |
| ----------- | ------------------- |
| 🐍 Python   | Backend language    |
| ⚡ FastAPI   | REST API            |
| 🚀 Uvicorn  | ASGI server         |
| 📦 Pydantic | Data validation     |
| 🌐 HTTPX    | Async HTTP requests |
| 🔐 JWT      | Authentication      |
| 🗄️ SQLite  | Database            |

### External Services

```text
🌤️ OpenWeather
💨 Open-Meteo
🗺️ CARTO
🤖 AI Provider
🌧️ Weather Radar Provider
```

### Deployment

```text
GitHub
   │
   ├──────────────► ▲ Vercel
   │                  │
   │              Frontend
   │
   └──────────────► 🚀 Render
                      │
                   Backend
```

---

# ⚡ Performance Engineering

Performance was a major focus of the project.

## 🚀 Route-Based Code Splitting

Heavy pages are loaded only when required.

```text
Initial Load
    │
    ├── Dashboard
    │
    └── Core UI
          │
          ├── Forecast → loaded when opened
          ├── Map      → loaded when opened
          ├── Radar    → loaded when opened
          ├── AI       → loaded when opened
          └── Travel   → loaded when opened
```

This prevents unnecessary JavaScript from being downloaded during the initial page load.

---

# 🗺️ Lazy Map Loading

Leaflet and map resources are **not loaded on the Dashboard**.

They are loaded only when the user opens:

```text
🗺️ Weather Map
🌧️ Radar
```

This reduces the initial JavaScript bundle and network requests.

---

# 🧠 Backend Caching

The backend implements an in-memory TTL cache.

| Data                 |      TTL |
| -------------------- | -------: |
| 🌤️ Current Weather  |    5 min |
| 🕐 Hourly Forecast   |   10 min |
| 📅 Daily Forecast    |   10 min |
| 💨 Air Quality       |   10 min |
| 📍 Coordinates       | 24 hours |
| 🌧️ Radar Capability |   1 hour |

### Additional caching features

* Case-insensitive cache keys
* Coordinate normalization
* Maximum cache capacity
* Automatic expiration
* Request coalescing
* Stale-data fallback
* Map tile HTTP caching

---

# 📊 Performance Results

Optimized backend response times:

| Endpoint            |   Optimized |
| ------------------- | ----------: |
| 🌤️ Current Weather | **~380 ms** |
| 🕐 Hourly Forecast  | **~420 ms** |
| 📅 Daily Forecast   | **~430 ms** |
| 💨 Air Quality      | **~600 ms** |
| 📍 Coordinates      | **~850 ms** |

Repeated cached requests can return in only a few milliseconds.

---

# 📱 Responsive Design

The application is designed for:

```text
📱 Mobile
   ↓
📲 Tablet
   ↓
💻 Laptop
   ↓
🖥️ Desktop
```

The interface adapts to different screen sizes and supports touch-friendly interaction.

---

# 🔎 Smart City Search

The search system supports:

* 🔍 City-name search
* 💡 Suggestions while typing
* 📍 GPS location
* 🌤️ Instant weather lookup
* 🔄 City changes without unnecessary page refreshes

Example:

```text
Search: Vyara

        ┌─────────────────────────┐
        │ 🔍 Vyara                │
        ├─────────────────────────┤
        │ 📍 Vyara, Gujarat       │
        │ 📍 Vyara region         │
        └─────────────────────────┘
```

---

# 🗺️ Maps

The platform uses:

### Map Engine

**Leaflet + React Leaflet**

### Basemap

**CARTO**

```text
React
  ↓
React Leaflet
  ↓
Leaflet
  ↓
CARTO Basemap
```

Map attribution should remain visible according to the applicable provider requirements.

---

# 📂 Project Structure

```text
weather-intelligence-platform/
│
├── 📁 frontend/
│   ├── 📁 src/
│   ├── 📁 public/
│   ├── 📄 package.json
│   ├── 📄 package-lock.json
│   ├── 📄 vite.config.ts
│   └── 📄 vercel.json
│
├── 📁 backend/
│   ├── 📁 app/
│   │   ├── 📄 main.py
│   │   ├── 📁 services/
│   │   ├── 📁 routes/
│   │   └── ...
│   │
│   ├── 📄 requirements.txt
│   └── ...
│
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 render.yaml
└── 📄 README.md
```

---

# 💻 Local Development

## 1️⃣ Clone

```bash
git clone https://github.com/Anshshah26/weather-intelligence-platform.git

cd weather-intelligence-platform
```

---

## 2️⃣ Backend

```bash
cd backend
```

Create virtual environment:

### Windows

```powershell
python -m venv .venv
.venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

---

# 3️⃣ Frontend

Open another terminal:

```bash
cd frontend
```

Install:

```bash
npm install
```

Configure:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

## Frontend

```env
VITE_API_BASE_URL=http://localhost:8000
```

Production:

```env
VITE_API_BASE_URL=https://weather-intelligence-platform-5vne.onrender.com
```

## Backend

```env
PORT=8000
HOST=0.0.0.0

OPENWEATHER_API_KEY=
CARTO_BASEMAP_KEY=
AI_API_KEY=

RADAR_PROVIDER=openweather_global_precipitation

JWT_SECRET_KEY=
```

### 🔒 Security Rules

**Never commit real secrets to GitHub.**

Never expose:

```text
❌ OPENWEATHER_API_KEY
❌ AI_API_KEY
❌ JWT_SECRET_KEY
```

Frontend variables beginning with `VITE_` are exposed to the browser, so **backend secrets must remain on Render**.

---

# 🚀 Deployment

## ▲ Frontend — Vercel

Configure:

```text
Framework:
Vite

Root Directory:
frontend

Build Command:
npm run build

Output Directory:
dist
```

Environment variable:

```text
VITE_API_BASE_URL=https://weather-intelligence-platform-5vne.onrender.com
```

---

## 🚀 Backend — Render

Configure:

```text
Environment:
Python 3

Root Directory:
backend

Build Command:
pip install -r requirements.txt

Start Command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Production variables:

```text
OPENWEATHER_API_KEY
FRONTEND_URL
JWT_SECRET_KEY
AI_API_KEY
```

---

# 🧪 API Endpoints

## Weather

```http
GET /api/weather/current
GET /api/weather/hourly
GET /api/weather/daily
GET /api/weather/air-quality
GET /api/weather/coordinates
GET /api/weather/city-suggestions
```

## Radar

```http
GET /api/weather/radar
```

## Authentication

```http
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/me
```

## Health

```http
GET /api/health
```

---

# 🔐 Authentication Architecture

```text
                 👤 User
                   │
                   ▼
             Login / Signup
                   │
                   ▼
            FastAPI Backend
                   │
                   ▼
               JWT Token
                   │
                   ▼
              Frontend
                   │
          ┌────────┴────────┐
          ▼                 ▼
     Public Pages      Protected Pages
                           │
          ┌────────────────┼───────────────┐
          ▼                ▼               ▼
      🤖 AI Advisor    ✈️ Travel       🏙️ Compare
```

---

# 🧪 Testing

### Frontend Production Build

```bash
npm run build
```

### Backend Tests

```bash
pytest
```

### Health Check

```text
GET /api/health
```

Expected:

```json
{
  "status": "ok"
}
```

---

# 🛡️ Security

The project follows several security practices:

* 🔐 JWT authentication
* 🔒 Backend-only API secrets
* 🌐 CORS configuration
* 🚫 `.env` excluded from Git
* 🧹 No secrets exposed in frontend builds
* 🔑 Environment-based production configuration
* 🛡️ Protected authenticated routes

---

# 🔮 Future Roadmap

### 🌧️ Weather

* [ ] Advanced precipitation animation
* [ ] Severe weather alerts
* [ ] Historical weather
* [ ] More weather layers
* [ ] Weather notifications

### 🤖 AI

* [ ] Personalized weather recommendations
* [ ] AI trip optimization
* [ ] Natural-language weather search
* [ ] More intelligent activity recommendations

### 🗺️ Maps

* [ ] More map layers
* [ ] Satellite visualization
* [ ] Improved radar animation
* [ ] Weather timeline

### 📊 Analytics

* [ ] Historical weather charts
* [ ] Long-term weather trends
* [ ] Advanced city comparison
* [ ] Weather statistics

---

# 👨‍💻 Author

## Ansh Shah

**Weather Intelligence Platform**

GitHub:

**[Anshshah26](https://github.com/Anshshah26)**

Repository:

**[weather-intelligence-platform](https://github.com/Anshshah26/weather-intelligence-platform)**

---

# ⭐ Support the Project

If you find this project useful:

⭐ Star the repository

🍴 Fork the project

🐛 Report issues

💡 Suggest improvements

---

# 📜 License

Add your preferred open-source license here.

---

<p align="center">

### 🌦️ Weather Intelligence Platform

**Know the weather. Understand the conditions. Plan smarter.**

Built with ❤️ using React, FastAPI, and modern web technologies.

</p>
