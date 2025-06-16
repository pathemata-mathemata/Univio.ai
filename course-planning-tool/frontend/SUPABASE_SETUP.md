# 🚀 UniVio Supabase Database Setup Guide

This guide will help you set up the complete Supabase database for your UniVio application with all the tables needed to track users, courses, transfer planning, AI recommendations, and analytics.

## 📋 Overview

The UniVio database schema includes:

### **Core Tables:**
- **users** - User accounts and authentication
- **email_verifications** - Email verification codes
- **institutions** - Colleges and universities
- **majors** - Academic majors/programs
- **academic_profiles** - User academic information and transfer goals

### **Course Management:**
- **courses** - Available courses catalog
- **user_courses** - Courses taken/planned by users
- **transfer_requirements** - Transfer requirements between institutions
- **user_transfer_progress** - User progress on transfer requirements

### **AI & Planning:**
- **ai_planning_sessions** - AI-generated course plans
- **ai_recommendations** - Individual course recommendations
- **user_activity_log** - User interaction tracking
- **dashboard_metrics** - Aggregated metrics for dashboard

### **System:**
- **system_settings** - Application configuration

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "**New Project**"
3. Choose your organization
4. Enter project details:
   - **Name**: `univio-production` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "**Create new project**"
6. Wait for the project to be created (2-3 minutes)

### 2. Get Your Supabase Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public key** (starts with `eyJ`)
   - **service_role key** (starts with `eyJ`) - **Keep this secret!**

### 3. Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Keep your existing variables
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_DOMAIN=univio.ai
```

### 4. Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "**New Query**"
3. Copy the entire contents of `supabase-schema.sql` and paste it
4. Click "**Run**" to execute the schema

You should see success messages indicating all tables, functions, and policies were created.

## 🔧 Schema Features

### **🔐 Row Level Security (RLS)**
- Users can only access their own data
- Public read access to reference tables (institutions, majors, courses)
- Service-level access for system operations

### **📊 Built-in Analytics**
- User activity logging
- Dashboard metrics calculation
- Transfer progress tracking
- AI recommendation tracking

### **🤖 AI Integration Ready**
- AI planning session storage
- Course recommendation tracking
- User feedback collection
- Performance metrics

### **🔍 Search Optimization**
- Full-text search on institutions and majors
- Fuzzy matching for course names
- Optimized indexes for common queries

### **⚡ Performance Features**
- Automatic timestamp updates
- Expired verification cleanup
- Composite indexes for fast queries
- Database views for complex queries

## 📊 Key Database Functions

### **calculate_transfer_progress(user_uuid)**
Calculates a user's transfer progress and updates dashboard metrics:

```sql
SELECT calculate_transfer_progress('user-uuid-here');
```

### **cleanup_expired_verifications()**
Removes expired email verification codes:

```sql
SELECT cleanup_expired_verifications();
```

## 🔄 Database Views

### **user_dashboard_summary**
Complete user dashboard data in one query:

```sql
SELECT * FROM user_dashboard_summary WHERE user_id = 'user-uuid';
```

### **user_course_summary**
Semester-by-semester course summary:

```sql
SELECT * FROM user_course_summary WHERE user_id = 'user-uuid';
```

## 📝 Using the Database Service

The `DatabaseService` class provides type-safe methods for all operations:

```typescript
import { DatabaseService } from '@/services/databaseService';

// Create user
const { user, error } = await DatabaseService.createUser({
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  edu_email: 'john@university.edu'
});

// Get institutions
const { institutions } = await DatabaseService.getInstitutions();

// Add user course
const { course } = await DatabaseService.addUserCourse({
  user_id: userId,
  course_code: 'MATH 1A',
  course_name: 'Calculus I',
  units: 4,
  semester: 'fall',
  year: 2024,
  status: 'completed',
  grade: 'A'
});

// Calculate transfer progress
const { progress } = await DatabaseService.calculateTransferProgress(userId);
```

## 🎯 Data Flow Examples

### **User Registration Flow:**
1. Create user in `users` table
2. Store verification code in `email_verifications`
3. Send verification email
4. Verify code and mark user as verified
5. Create `academic_profile` with transfer goals

### **Course Planning Flow:**
1. Get user's `academic_profile`
2. Fetch `transfer_requirements` for their path
3. Create `ai_planning_session` with recommendations
4. Store `ai_recommendations` for each course
5. User adds courses to `user_courses`
6. Update `user_transfer_progress`
7. Recalculate `dashboard_metrics`

### **Analytics Flow:**
1. Log user actions in `user_activity_log`
2. Update `dashboard_metrics` periodically
3. Track AI recommendation acceptance rates
4. Monitor transfer progress over time

## 🔧 Maintenance

### **Regular Cleanup (Recommended)**
Set up a cron job or scheduled function to:

```sql
-- Clean up expired verifications (run hourly)
SELECT cleanup_expired_verifications();

-- Update dashboard metrics (run daily)
SELECT calculate_transfer_progress(user_id) 
FROM users WHERE is_active = true;
```

### **Monitoring Queries**

```sql
-- Active users count
SELECT COUNT(*) FROM users WHERE is_active = true;

-- Recent registrations
SELECT COUNT(*) FROM users 
WHERE created_at > NOW() - INTERVAL '7 days';

-- AI planning sessions this week
SELECT COUNT(*) FROM ai_planning_sessions 
WHERE created_at > NOW() - INTERVAL '7 days';

-- Transfer progress distribution
SELECT 
  CASE 
    WHEN overall_progress_percentage < 25 THEN '0-25%'
    WHEN overall_progress_percentage < 50 THEN '25-50%'
    WHEN overall_progress_percentage < 75 THEN '50-75%'
    ELSE '75-100%'
  END as progress_range,
  COUNT(*) as user_count
FROM dashboard_metrics 
GROUP BY progress_range;
```

## 🚨 Security Notes

1. **Never expose service role key** in frontend code
2. **RLS policies** protect user data automatically
3. **Email verification** required before account activation
4. **Activity logging** tracks all user interactions
5. **Rate limiting** built into verification system

## 🎉 You're Ready!

Your UniVio database is now set up with:

✅ **14 tables** for complete data management  
✅ **Row Level Security** for data protection  
✅ **Built-in analytics** and progress tracking  
✅ **AI integration** ready  
✅ **Performance optimized** with indexes and views  
✅ **Type-safe** database service layer  

Your application can now:
- 👤 Manage user registration and authentication
- 🎓 Track academic profiles and transfer goals
- 📚 Store and manage course data
- 🤖 Generate and track AI recommendations
- 📊 Provide real-time dashboard analytics
- 🔍 Search institutions and majors efficiently
- 📈 Monitor user engagement and progress

## 🆘 Troubleshooting

### **Common Issues:**

**"relation does not exist" error:**
- Make sure you ran the complete schema SQL
- Check that all tables were created in the public schema

**"permission denied" error:**
- Verify your service role key is correct
- Check RLS policies are properly configured

**"function does not exist" error:**
- Ensure all functions were created successfully
- Check the Functions tab in Supabase dashboard

**Slow queries:**
- Verify indexes were created properly
- Check query plans in the SQL editor

### **Getting Help:**

1. Check Supabase logs in the dashboard
2. Use the SQL editor to test queries
3. Review RLS policies in the Authentication section
4. Monitor performance in the Database section

---

**🎯 Ready to build the future of transfer planning with UniVio!** 