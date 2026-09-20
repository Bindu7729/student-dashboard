# 🎓 EduRisk: AI-Powered Student Dropout Risk Prediction Platform

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776ab.svg?logo=python)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg?logo=sqlite)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg?logo=next.js)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg?logo=vercel)

> **Live Demo →** [https://edurisk-ai.vercel.app](https://edurisk-ai.vercel.app)

EduRisk is a full-stack, AI-driven educational analytics platform designed to proactively identify students at risk of dropping out. It provides real-time dashboards for **Students**, **Faculty**, and **Deans**, leveraging Machine Learning to offer explainable risk scores and personalized intervention recommendations.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 👨‍🏫 Faculty | `faculty1@gmail.com` | `password` |
| 🎓 Dean / HOD | `dean1@gmail.com` | `password` |
| 👩‍🎓 Student | `student@gmail.com` | `password` |

---

## ✨ Features

- **RBAC Authentication** — Secure JWT-based access control with distinct personas (Student, Faculty, Dean).
- **AI Prediction Engine** — CalibratedClassifierCV (XGBoost-based) ML model predicting dropout risk from academic and behavioral data.
- **Explainable AI (XAI)** — SHAP integration to provide transparent, per-student reasons for high-risk scores.
- **Real-Time Dashboards** — Role-specific dashboards with KPI cards, charts, and risk heatmaps powered by Recharts.
- **Intervention Management** — Workflow tools for faculty to log, track, and evaluate student interventions.
- **Department Analytics** — Dean-level executive insights with department-wise risk breakdown and faculty performance.
- **Attendance & Engagement Tracking** — Visual reports on attendance trends, LMS engagement, and login patterns.
- **Predictive Insights** — ML model feature importance, risk forecasting, and confidence scoring.
- **Graceful Fallbacks** — All service layers fall back to realistic static data when backend is unavailable.
- **Production Ready** — CI/CD via GitHub Actions, deployed on Vercel (frontend) with Render-ready backend config.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    EduRisk Platform                     │
├──────────────────────┬──────────────────────────────────┤
│  Frontend (Vercel)   │  Backend (FastAPI)                │
│  Next.js 16 + React  │  Python 3.12 + SQLAlchemy        │
│  TypeScript          │  SQLite (student_risk.db)         │
│  Tailwind CSS v4     │  JWT Auth (python-jose)           │
│  Zustand (state)     │  ML Model (XGBoost + SHAP)        │
│  Recharts + Framer   │  450 seeded students              │
└──────────────────────┴──────────────────────────────────┘
```

The platform utilizes a modern monorepo architecture:

- **Frontend**: Next.js 16.2 (React 19) + TypeScript + Tailwind CSS v4
- **Backend**: FastAPI (Python 3.12) + SQLAlchemy ORM
- **Database**: SQLite (pre-seeded with 450 students, 558 risk scores, real SHAP values)
- **ML Model**: CalibratedClassifierCV (XGBoost) + SHAP Explainer (~94% accuracy)
- **Auth**: JWT tokens, role-based access (Student / Faculty / Dean / Admin)
- **DevOps**: GitHub Actions CI/CD, Vercel deployment, Render-ready backend config

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- Python 3.10+

### 1. Clone the repository

```bash
git clone https://github.com/Bindu7729/student-dashboard.git
cd student-dashboard
```

### 2. Start the Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at: [http://localhost:8000](http://localhost:8000)  
API docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
student-dashboard/
├── frontend/                  # Next.js 16 application
│   ├── src/
│   │   ├── app/               # App router pages
│   │   │   ├── (auth)/        # Login, signup pages
│   │   │   ├── student/       # Student dashboard & subpages
│   │   │   ├── faculty/       # Faculty dashboard & subpages
│   │   │   └── dean/          # Dean dashboard & subpages
│   │   ├── services/          # API service layer
│   │   │   ├── auth.ts        # Authentication service
│   │   │   ├── student.ts     # Student data service
│   │   │   ├── faculty.ts     # Faculty data service
│   │   │   └── dean.ts        # Dean data service
│   │   ├── store/             # Zustand state management
│   │   └── lib/               # Axios API client
│   └── vercel.json            # Vercel deployment config
│
├── backend/                   # FastAPI application
│   ├── app/
│   │   ├── main.py            # App entry point + lifespan
│   │   ├── config.py          # Settings (pydantic-settings)
│   │   ├── models.py          # SQLAlchemy ORM models
│   │   ├── database.py        # DB engine + session
│   │   └── routes/
│   │       ├── auth.py        # JWT auth endpoints
│   │       ├── student_dashboard.py
│   │       ├── faculty_dashboard.py
│   │       ├── dean.py        # Dean executive endpoints
│   │       └── frontend.py    # Public student list endpoint
│   ├── student_risk.db        # Pre-seeded SQLite database
│   ├── requirements.txt
│   └── .env.example           # Environment variable template
│
├── ml_models/
│   └── dropout_risk_model.joblib   # Trained ML model (1.1MB)
│
├── render.yaml                # Render.com backend deployment
└── docker-compose.yml         # Docker configuration
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | JWT login (form-encoded) |
| `GET` | `/api/auth/me` | Current user info |

### Student
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/student/{id}/overview` | Dashboard KPIs |
| `GET` | `/api/student/{id}/risk` | ML risk score + SHAP |
| `GET` | `/api/student/{id}/performance` | Semester-wise GPA |
| `GET` | `/api/student/{id}/attendance` | Attendance records |
| `GET` | `/api/student/{id}/assignments` | Assignment progress |

### Faculty
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/faculty/overview` | Department KPIs |
| `GET` | `/api/faculty/students` | Paginated student list |
| `GET` | `/api/faculty/analytics/department` | Department analytics |
| `GET` | `/api/faculty/students/{id}` | Full student profile |
| `POST` | `/api/faculty/upload/{type}` | Upload student data |

### Dean
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dean/overview` | Executive KPIs |
| `GET` | `/api/dean/department-analytics` | Dept risk breakdown |
| `GET` | `/api/dean/faculty-performance` | Advisor performance |
| `GET` | `/api/dean/academic-trends` | GPA & pass/fail trends |
| `GET` | `/api/dean/engagement-attendance` | Behavioral metrics |
| `GET` | `/api/dean/interventions` | Intervention tracking |
| `GET` | `/api/dean/predictive-insights` | ML model insights |

---

## 🤖 ML Model

- **Algorithm**: CalibratedClassifierCV wrapping XGBoost classifier
- **Accuracy**: ~94.2% on validation set
- **Features**: Attendance rate, GPA, engagement score, login gap, assignment completion, failure ratio, backlogs
- **Explainability**: SHAP values computed per-student, top risk factors surfaced in UI
- **Database**: 450 students, 558 risk scores pre-seeded with real SHAP explanations

---

## 🚢 Deployment

### Frontend — Vercel ✅ Live

```bash
cd frontend
npx vercel --prod
```

Set environment variable on Vercel:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

### Backend — Render.com

1. Go to [render.com](https://render.com) → New Web Service
2. Connect `Bindu7729/student-dashboard` repo
3. Set **Root Directory** → `backend`
4. Render auto-detects `render.yaml` → Deploy
5. Copy the Render URL and update `NEXT_PUBLIC_API_URL` on Vercel

---

## 🧪 Testing

```bash
cd backend
pytest tests/ -v
# 110 tests passing ✅
```

---

## 📖 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 16.2 (App Router) |
| UI Library | React 19 + Tailwind CSS v4 |
| State Management | Zustand |
| Charts | Recharts + Framer Motion |
| HTTP Client | Axios |
| Backend Framework | FastAPI 0.109 |
| ORM | SQLAlchemy 2.0 |
| Database | SQLite (production-ready) |
| Auth | JWT (python-jose + passlib) |
| ML | XGBoost + Scikit-learn + SHAP |
| Deployment | Vercel (frontend) + Render (backend) |
| CI/CD | GitHub Actions |

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Bindu7729">Bindu7729</a>
  <br/>
  <a href="https://edurisk-ai.vercel.app">🌐 Live Demo</a> •
  <a href="https://github.com/Bindu7729/student-dashboard/issues">🐛 Report Bug</a> •
  <a href="https://github.com/Bindu7729/student-dashboard/issues">✨ Request Feature</a>
</div>