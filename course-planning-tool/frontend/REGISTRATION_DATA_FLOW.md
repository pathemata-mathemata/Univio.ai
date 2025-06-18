# Registration Data Flow - Multi-Step Storage

## 📋 **5-Step Registration Process**

### **Step 1: Educational Email (`EduEmailStep`)**
**Data Collected:**
- `eduEmail` - Student's educational email address  
- `eduEmailVerified` - Verification status

**Stored In:**
- `Supabase Auth metadata` - As edu_email, edu_email_verified
- `users.edu_email` - Educational email address
- `users.edu_email_verified` - Verification status  
- `email_verifications` - Verification record if verified

---

### **Step 2: Personal Email (`PersonalEmailStep`)**
**Data Collected:**
- `personalEmail` - Main account email
- `personalEmailVerified` - Verification status
- `password` - Account password

**Stored In:**
- `Supabase Auth` - Primary authentication (email/password)
- `users.email` - Personal email address
- `users.is_verified` - Personal email verification status
- `email_verifications` - Verification record if verified

---

### **Step 3: Personal Info (`PersonalInfoStep`)**
**Data Collected:**
- `firstName` - User's first name
- `lastName` - User's last name

**Stored In:**
- `Supabase Auth metadata` - As first_name, last_name
- `users.first_name` - First name
- `users.last_name` - Last name

---

### **Step 4: Academic Info (`AcademicInfoStep`)**
**Data Collected:**
- `currentInstitution` - Current college/university
- `currentMajor` - Current major/program
- `currentGPA` - Current GPA (0.0-4.0)
- `currentQuarter` - Current academic quarter/semester
- `currentYear` - Current academic year
- `expectedTransferYear` - Target transfer year
- `expectedTransferQuarter` - Target transfer quarter
- `targetInstitution` - Target university
- `targetMajor` - Target major/program

**Stored In:**
- `academic_profiles.current_institution_name` - Current school
- `academic_profiles.current_major_name` - Current major
- `academic_profiles.current_gpa` - Current GPA (parsed as float)
- `academic_profiles.current_quarter` - Current quarter
- `academic_profiles.current_year` - Current year (parsed as int)
- `academic_profiles.expected_transfer_year` - Transfer year
- `academic_profiles.expected_transfer_quarter` - Transfer quarter
- `academic_profiles.target_institution_name` - Target school
- `academic_profiles.target_major_name` - Target major
- `academic_profiles.is_complete` - Set to true
- `academic_profiles.max_units_per_quarter` - Default: 16
- `academic_profiles.preferred_study_intensity` - Default: 'moderate'

---

### **Step 5: Review & Submit (`ReviewStep`)**
**Additional Operations:**
- **Dashboard Metrics Initialization:**
  - `dashboard_metrics.overall_progress_percentage` - 0%
  - `dashboard_metrics.completed_units` - 0
  - `dashboard_metrics.remaining_units` - 60 (typical transfer requirement)
  - `dashboard_metrics.on_track_for_transfer` - true
  - And other progress tracking fields

- **Activity Logging:**
  - `user_activity_log` - Records registration completion with metadata

- **Session Management:**
  - `localStorage` - Stores Supabase session and access token

---

## 🗄️ **Database Tables Used**

| Table | Purpose | Key Data |
|-------|---------|----------|
| `Supabase Auth` | Authentication & session | email, password, metadata |
| `users` | Core user record | names, emails, verification status |
| `email_verifications` | Email verification tracking | verification codes & status |
| `academic_profiles` | Academic information | institutions, majors, GPA, timeline |
| `dashboard_metrics` | Progress tracking | units, percentages, readiness score |
| `user_activity_log` | Activity tracking | registration events & metadata |

---

## ✅ **Complete Registration Flow**

1. ✅ **Supabase Auth user creation** (email/password)
2. ✅ **Users table record** (personal info + verification status)  
3. ✅ **Email verification records** (for both emails if verified)
4. ✅ **Academic profile** (institution details, GPA, timeline)
5. ✅ **Dashboard metrics initialization** (progress tracking setup)
6. ✅ **Activity logging** (registration completion record)
7. ✅ **Session storage** (localStorage for frontend auth state)

All registration step data is now **comprehensively stored** across the appropriate database tables for full user profile creation! 🎉 