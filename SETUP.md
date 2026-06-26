# LearnBuddy AI - Setup Guide

## 1. Add your GROQ API Key

Create the file: `backend/.env`

```
GROQ_API_KEY=your_actual_groq_api_key_here
```

Get your free key at: https://console.groq.com/keys

## 2. Start the Backend

Double-click `start_backend.bat`  
OR run in terminal:
```
cd backend
py -3.14 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

## 3. Start the Frontend

Double-click `start_frontend.bat`  
OR run in terminal:
```
cd frontend
npm run dev
```

Frontend runs at: http://localhost:5173

## Features
- Dashboard with stats
- PDF Upload & text extraction
- AI Summary
- Concept Explainer
- MCQ Generator
- Quiz Mode with scoring
- 2-Mark Question Generator
- 13-Mark Question Generator
- AI Doubt Solver (with PDF context)
- Study Timetable Generator
- Progress Tracker
- Export Notes as PDF
