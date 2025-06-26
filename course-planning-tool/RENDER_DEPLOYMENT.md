# Render Deployment Guide

This guide explains how to deploy the UniVio Course Planning Tool on Render.

## 🚀 Quick Deploy to Render

### Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Supabase Project**: Set up your Supabase database and storage

### Step 1: Deploy Backend (FastAPI)

1. **Connect Repository**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Backend Service**
   ```
   Name: univio-backend
   Environment: Docker
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: course-planning-tool/backend
   ```

3. **Environment Variables**
   ```
   DATABASE_URL=your_supabase_postgres_url
   SECRET_KEY=your_32_character_secret_key
   CORS_ORIGINS=https://your-frontend-url.onrender.com
   ENVIRONMENT=production
   CHROME_OPTIONS=--headless --no-sandbox --disable-dev-shm-usage
   ```

### Step 2: Deploy Frontend (Next.js)

1. **Create Frontend Service**
   - Click "New +" → "Web Service"
   - Connect same GitHub repository

2. **Configure Frontend Service**
   ```
   Name: univio-frontend
   Environment: Docker
   Region: Same as backend
   Branch: main
   Root Directory: course-planning-tool/frontend
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_ABSTRACT_API_KEY=your_abstract_api_key
   ```

### Step 3: Configure Supabase Storage

1. **Create Storage Bucket**
   - Go to Supabase Dashboard → Storage
   - Create bucket named `user-uploads`
   - Make it **public**

2. **Set Storage Policies**
   Run these SQL commands in Supabase SQL Editor:

   ```sql
   -- Allow users to upload their own files
   CREATE POLICY "Users can upload their own files" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'user-uploads' 
     AND auth.uid()::text = (storage.foldername(name))[1]
   );

   -- Allow anyone to view files (for public profile photos)
   CREATE POLICY "Anyone can view files" ON storage.objects
   FOR SELECT USING (bucket_id = 'user-uploads');

   -- Allow users to update their own files
   CREATE POLICY "Users can update their own files" ON storage.objects
   FOR UPDATE USING (
     bucket_id = 'user-uploads' 
     AND auth.uid()::text = (storage.foldername(name))[1]
   );

   -- Allow users to delete their own files
   CREATE POLICY "Users can delete their own files" ON storage.objects
   FOR DELETE USING (
     bucket_id = 'user-uploads' 
     AND auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

### Step 4: Update CORS Origins

Once deployed, update your backend environment variables:

```
CORS_ORIGINS=https://your-frontend-url.onrender.com
```

### Step 5: Test Deployment

1. **Health Checks**
   - Backend: `https://your-backend-url.onrender.com/health`
   - Frontend: `https://your-frontend-url.onrender.com/api/health`

2. **Test Features**
   - User registration/login
   - Profile photo upload
   - Email verification
   - Course planning

## 🔧 Configuration Details

### Docker Configuration

Both services use Docker for deployment:
- **Backend**: FastAPI with Chrome/Selenium for web scraping
- **Frontend**: Next.js with image optimization support

### Environment Variables Reference

| Variable | Service | Description |
|----------|---------|-------------|
| `DATABASE_URL` | Backend | Supabase PostgreSQL connection |
| `SECRET_KEY` | Backend | JWT signing key (32+ characters) |
| `CORS_ORIGINS` | Backend | Allowed frontend domains |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Frontend | Supabase admin key |
| `RESEND_API_KEY` | Frontend | Email service key |

### Performance Optimization

- **Image Compression**: Automatic client-side compression before upload
- **CDN**: Render provides built-in CDN
- **Caching**: Next.js optimizations enabled
- **Health Checks**: Automatic service monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Docker build logs
   - Verify all dependencies in package.json
   - Ensure environment variables are set

2. **CORS Errors**
   - Update `CORS_ORIGINS` with correct frontend URL
   - Ensure both HTTP and HTTPS if needed

3. **Database Connection**
   - Verify Supabase connection string
   - Check firewall settings
   - Test connection from backend logs

4. **File Upload Issues**
   - Verify Supabase storage bucket is public
   - Check storage policies are correctly set
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set

### Monitoring

- **Render Dashboard**: Service status and logs
- **Supabase Dashboard**: Database and storage metrics
- **Application Logs**: Available in Render console

## 🎉 Success!

Your UniVio Course Planning Tool is now deployed on Render with:
- ✅ Automatic deployments from GitHub
- ✅ Profile photo upload with compression
- ✅ Email verification system
- ✅ Course planning and transfer analysis
- ✅ Scalable cloud infrastructure 