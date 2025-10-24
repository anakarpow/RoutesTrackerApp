# RoutesTrackerApp

A simple full‑stack app to track climbing routes, areas, and climbers. It has a React frontend and a Django backend. You can run it locally with Docker in a couple of commands.

## What’s inside

- Frontend: React (Create React App) served by Nginx
- Backend: Django + Django REST Framework
- Database: SQLite (easy local dev; can switch to Postgres later)
- Web server/proxy: Nginx serves the React build and proxies API/admin to Django
- Containerization: Docker + Docker Compose

## Repo layout

- `climb_frontend/` – React app (builds into static files)
- `climb_manager/` – Django project (includes apps and API)
  - `climb_app/` – core Django app (models, views, templates)
  - `api/` – REST API (serializers, views, urls)
  - `db.sqlite3` – local development database
- `docker-compose.yml` – runs frontend + backend
- `README-Docker.md` – deeper Docker notes and troubleshooting

## How it works (high level)

- The React app is built into static files and served by Nginx on port 3000.
- Requests to `/api/`, `/admin/`, and Django `/static/` are proxied from Nginx to the Django backend on port 8000.
- Django serves the API and the Admin; static files from Django are collected into `staticfiles/` inside the backend container.

## Quick start with Docker (recommended)

Make sure you have Docker and Docker Compose installed.

```bash
# From the project root
docker compose up --build -d

# App entry points
# Frontend (React via Nginx):
#   http://localhost:3000
# API (Django) direct (optional):
#   http://localhost:8000
```

Useful follow‑ups:

```bash
# See running services
docker compose ps

# Tail logs for a service
docker compose logs -f backend

# Rebuild after code changes
docker compose up --build -d

# Stop everything
docker compose down
```

## Running without Docker (optional)

If you prefer to run directly on your machine:

Backend (Django):
```bash
cd climb_manager
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```
Frontend (React):
```bash
cd climb_frontend
npm install
npm start
# Opens http://localhost:3000
```

Note: in this setup, the frontend will talk to the backend at `http://localhost:8000` (you may need to set `REACT_APP_API_BASE` if the code expects it).

## Configuration

Environment variables you’ll commonly touch:

- Backend
  - `DEBUG` – set to `1` for development
  - `DJANGO_ALLOWED_HOSTS` – comma‑separated hosts (e.g. `localhost,127.0.0.1,backend`)
  - `DATABASE_URL` – defaults to SQLite (e.g. `sqlite:///db.sqlite3`)
- Frontend
  - `REACT_APP_API_BASE` – base URL the frontend uses to reach the API (default via Nginx proxy: `http://localhost:3000/api`)

These are defined for Docker in `docker-compose.yml`.

## Tech choices (why)

- React + CRA: fast, simple SPA for the UI
- Django + DRF: batteries‑included backend with a clean API layer
- SQLite for dev: zero setup; swap to Postgres/MySQL when deploying
- Nginx: serves the React build and forwards API/admin to Django
- Docker Compose: one command to run both services consistently everywhere

## Useful URLs

- App (React): http://localhost:3000
- API (proxied by Nginx): http://localhost:3000/api/
- API direct (Django): http://localhost:8000/api/
- Django Admin: http://localhost:3000/admin/ (or http://localhost:8000/admin/)

## Notes for development

- When you change Python code, rebuild/restart the backend container:
  ```bash
  docker compose build backend && docker compose up -d backend
  ```
- When you change React code, rebuild the frontend image:
  ```bash
  docker compose build frontend && docker compose up -d frontend
  ```
- For static files (Django), `collectstatic` is run by the backend container on startup in Compose.

## Next steps (deployment ideas)

- Keep using Docker and deploy to:
  - AWS Elastic Beanstalk (simple managed option)
  - Amazon ECS with Fargate (serverless containers)
  - A VM (EC2/Lightsail) running Docker Compose
- For very low‑cost APIs, consider a serverless API on AWS Lambda + API Gateway.

See `README-Docker.md` for more Docker details.
