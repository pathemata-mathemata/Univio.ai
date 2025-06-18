import { supabaseAdmin } from '@/lib/supabase-server'
import { Database } from '@/lib/supabase'

// Type definitions for easier use - only for tables that exist in our current schema
type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

type EmailVerification = Database['public']['Tables']['email_verifications']['Row']
type EmailVerificationInsert = Database['public']['Tables']['email_verifications']['Insert']

type Institution = Database['public']['Tables']['institutions']['Row']
type Major = Database['public']['Tables']['majors']['Row']

type AcademicProfile = Database['public']['Tables']['academic_profiles']['Row']
type AcademicProfileInsert = Database['public']['Tables']['academic_profiles']['Insert']
type AcademicProfileUpdate = Database['public']['Tables']['academic_profiles']['Update']

type Course = Database['public']['Tables']['courses']['Row']
type CourseInsert = Database['public']['Tables']['courses']['Insert']

type UserCourse = Database['public']['Tables']['user_courses']['Row']
type UserCourseInsert = Database['public']['Tables']['user_courses']['Insert']
type UserCourseUpdate = Database['public']['Tables']['user_courses']['Update']

// Additional types for tables that exist in the schema
type AIPlanningSession = Database['public']['Tables']['ai_planning_sessions']['Row']
type AIPlanningSessionInsert = Database['public']['Tables']['ai_planning_sessions']['Insert']

type DashboardMetrics = Database['public']['Tables']['dashboard_metrics']['Row']
type DashboardMetricsInsert = Database['public']['Tables']['dashboard_metrics']['Insert']

type UserActivityLog = Database['public']['Tables']['user_activity_log']['Row']
type UserActivityLogInsert = Database['public']['Tables']['user_activity_log']['Insert']

export class DatabaseService {
  // ===== USER OPERATIONS =====
  
  /**
   * Create a new user
   */
  static async createUser(userData: UserInsert): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error creating user:', error)
        return { user: null, error: error.message }
      }

      console.log('✅ User created successfully:', data.id)
      return { user: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error creating user:', error)
      return { user: null, error: 'Failed to create user' }
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Database error getting user by email:', error)
        return { user: null, error: error.message }
      }

      return { user: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting user by email:', error)
      return { user: null, error: 'Failed to get user' }
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Database error getting user by ID:', error)
        return { user: null, error: error.message }
      }

      return { user: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting user by ID:', error)
      return { user: null, error: 'Failed to get user' }
    }
  }

  /**
   * Update user
   */
  static async updateUser(userId: string, updates: UserUpdate): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error updating user:', error)
        return { user: null, error: error.message }
      }

      return { user: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error updating user:', error)
      return { user: null, error: 'Failed to update user' }
    }
  }

  // ===== EMAIL VERIFICATION OPERATIONS =====

  /**
   * Store email verification code with proper rate limiting
   * Rate limits: Max 2 codes in 30 seconds, Max 5 codes per hour
   */
  static async storeVerificationCode(
    email: string, 
    code: string, 
    expiryMinutes: number
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const now = new Date()
      const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000)
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

      // Check rate limits
      const { data: recentCodes } = await supabaseAdmin
        .from('email_verifications')
        .select('created_at')
        .eq('email', email)
        .gte('created_at', thirtySecondsAgo.toISOString())
        .order('created_at', { ascending: false })

      const { data: hourlyCount } = await supabaseAdmin
        .from('email_verifications')
        .select('id', { count: 'exact' })
        .eq('email', email)
        .gte('created_at', oneHourAgo.toISOString())

      // Rate limit: Max 2 codes in 30 seconds
      if (recentCodes && recentCodes.length >= 2) {
        return { 
          success: false, 
          error: 'Too many requests. Please wait 30 seconds before requesting another code.' 
        }
      }

      // Rate limit: Max 5 codes per hour
      if (hourlyCount && hourlyCount.length >= 5) {
        return { 
          success: false, 
          error: 'Hourly limit reached. Please wait before requesting more verification codes.' 
        }
      }

      // Clean up expired codes for this email
      await supabaseAdmin
        .from('email_verifications')
        .delete()
        .eq('email', email)
        .lt('expires_at', now.toISOString())

      // Create new verification code
      const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString()
      
      const { error } = await supabaseAdmin
        .from('email_verifications')
        .insert({
          email,
          code,
          expires_at: expiresAt,
          attempts: 0,
          verified: false
        })

      if (error) {
        console.error('❌ Database error storing verification code:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Verification code stored successfully')
      return { success: true, error: null }
    } catch (error) {
      console.error('❌ Unexpected error storing verification code:', error)
      return { success: false, error: 'Failed to store verification code' }
    }
  }

  /**
   * Verify email code
   */
  static async verifyEmailCode(email: string, code: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: verification, error: fetchError } = await supabaseAdmin
        .from('email_verifications')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .single()

      if (fetchError || !verification) {
        return { success: false, error: 'Invalid verification code' }
      }

      // Check if code has expired
      if (new Date(verification.expires_at) < new Date()) {
        // Clean up expired code
        await supabaseAdmin
          .from('email_verifications')
          .delete()
          .eq('id', verification.id)
        
        return { success: false, error: 'Verification code has expired' }
      }

      // Check attempts
      if (verification.attempts >= 3) {
        return { success: false, error: 'Too many verification attempts' }
      }

      // Mark as verified and clean up
      await supabaseAdmin
        .from('email_verifications')
        .update({ verified: true })
        .eq('id', verification.id)

      // Clean up the verification record
      await supabaseAdmin
        .from('email_verifications')
        .delete()
        .eq('id', verification.id)

      console.log('✅ Email verification successful')
      return { success: true, error: null }
    } catch (error) {
      console.error('❌ Unexpected error verifying email code:', error)
      return { success: false, error: 'Failed to verify code' }
    }
  }

  // ===== INSTITUTION & MAJOR OPERATIONS =====

  /**
   * Get all institutions
   */
  static async getInstitutions(): Promise<{ institutions: Institution[]; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('institutions')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('❌ Database error getting institutions:', error)
        return { institutions: [], error: error.message }
      }

      return { institutions: data || [], error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting institutions:', error)
      return { institutions: [], error: 'Failed to get institutions' }
    }
  }

  /**
   * Get all majors
   */
  static async getMajors(): Promise<{ majors: Major[]; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('majors')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('❌ Database error getting majors:', error)
        return { majors: [], error: error.message }
      }

      return { majors: data || [], error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting majors:', error)
      return { majors: [], error: 'Failed to get majors' }
    }
  }

  /**
   * Find institution by name (fuzzy search)
   */
  static async findInstitutionByName(name: string): Promise<{ institution: Institution | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('institutions')
        .select('*')
        .or(`name.ilike.%${name}%,short_name.ilike.%${name}%,assist_org_name.ilike.%${name}%`)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Database error finding institution:', error)
        return { institution: null, error: error.message }
      }

      return { institution: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error finding institution:', error)
      return { institution: null, error: 'Failed to find institution' }
    }
  }

  /**
   * Find major by name (fuzzy search)
   */
  static async findMajorByName(name: string): Promise<{ major: Major | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('majors')
        .select('*')
        .ilike('name', `%${name}%`)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Database error finding major:', error)
        return { major: null, error: error.message }
      }

      return { major: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error finding major:', error)
      return { major: null, error: 'Failed to find major' }
    }
  }

  // ===== ACADEMIC PROFILE OPERATIONS =====

  /**
   * Create or update academic profile
   */
  static async upsertAcademicProfile(
    userId: string, 
    profileData: Omit<AcademicProfileInsert, 'user_id'>
  ): Promise<{ profile: AcademicProfile | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('academic_profiles')
        .upsert({ 
          user_id: userId, 
          ...profileData,
          last_updated_by_user: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Database error upserting academic profile:', error)
        return { profile: null, error: error.message }
      }

      console.log('✅ Academic profile upserted successfully')
      return { profile: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error upserting academic profile:', error)
      return { profile: null, error: 'Failed to save academic profile' }
    }
  }

  /**
   * Get academic profile by user ID
   */
  static async getAcademicProfile(userId: string): Promise<{ profile: AcademicProfile | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('academic_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Database error getting academic profile:', error)
        return { profile: null, error: error.message }
      }

      return { profile: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting academic profile:', error)
      return { profile: null, error: 'Failed to get academic profile' }
    }
  }

  // ===== COURSE CATALOG OPERATIONS =====

  /**
   * Add course to catalog
   */
  static async addCourse(courseData: CourseInsert): Promise<{ course: Course | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('courses')
        .insert(courseData)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error adding course:', error)
        return { course: null, error: error.message }
      }

      console.log('✅ Course added successfully:', data.course_code)
      return { course: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error adding course:', error)
      return { course: null, error: 'Failed to add course' }
    }
  }

  // ===== USER COURSE OPERATIONS =====

  /**
   * Add user course
   */
  static async addUserCourse(courseData: UserCourseInsert): Promise<{ course: UserCourse | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_courses')
        .insert(courseData)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error adding user course:', error)
        return { course: null, error: error.message }
      }

      console.log('✅ User course added successfully')
      return { course: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error adding user course:', error)
      return { course: null, error: 'Failed to add course' }
    }
  }

  /**
   * Get user courses
   */
  static async getUserCourses(userId: string): Promise<{ courses: UserCourse[]; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_courses')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: false })
        .order('semester')

      if (error) {
        console.error('❌ Database error getting user courses:', error)
        return { courses: [], error: error.message }
      }

      return { courses: data || [], error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting user courses:', error)
      return { courses: [], error: 'Failed to get courses' }
    }
  }

  /**
   * Update user course
   */
  static async updateUserCourse(
    courseId: string, 
    updates: UserCourseUpdate
  ): Promise<{ course: UserCourse | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_courses')
        .update(updates)
        .eq('id', courseId)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error updating user course:', error)
        return { course: null, error: error.message }
      }

      return { course: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error updating user course:', error)
      return { course: null, error: 'Failed to update course' }
    }
  }

  /**
   * Delete user course
   */
  static async deleteUserCourse(courseId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabaseAdmin
        .from('user_courses')
        .delete()
        .eq('id', courseId)

      if (error) {
        console.error('❌ Database error deleting user course:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ User course deleted successfully')
      return { success: true, error: null }
    } catch (error) {
      console.error('❌ Unexpected error deleting user course:', error)
      return { success: false, error: 'Failed to delete course' }
    }
  }

  // ===== AI PLANNING OPERATIONS =====

  /**
   * Create AI planning session
   */
  static async createAIPlanningSession(
    sessionData: AIPlanningSessionInsert
  ): Promise<{ session: AIPlanningSession | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_planning_sessions')
        .insert(sessionData)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error creating AI planning session:', error)
        return { session: null, error: error.message }
      }

      console.log('✅ AI planning session created successfully')
      return { session: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error creating AI planning session:', error)
      return { session: null, error: 'Failed to create planning session' }
    }
  }

  /**
   * Get user's AI planning sessions
   */
  static async getUserAIPlanningSessions(userId: string): Promise<{ sessions: AIPlanningSession[]; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_planning_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Database error getting AI planning sessions:', error)
        return { sessions: [], error: error.message }
      }

      return { sessions: data || [], error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting AI planning sessions:', error)
      return { sessions: [], error: 'Failed to get planning sessions' }
    }
  }

  // ===== DASHBOARD METRICS OPERATIONS =====

  /**
   * Update dashboard metrics for user
   */
  static async updateDashboardMetrics(
    userId: string, 
    metrics: Omit<DashboardMetricsInsert, 'user_id'>
  ): Promise<{ metrics: DashboardMetrics | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('dashboard_metrics')
        .upsert({ 
          user_id: userId, 
          ...metrics,
          calculated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Database error updating dashboard metrics:', error)
        return { metrics: null, error: error.message }
      }

      return { metrics: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error updating dashboard metrics:', error)
      return { metrics: null, error: 'Failed to update metrics' }
    }
  }

  /**
   * Get dashboard metrics for user
   */
  static async getDashboardMetrics(userId: string): Promise<{ metrics: DashboardMetrics | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('dashboard_metrics')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Database error getting dashboard metrics:', error)
        return { metrics: null, error: error.message }
      }

      return { metrics: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting dashboard metrics:', error)
      return { metrics: null, error: 'Failed to get metrics' }
    }
  }

  // ===== ACTIVITY LOGGING =====

  /**
   * Log user activity
   */
  static async logActivity(activityData: UserActivityLogInsert): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabaseAdmin
        .from('user_activity_log')
        .insert(activityData)

      if (error) {
        console.error('❌ Database error logging activity:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('❌ Unexpected error logging activity:', error)
      return { success: false, error: 'Failed to log activity' }
    }
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Calculate transfer progress for user
   */
  static async calculateTransferProgress(userId: string): Promise<{ progress: any; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .rpc('calculate_transfer_progress', { user_uuid: userId })

      if (error) {
        console.error('❌ Database error calculating transfer progress:', error)
        return { progress: null, error: error.message }
      }

      return { progress: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error calculating transfer progress:', error)
      return { progress: null, error: 'Failed to calculate progress' }
    }
  }

  /**
   * Clean up expired email verifications
   */
  static async cleanupExpiredVerifications(): Promise<{ deletedCount: number; error: string | null }> {
    try {
      // Simple delete query instead of stored procedure
      const { data, error } = await supabaseAdmin
        .from('email_verifications')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('id')

      if (error) {
        console.error('❌ Database error cleaning up verifications:', error)
        return { deletedCount: 0, error: error.message }
      }

      const deletedCount = data?.length || 0
      console.log(`✅ Cleaned up ${deletedCount} expired verification codes`)
      return { deletedCount, error: null }
    } catch (error) {
      console.error('❌ Unexpected error cleaning up verifications:', error)
      return { deletedCount: 0, error: 'Failed to cleanup verifications' }
    }
  }

  /**
   * Get user dashboard summary (using view)
   */
  static async getUserDashboardSummary(userId: string): Promise<{ summary: any; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_dashboard_summary')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Database error getting dashboard summary:', error)
        return { summary: null, error: error.message }
      }

      return { summary: data, error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting dashboard summary:', error)
      return { summary: null, error: 'Failed to get dashboard summary' }
    }
  }

  /**
   * Get user course summary by semester (using view)
   */
  static async getUserCourseSummary(userId: string): Promise<{ summary: any[]; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_course_summary')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: false })
        .order('semester')

      if (error) {
        console.error('❌ Database error getting course summary:', error)
        return { summary: [], error: error.message }
      }

      return { summary: data || [], error: null }
    } catch (error) {
      console.error('❌ Unexpected error getting course summary:', error)
      return { summary: [], error: 'Failed to get course summary' }
    }
  }
} 