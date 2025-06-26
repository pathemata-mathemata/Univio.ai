import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/services/databaseService';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { eduEmail, code } = await request.json();

    // Validate input
    if (!eduEmail || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Verify the code using the database
    const { success, error } = await DatabaseService.verifyEmailCode(eduEmail, code);
    
    if (!success) {
      const statusCode = error?.includes('expired') ? 410 :
                        error?.includes('Too many') ? 429 :
                        error?.includes('No verification') ? 404 : 400;
      
      return NextResponse.json(
        { error },
        { status: statusCode }
      );
    }

    console.log(`✅ Email verified successfully: ${eduEmail}`);

    // CRITICAL FIX: Update Supabase user metadata to mark edu email as verified
    try {
      // Find the user by edu email in metadata
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        console.error('❌ Error listing users:', listError);
      } else {
        const user = users.find((u: any) => u.user_metadata?.edu_email === eduEmail);
        
        if (user) {
          console.log('🔧 Updating user metadata for:', user.id);
          
          // Update user metadata to mark edu email as verified
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            {
              user_metadata: {
                ...user.user_metadata,
                edu_email_verified: true,
                edu_email_verified_at: new Date().toISOString()
              }
            }
          );
          
          if (updateError) {
            console.error('❌ Error updating user metadata:', updateError);
          } else {
            console.log('✅ User metadata updated - edu email marked as verified');
          }
        } else {
          console.warn('⚠️ No user found with edu email:', eduEmail);
        }
      }
    } catch (metadataError) {
      console.error('❌ Error updating user metadata:', metadataError);
      // Don't fail the verification - just log the issue
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('❌ Verify code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 