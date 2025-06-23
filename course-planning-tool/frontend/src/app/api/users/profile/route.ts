import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;

console.log('🔧 Environment variables check:', {
  SUPABASE_URL: !!process.env.SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  finalSupabaseUrl: !!supabaseUrl,
  finalAnonKey: !!supabaseAnonKey
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Profile API - GET request started');
    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      supabaseUrlLength: supabaseUrl?.length || 0
    });

    // Get the session token from the request
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '') || '';

    console.log('🔧 Auth check:', {
      hasAuthHeader: !!authHeader,
      hasSessionToken: !!sessionToken,
      tokenLength: sessionToken?.length || 0
    });

    if (!sessionToken) {
      console.log('❌ No session token provided');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Create Supabase client with user session
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    });

    // Verify the session token
    console.log('🔧 Verifying session token...');
    const { data: { user }, error: userError } = await supabase.auth.getUser(sessionToken);
    
    console.log('🔧 User verification result:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: userError?.message
    });
    
    if (userError || !user) {
      console.log('❌ User verification failed:', userError?.message);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('✅ User verified successfully:', user.email);

    // Instead of querying custom 'users' table, use auth user data directly
    const userData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      edu_email: user.user_metadata?.edu_email,
      edu_email_verified: user.user_metadata?.edu_email_verified || false,
      is_verified: user.email_confirmed_at ? true : false,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    console.log('🔧 User data prepared:', userData);

    // Get academic profile using RLS
    console.log('🔧 Fetching academic profile for user:', user.id);
    const { data: academicProfile, error: academicError } = await supabase
      .from('academic_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    console.log('🔧 Academic profile result:', {
      hasProfile: !!academicProfile,
      error: academicError?.message,
      profileData: academicProfile
    });

    // Academic profile error is not critical - user might not have one yet  
    if (academicError && academicError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.warn('⚠️ Academic profile fetch warning:', academicError.message);
    }

    // Return profile data
    const profileData = {
      user: userData,
      academic_profile: academicProfile || null
    };

    console.log('✅ Profile data ready to return');
    return NextResponse.json(profileData);

  } catch (error) {
    console.error('❌ Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 Profile UPDATE - PUT request started');
    
    // Get the session token from the request
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '') || '';

    if (!sessionToken) {
      console.log('❌ No session token in PUT request');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Create Supabase client with user session
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    });

    // Verify the session token
    console.log('🔧 Verifying session token for PUT...');
    const { data: { user }, error: userError } = await supabase.auth.getUser(sessionToken);
    
    if (userError || !user) {
      console.log('❌ User verification failed in PUT:', userError?.message);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('✅ User verified for PUT:', user.email);

    // Get the request body
    const updateData = await request.json();
    console.log('🔧 Update data received:', updateData);

    // Check if academic profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('academic_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let academicProfileData;
    
    if (existingProfile) {
      // Update existing profile using RLS
      const { data, error } = await supabase
        .from('academic_profiles')
        .update({
          current_institution_name: updateData.current_institution,
          current_major_name: updateData.current_major,
          target_institution_name: updateData.target_institution,
          expected_transfer_year: updateData.expected_transfer_year,
          expected_transfer_quarter: updateData.expected_transfer_quarter,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Academic profile update error:', error);
        return NextResponse.json(
          { error: 'Failed to update academic profile' },
          { status: 500 }
        );
      }
      
      academicProfileData = data;
    } else {
      // Create new profile using RLS
      const { data, error } = await supabase
        .from('academic_profiles')
        .insert({
          user_id: user.id,
          current_institution_name: updateData.current_institution,
          current_major_name: updateData.current_major,
          target_institution_name: updateData.target_institution,
          expected_transfer_year: updateData.expected_transfer_year,
          expected_transfer_quarter: updateData.expected_transfer_quarter,
          is_complete: true,
          max_units_per_quarter: 16,
          preferred_study_intensity: 'moderate'
        })
        .select()
        .single();

      if (error) {
        console.error('Academic profile creation error:', error);
        return NextResponse.json(
          { error: 'Failed to create academic profile' },
          { status: 500 }
        );
      }
      
      academicProfileData = data;
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      academic_profile: academicProfileData
    });

  } catch (error) {
    console.error('❌ Profile update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 