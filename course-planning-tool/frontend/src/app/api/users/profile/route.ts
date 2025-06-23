import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

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
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

    // Get user profile from Supabase using RLS (Row Level Security)
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userDataError) {
      console.error('User data fetch error:', userDataError);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Get academic profile using RLS
    const { data: academicProfile, error: academicError } = await supabase
      .from('academic_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Return profile data
    const profileData = {
      user: userData,
      academic_profile: academicProfile || null
    };

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
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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