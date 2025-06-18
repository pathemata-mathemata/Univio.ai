import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { DatabaseService } from '@/services/databaseService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔧 Fixing user account for:', email);

    // Step 1: Get the user from Supabase Auth
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError);
      return NextResponse.json(
        { error: 'Failed to check user status' },
        { status: 500 }
      );
    }

    const authUser = users.find((user: any) => user.email?.toLowerCase() === email.toLowerCase());
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'User not found in authentication system' },
        { status: 404 }
      );
    }

    console.log('✅ Found auth user:', authUser.id);

    // Step 2: Confirm the user's email if not already confirmed
    if (!authUser.email_confirmed_at) {
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
        authUser.id,
        { email_confirm: true }
      );

      if (confirmError) {
        console.error('❌ Error confirming email:', confirmError);
      } else {
        console.log('✅ Email confirmed for user');
      }
    }

    // Step 3: Create or update user in custom users table
    const { user: existingCustomUser } = await DatabaseService.getUserById(authUser.id);
    
    if (!existingCustomUser) {
      // Create the user in custom table
      const { user: newCustomUser, error: createError } = await DatabaseService.createUser({
        id: authUser.id,
        email: authUser.email || '',
        first_name: authUser.user_metadata?.first_name || authUser.user_metadata?.firstName || 'User',
        last_name: authUser.user_metadata?.last_name || authUser.user_metadata?.lastName || '',
        edu_email: authUser.user_metadata?.edu_email,
        edu_email_verified: false,
        created_at: authUser.created_at,
        updated_at: new Date().toISOString()
      });

      if (createError) {
        console.warn('⚠️ Custom user creation error:', createError);
      } else {
        console.log('✅ Custom user created:', newCustomUser?.id);
      }
    } else {
      console.log('✅ Custom user already exists:', existingCustomUser.id);
    }

    // Step 4: Create academic profile if data exists
    const metadata = authUser.user_metadata;
    if (metadata?.current_institution && metadata?.current_major) {
      try {
                 const { profile, error: profileError } = await DatabaseService.upsertAcademicProfile(
           authUser.id,
           {
             current_institution_name: metadata.current_institution,
             current_major_name: metadata.current_major,
             current_gpa: parseFloat(metadata.current_gpa) || null,
             expected_transfer_year: parseInt(metadata.expected_transfer_year) || null,
             expected_transfer_quarter: metadata.expected_transfer_quarter,
             target_institution_name: metadata.target_institution,
             target_major_name: metadata.target_major,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
           }
         );

        if (profileError) {
          console.warn('⚠️ Academic profile error:', profileError);
        } else {
          console.log('✅ Academic profile created/updated');
        }
      } catch (error) {
        console.warn('⚠️ Academic profile creation failed:', error);
      }
    }

    // Step 5: Initialize dashboard metrics
    try {
      const { metrics, error: metricsError } = await DatabaseService.updateDashboardMetrics(
        authUser.id,
        {
          completed_units: 0,
          remaining_units: 120, // Default assumption
          total_courses_completed: 0,
          total_courses_planned: 0,
          current_quarter_units: 0,
          cumulative_gpa: parseFloat(metadata?.current_gpa) || 0,
          transfer_readiness_score: 0,
          requirements_completed: 0,
          requirements_total: 0,
          on_track_for_transfer: false,
          total_planning_sessions: 0,
          days_since_last_activity: 0,
          calculated_at: new Date().toISOString()
        }
      );

      if (metricsError) {
        console.warn('⚠️ Dashboard metrics error:', metricsError);
      } else {
        console.log('✅ Dashboard metrics initialized');
      }
    } catch (error) {
      console.warn('⚠️ Dashboard metrics initialization failed:', error);
    }

    console.log('🎉 User account fixed successfully');

    return NextResponse.json({
      success: true,
      message: 'User account has been fixed. You can now sign in.',
      user: {
        id: authUser.id,
        email: authUser.email,
        emailConfirmed: true,
        firstName: authUser.user_metadata?.first_name || authUser.user_metadata?.firstName || 'User',
        lastName: authUser.user_metadata?.last_name || authUser.user_metadata?.lastName || ''
      }
    });

  } catch (error) {
    console.error('❌ Fix user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 