# UniVio Course Planning Tool - Deployment Guide

## 🐳 Docker Deployment

This application is fully containerized with Docker and includes Chrome/Chromium for web scraping capabilities.

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM (recommended 8GB+)
- 20GB+ disk space

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd course-planning-tool
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

3. **Build and run (Development)**
   ```bash
   docker-compose up --build
   ```

4. **Build and run (Production)**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Environment Variables

Copy `env.example` to `.env` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_PASSWORD` | Database password | ✅ |
| `SECRET_KEY` | Backend secret key (32+ chars) | ✅ |
| `NEXTAUTH_SECRET` | NextAuth secret | ✅ |
| `RESEND_API_KEY` | Email service API key | ✅ |
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `CORS_ORIGINS` | Allowed frontend domains | ✅ |
| `NEXTAUTH_URL` | Frontend URL | ✅ |

### Services

The application consists of:

- **Frontend** (Next.js): Port 3000
- **Backend** (FastAPI): Port 8000  
- **Database** (PostgreSQL): Port 5432
- **Cache** (Redis): Port 6379
- **Proxy** (Nginx): Ports 80/443

### Chrome/Selenium Configuration

The backend container includes:
- Google Chrome (headless)
- ChromeDriver
- All necessary dependencies for web scraping

Chrome runs with these production options:
- `--headless` - No GUI
- `--no-sandbox` - Required for Docker
- `--disable-dev-shm-usage` - Prevents crashes
- `--disable-gpu` - Not needed in headless mode

### Cloud Deployment Options

#### 1. AWS ECS/Fargate
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t univio-backend ./backend
docker tag univio-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/univio-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/univio-backend:latest
```

#### 2. Google Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/univio-backend ./backend
gcloud run deploy --image gcr.io/PROJECT-ID/univio-backend --platform managed
```

#### 3. Railway
```bash
# Connect your GitHub repo to Railway
# Railway will automatically detect and deploy your Docker containers
```

#### 4. Render
```bash
# Connect your GitHub repo to Render
# Use docker-compose.prod.yml for deployment
```

### Database Setup

The application uses PostgreSQL with automatic migrations:

1. **Development**: Database initializes automatically
2. **Production**: Run migrations manually:
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
   ```

### Monitoring & Logs

View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

Health checks are configured for all services.

### Scaling

Scale specific services:
```bash
# Scale backend instances
docker-compose up --scale backend=3

# Scale with load balancer
docker-compose -f docker-compose.prod.yml up --scale backend=3 --scale frontend=2
```

### Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Secrets Management**: Use cloud provider secret managers
3. **SSL/TLS**: Configure SSL certificates in nginx
4. **Firewall**: Only expose necessary ports (80, 443)
5. **Updates**: Regularly update base images

### Troubleshooting

#### Chrome/Selenium Issues
```bash
# Check Chrome installation
docker-compose exec backend google-chrome --version
docker-compose exec backend chromedriver --version

# Test scraping
docker-compose exec backend python -c "from selenium import webdriver; print('Selenium works!')"
```

#### Memory Issues
- Increase Docker memory limit (8GB+ recommended)
- Monitor container memory usage
- Consider using Chrome's `--memory-pressure-off` flag

#### Database Connection Issues
```bash
# Check database connectivity
docker-compose exec backend pg_isready -h db -p 5432 -U courseplan_user
```

### Performance Optimization

1. **Multi-stage builds**: Already implemented in Dockerfiles
2. **Layer caching**: Optimize Docker layer order
3. **Resource limits**: Set memory/CPU limits in production
4. **CDN**: Use CDN for static assets
5. **Database**: Configure PostgreSQL for production workloads

### Backup & Recovery

```bash
# Database backup
docker-compose exec db pg_dump -U courseplan_user course_planning > backup.sql

# Database restore
docker-compose exec -T db psql -U courseplan_user course_planning < backup.sql
```

## 🚀 Ready for Production!

Your application is now containerized and ready for cloud deployment with full Chrome/Selenium support for web scraping. 