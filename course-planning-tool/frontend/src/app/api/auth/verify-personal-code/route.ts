import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/services/databaseService';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { personalEmail, code } = await request.json();

    // Validate input
    if (!personalEmail || !code) {
      return NextResponse.json(
        { error: 'Personal email and verification code are required' },
        { status: 400 }
      );
    }

    // Verify the code using the database
    const { success, error } = await DatabaseService.verifyEmailCode(personalEmail, code);
    
    if (!success) {
      const statusCode = error?.includes('expired') ? 410 :
                        error?.includes('Too many') ? 429 :
                        error?.includes('No verification') ? 404 : 400;
      
      return NextResponse.json(
        { error },
        { status: statusCode }
      );
    }

    console.log(`✅ Personal email verified successfully: ${personalEmail}`);

    // CRITICAL FIX: Update Supabase user metadata to mark personal email as verified
    try {
      // Find the user by personal email (could be primary email or personal_email in metadata)
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        console.error('❌ Error listing users:', listError);
      } else {
        const user = users.find((u: any) => 
          u.email === personalEmail || 
          u.user_metadata?.personal_email === personalEmail
        );
        
        if (user) {
          console.log('🔧 Updating user metadata for personal email verification:', user.id);
          
          // Update user metadata to mark personal email as verified
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            {
              user_metadata: {
                ...user.user_metadata,
                personal_email_verified: true,
                personal_email_verified_at: new Date().toISOString(),
                // Also mark is_verified if this is the primary email
                is_verified: user.email === personalEmail ? true : user.user_metadata?.is_verified
              }
            }
          );
          
          if (updateError) {
            console.error('❌ Error updating user metadata for personal email:', updateError);
          } else {
            console.log('✅ User metadata updated - personal email marked as verified');
          }
        } else {
          console.warn('⚠️ No user found with personal email:', personalEmail);
        }
      }
    } catch (metadataError) {
      console.error('❌ Error updating user metadata for personal email:', metadataError);
      // Don't fail the verification - just log the issue
    }

    return NextResponse.json({
      success: true,
      message: 'Personal email verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('❌ Verify personal email code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 