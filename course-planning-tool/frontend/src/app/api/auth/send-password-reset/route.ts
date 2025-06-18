import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { EmailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if user exists in Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error checking user existence:', listError);
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset link shortly.'
      });
    }

    const userExists = users.some(user => user.email?.toLowerCase() === email.toLowerCase());
    
    if (!userExists) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset link shortly.'
      });
    }

    // Find user details for personalized email
    const user = users.find(user => user.email?.toLowerCase() === email.toLowerCase());
    const firstName = user?.user_metadata?.first_name || user?.user_metadata?.firstName;

    try {
      // Send Supabase password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/auth/reset-password`,
      });

      if (resetError) {
        console.error('❌ Supabase password reset error:', resetError);
        throw new Error('Failed to send password reset email');
      }

      console.log(`✅ Password reset email sent via Supabase to: ${email}`);

      // Optionally send a custom branded email as well
      // (Comment this out if you only want Supabase's default email)
      /*
      try {
        const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/auth/reset-password`;
        await EmailService.sendPasswordResetEmail({
          to: email,
          resetUrl,
          firstName
        });
        console.log(`✅ Custom password reset email also sent to: ${email}`);
      } catch (customEmailError) {
        console.warn('⚠️ Custom password reset email failed (Supabase email still sent):', customEmailError);
      }
      */

      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset link shortly.'
      });

    } catch (error) {
      console.error('❌ Password reset error:', error);
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Password reset request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 