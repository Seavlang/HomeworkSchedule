# Docker Deployment Guide

This guide explains how to deploy the Homework Schedule Manager using Docker Compose.

## Prerequisites

- Docker installed (version 20.10 or later)
- Docker Compose installed (version 2.0 or later)

## Quick Start

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** (optional - defaults are provided):
   ```env
   POSTGRES_USER=homeworkuser
   POSTGRES_PASSWORD=homeworkpass
   POSTGRES_DB=homeworksched
   POSTGRES_PORT=5432
   APP_PORT=3000
   DATABASE_URL=postgresql://homeworkuser:homeworkpass@postgres:5432/homeworksched?schema=public
   ```

3. **Build and start services:**
   ```bash
   docker-compose up -d
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`

## Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes database data)
```bash
docker-compose down -v
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Execute commands in containers
```bash
# Run Prisma migrations manually
docker-compose exec app npx prisma migrate deploy

# Run Prisma seed manually
docker-compose exec app npx prisma db seed

# Access database
docker-compose exec postgres psql -U homeworkuser -d homeworksched
```

### Check service status
```bash
docker-compose ps
```

## Services

### PostgreSQL Database
- **Container:** `homeworksched-db`
- **Port:** `5432` (configurable via `POSTGRES_PORT`)
- **Data persistence:** Stored in Docker volume `postgres_data`
- **Health check:** Automatically checks if database is ready

### Next.js Application
- **Container:** `homeworksched-app`
- **Port:** `3000` (configurable via `APP_PORT`)
- **Auto-migration:** Runs Prisma migrations and seeds on startup

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Verify DATABASE_URL in `.env` matches your configuration

### Application won't start
- Check application logs: `docker-compose logs app`
- Ensure database is ready before app starts (health check handles this)
- Rebuild the image: `docker-compose up -d --build`

### Port already in use
- Change `APP_PORT` or `POSTGRES_PORT` in `.env` file
- Or stop the service using the port

### Reset everything
```bash
docker-compose down -v
docker-compose up -d --build
```

## Production Considerations

For production deployment, consider:

1. **Change default passwords** in `.env` file
2. **Use secrets management** instead of `.env` file
3. **Set up SSL/TLS** with a reverse proxy (nginx, traefik)
4. **Configure backups** for the PostgreSQL volume
5. **Set resource limits** in docker-compose.yml
6. **Use environment-specific configurations**
7. **Enable logging** to external service
8. **Set up monitoring** and health checks

## Volume Management

Database data is persisted in the `postgres_data` volume. To backup:

```bash
# Create backup
docker run --rm -v homeworksched_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data

# Restore backup
docker run --rm -v homeworksched_postgres_data:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/postgres-backup.tar.gz --strip 1"
```
