import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Environment variables validated

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  throw new Error('Missing Supabase configuration');
}

export async function GET(request: NextRequest) {
  try {
    // Get the session token from the request
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '') || '';

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Create Supabase client with user session
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      global: {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    });

    // Verify the session token
    const { data: { user }, error: userError } = await supabase.auth.getUser(sessionToken);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

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

    // Get academic profile using RLS
    const { data: academicProfile, error: academicError } = await supabase
      .from('academic_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Academic profile error is not critical - user might not have one yet  
    if (academicError && academicError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.warn('⚠️ Academic profile fetch warning:', academicError.message);
    }

    // Return profile data in ApiResponse format
    const profileData = {
      user: userData,
      academic_profile: academicProfile || null
    };

    return NextResponse.json({
      data: profileData,
      success: true
    });

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
    // Get the session token from the request
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '') || '';

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Create Supabase client with user session
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      global: {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    });

    // Verify the session token
    const { data: { user }, error: userError } = await supabase.auth.getUser(sessionToken);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the request body
    const updateData = await request.json();

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
          target_major_name: updateData.current_major, // Use current major as target for now
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
          target_major_name: updateData.current_major, // Use current major as target for now
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

    // Return success response in ApiResponse format
    return NextResponse.json({
      data: {
        success: true,
        message: 'Profile updated successfully',
        academic_profile: academicProfileData
      },
      success: true
    });

  } catch (error) {
    console.error('❌ Profile update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 