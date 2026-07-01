# Crime Scene Solver App

A full-stack web app with:

- **Frontend**: Next.js
- **Backend**: Flask (CLIP-based crime summarizer, has inference capabilities)
-**Database**: MongoDB

## Running Locally

### Frontend
```bash
cd crime_scene_detection_frontend
npm install
npm run dev

### Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
