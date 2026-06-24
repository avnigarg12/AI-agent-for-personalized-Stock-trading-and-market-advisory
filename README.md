# TradeMind AI - Intelligent Trading & Advisory Platform

TradeMind AI is a comprehensive, AI-powered stock market trading and advisory platform. It combines real-time market data, advanced machine learning for price prediction, and a conversational AI advisor to help users make smarter investment decisions.


---
Live Demo -https://starlit-zabaione-e8a9f7.netlify.app/

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript** & **Vite**
- **Tailwind CSS** & **Radix UI** for premium aesthetics
- **Recharts** for advanced financial visualization
- **Lucide React** for iconography

### Backend
- **Node.js** with **Express**
- **MongoDB** for persistent user and portfolio data
- **JWT** for secure authentication
- **yfinance** integration for real-time market data

### AI Integration
- **Python 3.12**
- **TensorFlow/Keras** (LSTM models for price forecasting)
- **Scikit-Learn** (Risk profiling & behavior analysis)
- **Groq API** (Llama-3 powered conversational advisory)

---

## 📂 Project Structure

- `frontend/`: Next-generation React application.
- `backend/`: Express API server handling business logic and data.
- `ai_integration/`: Python engine for ML models and market research.

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.12+)
- MongoDB (Local or Atlas)
- Groq API Key

### 2. Environment Setup

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PYTHON_PATH=C:\Path\To\Python.exe
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation & Run

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Core Features

- **Personalized AI Advisor**: Conversational interface that understands your portfolio and risk profile.
- **Smart Market Analysis**: Real-time charts with AI-generated entry, target, and stop-loss levels.
- **Portfolio Management**: Integrated tracking with automatic gain/loss calculations in your native currency (₹/INR).
- **Risk Profiling**: Dynamic investor classification (Conservative, Moderate, Aggressive) based on behavior analysis.

---


---

**Built with ❤️ for smarter trading decisions**
