"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check for access token in localStorage
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        // Store the current path to redirect back after login
        const currentPath = window.location.pathname;
        if (currentPath !== '/auth/login' && currentPath !== '/auth/register') {
          localStorage.setItem('redirect_after_login', currentPath);
        }
        
        // Redirect to login page
        router.push('/auth/login');
        setIsLoading(false);
        return;
      }

      // TODO: Validate token with backend in production
      // For now, we'll assume any token is valid
      // In production, you would:
      // const response = await fetch('/api/v1/auth/me', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // if (!response.ok) {
      //   localStorage.removeItem('access_token');
      //   router.push('/auth/login');
      //   return;
      // }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
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