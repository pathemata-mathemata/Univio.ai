"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function TestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const testSupabaseReset = async () => {
    if (!email) {
      setResult({ type: 'error', message: 'Please enter an email address' });
      return;
    }

    setIsLoading(true);
    setResult({ type: null, message: '' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      setResult({
        type: 'success',
        message: `✅ Supabase password reset email sent to ${email}. Check your inbox!`
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomReset = async () => {
    if (!email) {
      setResult({ type: 'error', message: 'Please enter an email address' });
      return;
    }

    setIsLoading(true);
    setResult({ type: null, message: '' });

    try {
      const response = await fetch('/api/auth/send-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setResult({
        type: 'success',
        message: `✅ Custom password reset API response: ${data.message}`
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSessionInfo = async () => {
    setIsLoading(true);
    setResult({ type: null, message: '' });

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }

      if (session) {
        setResult({
          type: 'success',
          message: `✅ Current session found: User ${session.user.email} (ID: ${session.user.id})`
        });
      } else {
        setResult({
          type: 'success',
          message: '✅ No active session (user is logged out)'
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: `❌ Session check error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#111416] mb-2">Password Reset System Test</h1>
          <p className="text-lg text-[#607589]">Test the password reset functionality</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-[#111416]">Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111416] mb-2">
                Test Email Address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email to test with"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#607589]" />
              </div>
              <p className="text-xs text-[#607589] mt-1">
                Use an email that exists in your Supabase Auth users table
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#111416]">Supabase Reset</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#607589] mb-4">
                Test Supabase's built-in password reset
              </p>
              <Button
                onClick={testSupabaseReset}
                disabled={isLoading}
                className="w-full bg-[#111416] hover:bg-[#111416]/90"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Test Supabase Reset
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#111416]">Custom API Reset</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#607589] mb-4">
                Test custom password reset API
              </p>
              <Button
                onClick={testCustomReset}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Test Custom API
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#111416]">Session Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#607589] mb-4">
                Check current authentication session
              </p>
              <Button
                onClick={testSessionInfo}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Check Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Display */}
        {result.type && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg text-[#111416] flex items-center">
                {result.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                Test Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${
                result.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  result.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#111416]">Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-[#111416] mb-2">1. Test Supabase Reset</h4>
              <p className="text-sm text-[#607589]">
                This uses Supabase's built-in password reset functionality. It will send an email
                with a link that redirects to `/auth/reset-password`.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-[#111416] mb-2">2. Test Custom API</h4>
              <p className="text-sm text-[#607589]">
                This uses your custom API endpoint which checks if the user exists and sends
                a Supabase reset email. It provides better error handling and user feedback.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-[#111416] mb-2">3. Complete Flow Test</h4>
              <ul className="text-sm text-[#607589] list-disc list-inside space-y-1">
                <li>Enter an email that exists in your Supabase Auth</li>
                <li>Click "Test Supabase Reset" or "Test Custom API"</li>
                <li>Check the email inbox for the reset link</li>
                <li>Click the reset link to go to `/auth/reset-password`</li>
                <li>Enter a new password and confirm</li>
                <li>Try logging in with the new password</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> This test page should be removed before production deployment.
                It's only for development testing purposes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 