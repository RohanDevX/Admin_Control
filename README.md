# OnBoarding Panel

A full-stack web application designed to manage community events and organizations with secure user authentication, media uploads, and a clean React-based dashboard.

---

##  Overview

The **OnBoarding Panel** helps communities streamline their event management — from creating and updating events to managing organizations, all through a secure login system.  
It’s built with a modern stack and focuses on scalability, modularity, and clarity.

---

##  Highlights

- 🔐 JWT-based authentication (Access + Refresh tokens)
- 🗃️ PostgreSQL with UUIDs and normalized schema
- 🖼️ File upload handling using Multer
- 📊 Responsive React dashboard (Grid & Flexbox)
- 🧩 MVC backend structure with clean routing
- 🧾 Winston logging for structured server logs

---

## Tech Stack

**Backend:**
- Node.js + Express.js  
- PostgreSQL (with UUID)  
- JWT, bcryptjs, Multer, Winston  

**Frontend:**
- React.js + React Router  
- Axios, Context API  
- CSS Grid / Flexbox for responsiveness  

##  Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/RohanDevX/Admin_Control.git
cd OnBoarding-panel
2. Backend Setup
bash
Copy code
cd backend
npm install
3. Frontend Setup
bash
Copy code
cd ../Frontend
npm install
--- Database Setup
Create PostgreSQL Database
sql
Copy code
CREATE DATABASE onBoarding_db;
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE onBoarding_db TO postgres;

\c onBoarding_db
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
Apply Schema
bash
Copy code
cd backend
psql -U postgres -d onBoarding_db -f Schema.sql
--- Environment Setup
Backend (backend/.env)
env
Copy code
DATABASE_URL=postgres://postgres:your_password@localhost:5432/onBoarding_db
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7 days
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
Frontend (Frontend/.env)
env
Copy code
REACT_APP_API_URL=http://localhost:5000/api/v1/
NODE_ENV=development
▶️ Run Locally
bash
Copy code
# Backend
cd backend
npm run dev

# Frontend
cd ../Frontend
npm start
Backend → http://localhost:5000

Frontend → http://localhost:3000

📚 API Overview
Auth
POST /api/v1/users → Register user

POST /api/v1/auth/login → Login

GET /api/v1/auth/me → Get current user

POST /api/v1/auth/refresh → Refresh token

POST /api/v1/auth/logout → Logout

Events
GET /api/v1/events → Fetch events

POST /api/v1/events → Create event

PUT /api/v1/events/:id → Update event

DELETE /api/v1/events/:id → Delete event

Community
GET /api/v1/community → Get communities

POST /api/v1/community → Create community

📁 Folder Structure
pgsql
Copy code
OnBoarding-panel/
├── backend/
│   ├── Controllers/
│   ├── middleware/
│   ├── Model/
│   ├── Routes/
│   ├── Services/
│   ├── uploads/
│   ├── Schema.sql
│   └── index.js
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── assets/
│   └── public/
└── README.md
🧪 Troubleshooting
Database Connection Failed
→ Check DATABASE_URL, ensure PostgreSQL is running.

Invalid Credentials
→ Make sure user registered via API, check bcrypt setup.

Upload Error
→ Verify upload directory permissions and file type.

Frontend → Backend CORS Issue
→ Match frontend URL in CORS_ORIGIN env.

👥 Author
Rohan R — Full Stack Developer


📝 License
Licensed under the MIT License — see the LICENSE file for details.
