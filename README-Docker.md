# Docker Setup for Routes Tracker App

This document explains how to run the Routes Tracker App using Docker containers.

## Architecture

The application consists of two main services:

- **Backend**: Django REST API (Python)
- **Frontend**: React SPA served by Nginx

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the repository and navigate to the project root:**

   ```bash
   cd RoutesTrackerApp
   ```

2. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api
   - Django Admin: http://localhost:3000/admin

## Service Details

### Backend (Django)

- **Container**: `climb_backend`
- **Port**: 8000 (internal), proxied through frontend
- **Volume**: Live code reloading in development
- **Database**: SQLite (development)

### Frontend (React + Nginx)

- **Container**: `climb_frontend`
- **Port**: 3000 (external), 80 (internal)
- **Build**: Multi-stage build (Node.js → Nginx)
- **Proxy**: API requests forwarded to backend

## Available Commands

### Start services

```bash
docker-compose up
```

### Start in background

```bash
docker-compose up -d
```

### Build and start (after code changes)

```bash
docker-compose up --build
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Execute commands in containers

```bash
# Django shell
docker-compose exec backend python manage.py shell

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run migrations
docker-compose exec backend python manage.py migrate

# Import routes data
docker-compose exec backend python manage.py import_routes data/Touren.csv
```

## Development vs Production

### Development (current setup)

- Live code reloading
- Debug mode enabled
- SQLite database
- CORS enabled for localhost

### Production Considerations

For production deployment, consider:

1. **Environment variables:**

   ```bash
   export DEBUG=false
   export DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   export CORS_ALLOW_ALL_ORIGINS=false
   ```

2. **Database:**

   - Replace SQLite with PostgreSQL
   - Add database service to docker-compose.yml

3. **Security:**

   - Use secrets for SECRET_KEY
   - Enable HTTPS
   - Configure proper CORS origins

4. **Static files:**
   - Use volume for static files
   - Consider CDN for static assets

## Network Communication

The services communicate through:

1. **Docker network**: `climb_network` (bridge driver)
2. **Service names**: Backend accessible as `backend:8000`
3. **Nginx proxy**: Frontend proxies `/api/*` to backend
4. **CORS**: Configured for cross-origin requests

## File Structure

```
RoutesTrackerApp/
├── docker-compose.yml          # Orchestration
├── climb_manager/              # Django backend
│   ├── Dockerfile             # Backend container
│   ├── .dockerignore          # Backend ignore rules
│   ├── requirements.txt       # Python dependencies
│   └── ...
├── climb_frontend/            # React frontend
│   ├── Dockerfile            # Frontend container (multi-stage)
│   ├── .dockerignore         # Frontend ignore rules
│   ├── nginx.conf            # Nginx configuration
│   └── ...
└── README-Docker.md          # This file
```

## Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   docker-compose down
   # Change ports in docker-compose.yml if needed
   ```

2. **Build failures:**

   ```bash
   docker-compose build --no-cache
   ```

3. **Database issues:**

   ```bash
   docker-compose exec backend python manage.py migrate
   ```

4. **Frontend not loading:**

   - Check if backend is running: `docker-compose logs backend`
   - Verify network connectivity: `docker-compose logs frontend`

5. **API requests failing:**
   - Check nginx logs: `docker-compose logs frontend`
   - Verify CORS settings in Django
   - Check network configuration

### Logs and Debugging

```bash
# Check container status
docker-compose ps

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f

# Debug container internals
docker-compose exec backend bash
docker-compose exec frontend sh
```

## Environment Variables

### Backend

- `DEBUG`: Enable/disable debug mode (default: true)
- `DJANGO_ALLOWED_HOSTS`: Comma-separated allowed hosts
- `CORS_ALLOW_ALL_ORIGINS`: Allow CORS from all origins (default: false)

### Frontend

- `REACT_APP_API_BASE`: API base URL (default: http://localhost:3000/api)

## Data Persistence

- **SQLite database**: Stored in backend container volume
- **Static files**: Shared volume between backend and frontend
- **Code changes**: Live reloading via bind mounts (development)

---

## Next Steps

1. Test the setup: `docker-compose up --build`
2. Import sample data: `docker-compose exec backend python manage.py import_routes data/Touren.csv`
3. Create admin user: `docker-compose exec backend python manage.py createsuperuser`
4. Access the app: http://localhost:3000
