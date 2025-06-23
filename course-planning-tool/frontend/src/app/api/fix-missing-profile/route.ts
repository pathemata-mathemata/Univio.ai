import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔧 Fixing missing profile for:', email);

    // Get the user from Supabase Auth
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError);
      return NextResponse.json(
        { error: 'Failed to find user' },
        { status: 500 }
      );
    }

    const user = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Found user:', user.id);
    console.log('📝 User metadata:', user.user_metadata);

    // Check if academic profile already exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('academic_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json({
        success: true,
        message: 'Academic profile already exists',
        profile_id: existingProfile.id
      });
    }

    // Create academic profile using data from user metadata
    const metadata = user.user_metadata || {};
    
    const profileData = {
      user_id: user.id,
      current_institution_name: metadata.current_institution || 'De Anza College',
      current_major_name: metadata.current_major || 'Computer Science',
      current_gpa: metadata.current_gpa ? parseFloat(metadata.current_gpa) : null,
      expected_transfer_year: metadata.expected_transfer_year ? parseInt(metadata.expected_transfer_year) : 2025,
      expected_transfer_quarter: metadata.expected_transfer_quarter || 'Fall',
      target_institution_name: metadata.target_institution || 'UC Berkeley',
      target_major_name: metadata.target_major || metadata.current_major || 'Computer Science',
      is_complete: true,
      max_units_per_quarter: 16,
      preferred_study_intensity: 'moderate',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('📝 Creating profile with data:', profileData);

    const { data: newProfile, error: insertError } = await supabaseAdmin
      .from('academic_profiles')
      .insert(profileData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating academic profile:', insertError);
      return NextResponse.json(
        { error: `Failed to create academic profile: ${insertError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ Academic profile created:', newProfile.id);

    return NextResponse.json({
      success: true,
      message: 'Academic profile created successfully',
      profile: newProfile
    });

  } catch (error) {
    console.error('❌ Error fixing profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 