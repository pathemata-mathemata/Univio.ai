import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Comprehensive database types for UniVio
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string | null
          first_name: string | null
          last_name: string | null
          edu_email: string | null
          edu_email_verified: boolean
          edu_email_verified_at: string | null
          is_active: boolean
          is_verified: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash?: string | null
          first_name?: string | null
          last_name?: string | null
          edu_email?: string | null
          edu_email_verified?: boolean
          edu_email_verified_at?: string | null
          is_active?: boolean
          is_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string | null
          first_name?: string | null
          last_name?: string | null
          edu_email?: string | null
          edu_email_verified?: boolean
          edu_email_verified_at?: string | null
          is_active?: boolean
          is_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      email_verifications: {
        Row: {
          id: string
          email: string
          code: string
          expires_at: string
          attempts: number
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          code: string
          expires_at: string
          attempts?: number
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          code?: string
          expires_at?: string
          attempts?: number
          verified?: boolean
          created_at?: string
        }
      }
      institutions: {
        Row: {
          id: string
          name: string
          short_name: string | null
          type: string
          system_name: string | null
          state: string | null
          city: string | null
          website_url: string | null
          assist_org_name: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          type: string
          system_name?: string | null
          state?: string | null
          city?: string | null
          website_url?: string | null
          assist_org_name?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          type?: string
          system_name?: string | null
          state?: string | null
          city?: string | null
          website_url?: string | null
          assist_org_name?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      majors: {
        Row: {
          id: string
          name: string
          category: string | null
          description: string | null
          typical_units: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          description?: string | null
          typical_units?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          description?: string | null
          typical_units?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      academic_profiles: {
        Row: {
          id: string
          user_id: string
          current_institution_id: string | null
          current_institution_name: string | null
          current_major_id: string | null
          current_major_name: string | null
          current_gpa: number | null
          current_quarter: string | null
          current_year: number | null
          target_institution_id: string | null
          target_institution_name: string | null
          target_major_id: string | null
          target_major_name: string | null
          expected_transfer_year: number | null
          expected_transfer_quarter: string | null
          max_units_per_quarter: number
          preferred_study_intensity: string
          is_complete: boolean
          last_updated_by_user: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_institution_id?: string | null
          current_institution_name?: string | null
          current_major_id?: string | null
          current_major_name?: string | null
          current_gpa?: number | null
          current_quarter?: string | null
          current_year?: number | null
          target_institution_id?: string | null
          target_institution_name?: string | null
          target_major_id?: string | null
          target_major_name?: string | null
          expected_transfer_year?: number | null
          expected_transfer_quarter?: string | null
          max_units_per_quarter?: number
          preferred_study_intensity?: string
          is_complete?: boolean
          last_updated_by_user?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_institution_id?: string | null
          current_institution_name?: string | null
          current_major_id?: string | null
          current_major_name?: string | null
          current_gpa?: number | null
          current_quarter?: string | null
          current_year?: number | null
          target_institution_id?: string | null
          target_institution_name?: string | null
          target_major_id?: string | null
          target_major_name?: string | null
          expected_transfer_year?: number | null
          expected_transfer_quarter?: string | null
          max_units_per_quarter?: number
          preferred_study_intensity?: string
          is_complete?: boolean
          last_updated_by_user?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          course_code: string
          course_name: string
          description: string | null
          units: number
          institution_id: string | null
          institution_name: string | null
          category: string | null
          subject_area: string | null
          prerequisites: any
          corequisites: any
          transferable: boolean
          repeatable: boolean
          is_active: boolean
          typical_quarters: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_code: string
          course_name: string
          description?: string | null
          units: number
          institution_id?: string | null
          institution_name?: string | null
          category?: string | null
          subject_area?: string | null
          prerequisites?: any
          corequisites?: any
          transferable?: boolean
          repeatable?: boolean
          is_active?: boolean
          typical_quarters?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_code?: string
          course_name?: string
          description?: string | null
          units?: number
          institution_id?: string | null
          institution_name?: string | null
          category?: string | null
          subject_area?: string | null
          prerequisites?: any
          corequisites?: any
          transferable?: boolean
          repeatable?: boolean
          is_active?: boolean
          typical_quarters?: any
          created_at?: string
          updated_at?: string
        }
      }
      user_courses: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          course_code: string
          course_name: string
          units: number
          institution_name: string | null
          grade: string | null
          grade_points: number | null
          semester: string
          year: number
          status: string
          transfer_status: string | null
          is_transfer_requirement: boolean
          requirement_category: string | null
          ai_recommended: boolean
          ai_reasoning: string | null
          priority_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          course_code: string
          course_name: string
          units: number
          institution_name?: string | null
          grade?: string | null
          grade_points?: number | null
          semester: string
          year: number
          status?: string
          transfer_status?: string | null
          is_transfer_requirement?: boolean
          requirement_category?: string | null
          ai_recommended?: boolean
          ai_reasoning?: string | null
          priority_level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          course_code?: string
          course_name?: string
          units?: number
          institution_name?: string | null
          grade?: string | null
          grade_points?: number | null
          semester?: string
          year?: number
          status?: string
          transfer_status?: string | null
          is_transfer_requirement?: boolean
          requirement_category?: string | null
          ai_recommended?: boolean
          ai_reasoning?: string | null
          priority_level?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transfer_requirements: {
        Row: {
          id: string
          source_institution_id: string | null
          target_institution_id: string | null
          major_id: string | null
          academic_year: string | null
          category: string
          subcategory: string | null
          description: string
          required_units: number | null
          required_courses: any
          alternative_courses: any
          is_mandatory: boolean
          completion_type: string
          minimum_grade: string | null
          source: string
          last_scraped_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source_institution_id?: string | null
          target_institution_id?: string | null
          major_id?: string | null
          academic_year?: string | null
          category: string
          subcategory?: string | null
          description: string
          required_units?: number | null
          required_courses?: any
          alternative_courses?: any
          is_mandatory?: boolean
          completion_type?: string
          minimum_grade?: string | null
          source?: string
          last_scraped_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_institution_id?: string | null
          target_institution_id?: string | null
          major_id?: string | null
          academic_year?: string | null
          category?: string
          subcategory?: string | null
          description?: string
          required_units?: number | null
          required_courses?: any
          alternative_courses?: any
          is_mandatory?: boolean
          completion_type?: string
          minimum_grade?: string | null
          source?: string
          last_scraped_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_transfer_progress: {
        Row: {
          id: string
          user_id: string
          transfer_requirement_id: string
          status: string
          completed_units: number
          completed_courses: any
          planned_courses: any
          completion_percentage: number
          estimated_completion_quarter: string | null
          estimated_completion_year: number | null
          last_analyzed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          transfer_requirement_id: string
          status?: string
          completed_units?: number
          completed_courses?: any
          planned_courses?: any
          completion_percentage?: number
          estimated_completion_quarter?: string | null
          estimated_completion_year?: number | null
          last_analyzed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transfer_requirement_id?: string
          status?: string
          completed_units?: number
          completed_courses?: any
          planned_courses?: any
          completion_percentage?: number
          estimated_completion_quarter?: string | null
          estimated_completion_year?: number | null
          last_analyzed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_planning_sessions: {
        Row: {
          id: string
          user_id: string
          planning_quarter: string
          planning_year: number
          target_units: number | null
          max_units_constraint: number | null
          ai_model_version: string | null
          analysis_data: any | null
          confidence_score: number | null
          recommended_courses: any | null
          warnings: any
          alternatives: any
          status: string
          user_feedback: string | null
          generation_time_ms: number | null
          api_calls_made: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          planning_quarter: string
          planning_year: number
          target_units?: number | null
          max_units_constraint?: number | null
          ai_model_version?: string | null
          analysis_data?: any | null
          confidence_score?: number | null
          recommended_courses?: any | null
          warnings?: any
          alternatives?: any
          status?: string
          user_feedback?: string | null
          generation_time_ms?: number | null
          api_calls_made?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          planning_quarter?: string
          planning_year?: number
          target_units?: number | null
          max_units_constraint?: number | null
          ai_model_version?: string | null
          analysis_data?: any | null
          confidence_score?: number | null
          recommended_courses?: any | null
          warnings?: any
          alternatives?: any
          status?: string
          user_feedback?: string | null
          generation_time_ms?: number | null
          api_calls_made?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_recommendations: {
        Row: {
          id: string
          planning_session_id: string
          user_id: string
          course_code: string
          course_name: string
          units: number
          institution_name: string | null
          reasoning: string
          priority_score: number | null
          confidence_score: number | null
          category: string | null
          recommended_quarter: string | null
          recommended_year: number | null
          prerequisites_met: boolean
          user_action: string | null
          user_feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          planning_session_id: string
          user_id: string
          course_code: string
          course_name: string
          units: number
          institution_name?: string | null
          reasoning: string
          priority_score?: number | null
          confidence_score?: number | null
          category?: string | null
          recommended_quarter?: string | null
          recommended_year?: number | null
          prerequisites_met?: boolean
          user_action?: string | null
          user_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          planning_session_id?: string
          user_id?: string
          course_code?: string
          course_name?: string
          units?: number
          institution_name?: string | null
          reasoning?: string
          priority_score?: number | null
          confidence_score?: number | null
          category?: string | null
          recommended_quarter?: string | null
          recommended_year?: number | null
          prerequisites_met?: boolean
          user_action?: string | null
          user_feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_activity_log: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          activity_category: string | null
          description: string | null
          metadata: any
          ip_address: string | null
          user_agent: string | null
          duration_ms: number | null
          success: boolean
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          activity_category?: string | null
          description?: string | null
          metadata?: any
          ip_address?: string | null
          user_agent?: string | null
          duration_ms?: number | null
          success?: boolean
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          activity_category?: string | null
          description?: string | null
          metadata?: any
          ip_address?: string | null
          user_agent?: string | null
          duration_ms?: number | null
          success?: boolean
          error_message?: string | null
          created_at?: string
        }
      }
      dashboard_metrics: {
        Row: {
          id: string
          user_id: string
          overall_progress_percentage: number
          completed_units: number
          remaining_units: number
          quarters_until_transfer: number | null
          total_courses_completed: number
          total_courses_planned: number
          current_quarter_units: number
          cumulative_gpa: number | null
          transfer_readiness_score: number | null
          requirements_completed: number
          requirements_total: number
          on_track_for_transfer: boolean
          last_planning_session: string | null
          total_planning_sessions: number
          days_since_last_activity: number
          calculated_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          overall_progress_percentage?: number
          completed_units?: number
          remaining_units?: number
          quarters_until_transfer?: number | null
          total_courses_completed?: number
          total_courses_planned?: number
          current_quarter_units?: number
          cumulative_gpa?: number | null
          transfer_readiness_score?: number | null
          requirements_completed?: number
          requirements_total?: number
          on_track_for_transfer?: boolean
          last_planning_session?: string | null
          total_planning_sessions?: number
          days_since_last_activity?: number
          calculated_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          overall_progress_percentage?: number
          completed_units?: number
          remaining_units?: number
          quarters_until_transfer?: number | null
          total_courses_completed?: number
          total_courses_planned?: number
          current_quarter_units?: number
          cumulative_gpa?: number | null
          transfer_readiness_score?: number | null
          requirements_completed?: number
          requirements_total?: number
          on_track_for_transfer?: boolean
          last_planning_session?: string | null
          total_planning_sessions?: number
          days_since_last_activity?: number
          calculated_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string | null
          setting_type: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: string | null
          setting_type?: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string | null
          setting_type?: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      user_dashboard_summary: {
        Row: {
          user_id: string
          first_name: string | null
          last_name: string | null
          email: string
          current_institution_name: string | null
          target_institution_name: string | null
          current_major_name: string | null
          target_major_name: string | null
          expected_transfer_year: number | null
          expected_transfer_quarter: string | null
          overall_progress_percentage: number | null
          completed_units: number | null
          remaining_units: number | null
          quarters_until_transfer: number | null
          transfer_readiness_score: number | null
          on_track_for_transfer: boolean | null
          last_planning_session: string | null
        }
      }
      user_course_summary: {
        Row: {
          user_id: string
          semester: string
          year: number
          total_courses: number
          total_units: number
          completed_courses: number
          planned_courses: number
          semester_gpa: number | null
        }
      }
    }
    Functions: {
      calculate_transfer_progress: {
        Args: { user_uuid: string }
        Returns: any
      }
      cleanup_expired_verifications: {
        Args: {}
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 