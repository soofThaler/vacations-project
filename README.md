# Vacations Site

A full-stack vacation management application. Users can browse vacations, like/unlike them, filter by status, and chat with an AI assistant. Admins can create, update, and delete vacations, and download usage reports.

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- Redux Toolkit (state management)
- React Router v7
- React Hook Form
- Recharts (admin reports chart)
- Axios, JWT-decode, Notyf

**Backend**
- Node.js + Express 5 + TypeScript
- MySQL 8 (via `mysql2`)
- JWT authentication
- `express-fileupload` for image uploads
- Joi validation
- OpenAI SDK (AI recommendations + chat)
- MCP server (`@modelcontextprotocol/sdk`) over SSE

**Infrastructure**
- Docker + Docker Compose
- Nginx (serves the built frontend)

## Project Structure

```
Vacations site/
├── Backend/               # Express + TypeScript API
│   ├── src/
│   │   ├── 1-assets/      # Uploaded vacation images
│   │   ├── 2-utils/       # Config, DAL, helpers, MCP helper
│   │   ├── 3-models/      # Data models, enums, errors
│   │   ├── 4-services/    # Business logic (vacations, users, likes, AI, chat, MCP)
│   │   ├── 5-controllers/ # Express routers
│   │   ├── 6-middleware/  # Security + error-handling middleware
│   │   └── app.ts         # Entry point
│   ├── Dockerfile
│   └── vacations-api.postman_collection.json
├── Frontend/              # React + Vite app
│   ├── src/
│   │   ├── Components/    # Layout, Pages, Shared components
│   │   ├── Models/        # TypeScript models
│   │   ├── Redux/         # Store + slices
│   │   ├── Services/      # API services
│   │   └── Utils/         # AppConfig, Interceptors, etc.
│   ├── Dockerfile
│   └── nginx.conf
├── Database/
│   └── vacations.sql      # Schema + seed data
└── docker-compose.yml
```

## Prerequisites

- Node.js 20+
- MySQL 8 (or Docker)
- An OpenAI API key (for AI recommendations and chat)

## Getting Started

### Option 1 — Docker (recommended)

1. Create a `.env` file in the project root:
   ```env
   MYSQL_ROOT_PASSWORD=your_strong_password
   OPEN_AI_KEY=sk-...
   ```
2. Build and run all services:
   ```bash
   docker compose up --build
   ```
3. Open:
   - Frontend: http://localhost:80 (served by Nginx)
   - Backend API: http://localhost:4000

### Option 2 — Local development

**1. Database**

Start MySQL and import the schema:
```bash
mysql -u root -p < Database/vacations.sql
```

**2. Backend**
```bash
cd Backend
npm install
```
Create `Backend/.env`:
```env
ENVIRONMENT=development
PORT=4000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=vacation_management
OPEN_AI_KEY=sk-...
```
Then:
```bash
npm start
```

**3. Frontend**
```bash
cd Frontend
npm install
npm run dev
```
Open http://localhost:5173 (Vite dev server — default port).

## Demo Accounts

The database seed (`Database/vacations.sql`) includes two pre-made users you can log in with immediately:

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | `admin@admin.com` | `1234`   |
| User  | `user@user.com`   | `1234`   |

> The Admin account unlocks the admin panel (add / edit / delete vacations, CSV download, reports chart). The regular User can browse, like, and chat.

## API Overview

Base URL: `http://localhost:4000`

| Group | Method | Endpoint | Auth |
|---|---|---|---|
| Auth | POST | `/api/register` | — |
| Auth | POST | `/api/login` | — |
| Vacations | GET | `/api/vacations` | User |
| Vacations | GET | `/api/vacations/:id` | User |
| Vacations | POST | `/api/vacations` | Admin |
| Vacations | PUT | `/api/vacations/:id` | Admin |
| Vacations | DELETE | `/api/vacations/:id` | Admin |
| Vacations | GET | `/api/vacations/download/csv` | Admin |
| Vacations | GET | `/api/vacations/reports/data` | Admin |
| Vacations | GET | `/api/vacations/images/:imageName` | — |
| Vacations | GET | `/api/vacations/ai/recommendation/:destination` | User |
| Likes | POST | `/api/likes/:vacation_id` | User |
| Likes | DELETE | `/api/likes/:vacation_id` | User |
| Chat | POST | `/api/chat` | — |
| MCP | GET | `/sse` | — |
| MCP | POST | `/messages` | — |

A ready-to-import Postman collection is available at [Backend/vacations-api.postman_collection.json](Backend/vacations-api.postman_collection.json).

## Features

- **Authentication** — Register / login with JWT; role-based access (User / Admin).
- **Vacations** — Pagination, filtering (liked / active / upcoming), image upload.
- **Likes** — Users can like/unlike vacations; like counts update in real time.
- **Admin panel** — Add / edit / delete vacations, view reports chart, download CSV.
- **AI recommendations** — Short, destination-specific travel tips powered by OpenAI.
- **AI chat assistant** — Answers user questions about vacations.
- **MCP server** — Exposes vacation data as tools consumable by MCP clients.

## Environment Variables

**Backend**
| Name | Purpose |
|---|---|
| `ENVIRONMENT` | `development` or `production` |
| `PORT` | API port (e.g. `4000`) |
| `MYSQL_HOST` | MySQL host |
| `MYSQL_USER` | MySQL user |
| `MYSQL_PASSWORD` | MySQL password |
| `MYSQL_DATABASE` | MySQL database name |
| `OPEN_AI_KEY` | OpenAI API key |

**Docker Compose (.env)**
| Name | Purpose |
|---|---|
| `MYSQL_ROOT_PASSWORD` | Root password for MySQL container |
| `OPEN_AI_KEY` | OpenAI API key passed to the backend |

## License

Educational / portfolio project.
