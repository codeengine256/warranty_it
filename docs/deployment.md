# Deployment Guide

This guide covers different deployment options for the WarrantyIt application.

## 🚀 Quick Deployment with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd WarrantyIt
   ```

2. **Configure environment**
   ```bash
   # Copy environment files
   cp backend/env.example backend/.env
   cp frontend/env.example frontend/.env
   
   # Update backend/.env with production values
   DATABASE_URL="postgresql://warranty_user:warranty_password@postgres:5432/warranty_it?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   NODE_ENV="production"
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database**
   ```bash
   # Run migrations
   docker-compose exec backend npx prisma migrate deploy
   
   # Seed database
   docker-compose exec backend npx prisma db seed
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

## ☁️ Cloud Deployment

### AWS Deployment

#### Using AWS ECS with Fargate

1. **Create ECR repositories**
   ```bash
   # Backend
   aws ecr create-repository --repository-name warranty-it-backend
   
   # Frontend
   aws ecr create-repository --repository-name warranty-it-frontend
   ```

2. **Build and push images**
   ```bash
   # Backend
   docker build -t warranty-it-backend ./backend
   docker tag warranty-it-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/warranty-it-backend:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/warranty-it-backend:latest
   
   # Frontend
   docker build -t warranty-it-frontend ./frontend
   docker tag warranty-it-frontend:latest <account>.dkr.ecr.<region>.amazonaws.com/warranty-it-frontend:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/warranty-it-frontend:latest
   ```

3. **Set up RDS PostgreSQL**
   - Create RDS PostgreSQL instance
   - Configure security groups
   - Update DATABASE_URL in environment variables

4. **Deploy with ECS**
   - Create ECS cluster
   - Create task definitions for backend and frontend
   - Create services and configure load balancers

#### Using AWS App Runner

1. **Create app.yaml for backend**
   ```yaml
   version: 1.0
   runtime: docker
   build:
     commands:
       build:
         - echo "Building backend"
   run:
     runtime-version: 18
     command: npm start
     network:
       port: 3001
       env: PORT
     env:
       - name: NODE_ENV
         value: production
   ```

2. **Deploy services**
   ```bash
   aws apprunner create-service --cli-input-json file://backend-app.json
   ```

### Google Cloud Platform

#### Using Cloud Run

1. **Build and deploy backend**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/warranty-it-backend ./backend
   gcloud run deploy warranty-it-backend --image gcr.io/PROJECT-ID/warranty-it-backend --platform managed --region us-central1 --allow-unauthenticated
   ```

2. **Build and deploy frontend**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/warranty-it-frontend ./frontend
   gcloud run deploy warranty-it-frontend --image gcr.io/PROJECT-ID/warranty-it-frontend --platform managed --region us-central1 --allow-unauthenticated
   ```

3. **Set up Cloud SQL**
   - Create Cloud SQL PostgreSQL instance
   - Configure connection and update DATABASE_URL

### Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

1. **Connect repository to Vercel**
2. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set environment variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

#### Backend on Railway

1. **Connect repository to Railway**
2. **Set environment variables**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   NODE_ENV=production
   PORT=3001
   ```

3. **Deploy and get URL**

## 🔧 Manual Deployment

### Backend Deployment

1. **Server setup**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Application setup**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd WarrantyIt/backend
   
   # Install dependencies
   npm install --production
   
   # Set up environment
   cp env.example .env
   # Edit .env with production values
   
   # Set up database
   npx prisma migrate deploy
   npx prisma db seed
   
   # Build application
   npm run build
   ```

3. **Process management with PM2**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start application
   pm2 start dist/index.js --name "warranty-it-backend"
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

4. **Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Frontend Deployment

1. **Build application**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to web server**
   ```bash
   # Copy built files to web server
   scp -r dist/* user@server:/var/www/html/
   
   # Or use rsync
   rsync -avz dist/ user@server:/var/www/html/
   ```

3. **Configure web server (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;
       
       # Handle client-side routing
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

## 🔒 Security Considerations

### Environment Variables
- Use strong, unique JWT secrets
- Rotate secrets regularly
- Use environment-specific configurations
- Never commit secrets to version control

### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict database access by IP
- Regular backups
- Monitor for suspicious activity

### Application Security
- Enable HTTPS in production
- Set up proper CORS policies
- Implement rate limiting
- Use security headers
- Regular dependency updates
- Input validation and sanitization

### Infrastructure Security
- Use VPCs and security groups
- Enable logging and monitoring
- Set up alerts for anomalies
- Regular security audits
- Keep systems updated

## 📊 Monitoring and Logging

### Application Monitoring
- Set up health checks
- Monitor response times
- Track error rates
- Monitor database performance

### Logging
- Centralized logging with Winston
- Structured logging format
- Log rotation and retention
- Error tracking and alerting

### Recommended Tools
- **APM**: New Relic, DataDog, or AWS CloudWatch
- **Logging**: ELK Stack, Splunk, or CloudWatch Logs
- **Monitoring**: Prometheus + Grafana
- **Error Tracking**: Sentry or Bugsnag

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Your deployment commands here
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check DATABASE_URL format
   - Verify network connectivity
   - Check database credentials

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

3. **Runtime Errors**
   - Check environment variables
   - Verify file permissions
   - Check logs for detailed error messages

4. **Performance Issues**
   - Monitor database queries
   - Check memory usage
   - Optimize images and assets

### Health Checks

- Backend: `GET /health`
- Frontend: `GET /health` (if configured)
- Database: Connection test

### Log Locations

- Application logs: `backend/logs/`
- Nginx logs: `/var/log/nginx/`
- System logs: `/var/log/syslog`

---

For additional support, refer to the main README or create an issue in the repository.
