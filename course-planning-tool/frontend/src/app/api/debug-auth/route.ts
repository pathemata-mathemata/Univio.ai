import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔧 Debug: Testing auth with email:', email);
    
    // Test 1: Basic auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('🔧 Auth result:', authData ? 'SUCCESS' : 'FAILED');
    console.log('🔧 Auth error:', authError);

    if (authError) {
      return NextResponse.json({
        step: 'auth_signin',
        success: false,
        error: authError.message,
        code: authError.status
      }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({
        step: 'auth_signin',
        success: false,
        error: 'No user returned from auth'
      }, { status: 400 });
    }

    // Test 2: Try to query users table with admin client
    console.log('🔧 Testing users table access...');
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    console.log('🔧 User data result:', userData ? 'FOUND' : 'NOT_FOUND');
    console.log('🔧 User error:', userError);

    // Test 3: Try with regular client (this will test RLS)
    const { data: rlsUserData, error: rlsError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    console.log('🔧 RLS test result:', rlsUserData ? 'SUCCESS' : 'BLOCKED');
    console.log('🔧 RLS error:', rlsError);

    return NextResponse.json({
      success: true,
      tests: {
        auth: {
          success: true,
          user_id: authData.user.id,
          email: authData.user.email,
          confirmed: !!authData.user.email_confirmed_at
        },
        admin_user_access: {
          success: !userError,
          found: !!userData,
          error: userError?.message
        },
        rls_user_access: {
          success: !rlsError,
          found: !!rlsUserData,
          error: rlsError?.message,
          likely_cause: rlsError ? 'RLS_POLICY_BLOCKING' : null
        }
      }
    });

  } catch (error) {
    console.error('❌ Debug auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 