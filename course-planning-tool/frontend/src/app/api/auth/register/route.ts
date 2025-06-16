import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/services/databaseService';
import { EmailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      firstName, 
      lastName, 
      eduEmail, 
      university, 
      major, 
      graduationYear 
    } = await request.json();

    // Validate required fields
    if (!email || !firstName || !eduEmail) {
      return NextResponse.json(
        { error: 'Email, first name, and edu email are required' },
        { status: 400 }
      );
    }

    // Validate email formats
    if (!email.includes('@') || !eduEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate .edu email
    if (!eduEmail.toLowerCase().includes('.edu')) {
      return NextResponse.json(
        { error: 'Please use your college .edu email address' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { user: existingUser } = await DatabaseService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Check if edu email is already used
    const { user: existingEduUser } = await DatabaseService.getUserByEmail(eduEmail);
    if (existingEduUser) {
      return NextResponse.json(
        { error: 'This .edu email is already registered' },
        { status: 409 }
      );
    }

    // Create user in database
    const { user, error } = await DatabaseService.createUser({
      email,
      first_name: firstName,
      last_name: lastName,
      edu_email: eduEmail,
      edu_email_verified: false,
      university,
      major,
      graduation_year: graduationYear ? parseInt(graduationYear) : null
    });

    if (error || !user) {
      console.error('❌ Failed to create user:', error);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ User created successfully:', user.id);

    // Send welcome email (optional - don't fail registration if this fails)
    try {
      await EmailService.sendWelcomeEmail({
        to: email,
        firstName
      });
    } catch (emailError) {
      console.warn('⚠️ Failed to send welcome email:', emailError);
      // Don't fail the registration for email issues
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        eduEmail: user.edu_email,
        eduEmailVerified: user.edu_email_verified,
        university: user.university,
        major: user.major,
        graduationYear: user.graduation_year
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 