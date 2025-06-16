import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Delete verification codes for this email
    const { error } = await supabaseAdmin
      .from('email_verifications')
      .delete()
      .eq('email', email);

    if (error) {
      console.error('❌ Error clearing verification codes:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    console.log(`✅ Cleared verification codes for ${email}`);
    
    return NextResponse.json({
      success: true,
      message: `Verification codes cleared for ${email}`
    });

  } catch (error) {
    console.error('❌ Clear verification error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 