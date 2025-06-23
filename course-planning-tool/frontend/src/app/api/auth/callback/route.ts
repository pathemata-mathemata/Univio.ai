import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('❌ Code exchange error:', error);
        return NextResponse.redirect(new URL('/auth/login?error=auth_error', request.url));
      }

      console.log('✅ Auth callback successful');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      console.error('❌ Auth callback error:', error);
      return NextResponse.redirect(new URL('/auth/login?error=server_error', request.url));
    }
  }

  // No code parameter, redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url));
} 