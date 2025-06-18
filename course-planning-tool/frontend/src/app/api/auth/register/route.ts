import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { DatabaseService } from '@/services/databaseService';
import { EmailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json();
    
    const { 
      email, 
      personalEmail,
      password,
      firstName, 
      lastName, 
      eduEmail,
      phone,
      dateOfBirth,
      currentInstitution,
      currentMajor,
      currentGPA,
      expectedTransferYear,
      expectedTransferQuarter,
      targetInstitution,
      targetMajor
    } = registrationData;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('🚀 Starting registration process for:', email);

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email for now
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        personal_email: personalEmail,
        edu_email: eduEmail,
        phone: phone,
        date_of_birth: dateOfBirth,
        current_institution: currentInstitution,
        current_major: currentMajor,
        current_gpa: currentGPA,
        expected_transfer_year: expectedTransferYear,
        expected_transfer_quarter: expectedTransferQuarter,
        target_institution: targetInstitution,
        target_major: targetMajor
      }
    });

    if (authError) {
      console.error('❌ Supabase Auth error:', authError);
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    console.log('✅ Supabase Auth user created:', authData.user.id);

    // Step 2: Create user in custom users table
    try {
      const { user: customUser, error: customUserError } = await DatabaseService.createUser({
        id: authData.user.id, // Use the same UUID from Supabase Auth
        email: email,
        first_name: firstName,
        last_name: lastName,
        edu_email: eduEmail,
        edu_email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (customUserError) {
        console.warn('⚠️ Custom user table error (continuing anyway):', customUserError);
      } else {
        console.log('✅ Custom user created:', customUser?.id);
      }
    } catch (error) {
      console.warn('⚠️ Custom user creation failed (continuing anyway):', error);
    }

    // Step 3: Create academic profile
    if (currentInstitution && currentMajor) {
      try {
        const { profile, error: profileError } = await DatabaseService.upsertAcademicProfile(
          authData.user.id,
          {
            current_institution_name: currentInstitution,
            current_major_name: currentMajor,
            current_gpa: parseFloat(currentGPA) || null,
            expected_transfer_year: parseInt(expectedTransferYear) || null,
            expected_transfer_quarter: expectedTransferQuarter,
            target_institution_name: targetInstitution,
            target_major_name: targetMajor,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        );

        if (profileError) {
          console.warn('⚠️ Academic profile error (continuing anyway):', profileError);
        } else {
          console.log('✅ Academic profile created');
        }
      } catch (error) {
        console.warn('⚠️ Academic profile creation failed (continuing anyway):', error);
      }
    }

    // Step 4: Initialize dashboard metrics
    try {
      const { metrics, error: metricsError } = await DatabaseService.updateDashboardMetrics(
        authData.user.id,
        {
          completed_units: 0,
          remaining_units: 120, // Default assumption
          total_courses_completed: 0,
          total_courses_planned: 0,
          current_quarter_units: 0,
          cumulative_gpa: parseFloat(currentGPA) || 0,
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
        console.warn('⚠️ Dashboard metrics error (continuing anyway):', metricsError);
      } else {
        console.log('✅ Dashboard metrics initialized');
      }
    } catch (error) {
      console.warn('⚠️ Dashboard metrics initialization failed (continuing anyway):', error);
    }

    // Step 5: Send welcome email (optional)
    try {
      await EmailService.sendWelcomeEmail({
        to: email,
        firstName: firstName
      });
      console.log('✅ Welcome email sent');
    } catch (emailError) {
      console.warn('⚠️ Failed to send welcome email (continuing anyway):', emailError);
    }

    console.log('🎉 Registration completed successfully for:', email);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: firstName,
        lastName: lastName,
        emailConfirmed: authData.user.email_confirmed_at !== null
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
} 