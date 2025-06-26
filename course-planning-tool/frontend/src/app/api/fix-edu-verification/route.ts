import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, eduEmail } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔧 Fixing edu email verification status for:', email);

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
    console.log('📝 Current user metadata:', user.user_metadata);

    // Determine the edu email to mark as verified
    const eduEmailToVerify = eduEmail || user.user_metadata?.edu_email;
    
    if (!eduEmailToVerify) {
      return NextResponse.json(
        { error: 'No edu email found to verify. Please provide one.' },
        { status: 400 }
      );
    }

    // Update user metadata to mark edu email as verified
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          edu_email: eduEmailToVerify,
          edu_email_verified: true,
          edu_email_verified_at: new Date().toISOString()
        }
      }
    );

    if (updateError) {
      console.error('❌ Error updating user metadata:', updateError);
      return NextResponse.json(
        { error: 'Failed to update verification status' },
        { status: 500 }
      );
    }

    console.log(`✅ Edu email verification status fixed for ${eduEmailToVerify}`);

    return NextResponse.json({
      success: true,
      message: 'Edu email verification status has been fixed',
      eduEmail: eduEmailToVerify,
      user_id: user.id
    });

  } catch (error) {
    console.error('❌ Fix edu verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 