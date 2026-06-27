# Campus Placement Portal

A MERN stack campus placement portal with:

- Student dashboard
- Company portal
- AI-style resume/job matching
- Online coding tests
- Express API with MongoDB models and in-memory fallback
- React + Vite frontend

## Run Locally

```bash
npm run install:all
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Environment

Create `server/.env` if you want MongoDB persistence:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus-placement-portal
```

Without `MONGO_URI`, the app runs with seeded in-memory demo data.
