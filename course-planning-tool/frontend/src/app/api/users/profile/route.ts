import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Create a server-side client factory without realtime
function createServerClient(accessToken?: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
    global: accessToken ? {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    } : undefined,
  });
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
    const supabase = createServerClient(sessionToken);

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
      bio: user.user_metadata?.bio || '',
      profile_photo: user.user_metadata?.profile_photo || '',
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
    const supabase = createServerClient(sessionToken);

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

    // Handle user metadata updates (name, bio, profile_photo)
    if (updateData.name || updateData.bio || updateData.profilePhoto) {
      const currentMetadata = user.user_metadata || {};
      const newMetadata = {
        ...currentMetadata,
        ...(updateData.name && { name: updateData.name, full_name: updateData.name }),
        ...(updateData.bio && { bio: updateData.bio }),
        ...(updateData.profilePhoto && { profile_photo: updateData.profilePhoto })
      };

      const { error: metadataError } = await supabase.auth.updateUser({
        data: newMetadata
      });

      if (metadataError) {
        console.error('User metadata update error:', metadataError);
        return NextResponse.json(
          { error: 'Failed to update profile information' },
          { status: 500 }
        );
      }
    }

    // Skip academic profile update if only user metadata is being updated
    if (!updateData.current_institution && !updateData.current_major && 
        !updateData.target_institution && !updateData.expected_transfer_year && 
        !updateData.expected_transfer_quarter) {
      
      // Return updated user data
      const updatedUserData = {
        id: user.id,
        email: user.email,
        name: updateData.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        bio: updateData.bio || user.user_metadata?.bio,
        profile_photo: updateData.profilePhoto || user.user_metadata?.profile_photo,
        edu_email: user.user_metadata?.edu_email,
        edu_email_verified: user.user_metadata?.edu_email_verified || false,
        is_verified: user.email_confirmed_at ? true : false,
        created_at: user.created_at,
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        data: {
          success: true,
          message: 'Profile updated successfully',
          user: updatedUserData
        },
        success: true
      });
    }

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