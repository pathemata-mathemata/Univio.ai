"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          // Store the current path to redirect back after login
          const currentPath = window.location.pathname;
          if (currentPath !== '/auth/login' && currentPath !== '/auth/register') {
            localStorage.setItem('redirect_after_login', currentPath);
          }
          
          // Clean up any stale tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('supabase_session');
          
          // Redirect to login page
          router.push('/auth/login');
          setIsLoading(false);
          return;
        }

        // Valid session exists
        setIsAuthenticated(true);
        
        // Update stored session
        localStorage.setItem('supabase_session', JSON.stringify(session));
        localStorage.setItem('access_token', session.access_token);
        
        console.log('✅ User authenticated:', session.user.email);
        
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('supabase_session');
        router.push('/auth/login');
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        localStorage.setItem('supabase_session', JSON.stringify(session));
        localStorage.setItem('access_token', session.access_token);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#111416] mx-auto mb-4" />
            <p className="text-[#607589]">Checking authentication...</p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
} 