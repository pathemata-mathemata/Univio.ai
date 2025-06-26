"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { profileApi } from '@/lib/api';

export default function FixVerificationPage() {
  const [email, setEmail] = useState('');
  const [eduEmail, setEduEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState<any>(null);

  // Load user profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await profileApi.getProfile();
        
        if (response.success && response.data) {
          setProfileData(response.data);
          // Auto-fill the form with user's current emails
          if (response.data.user?.email) {
            setEmail(response.data.user.email);
          }
          if (response.data.user?.edu_email) {
            setEduEmail(response.data.user.edu_email);
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleFix = async () => {
    if (!email) {
      setError('Please enter your account email');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/fix-edu-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          eduEmail: eduEmail || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix verification');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your account information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Fix Edu Email Verification</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Fix your .edu email verification status if it shows as "Not Verified"
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Status Display */}
          {profileData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Current Status:</h4>
              <div className="space-y-1 text-sm">
                <p className="text-blue-800">
                  <strong>Account Email:</strong> {profileData.user?.email}
                </p>
                <p className="text-blue-800">
                  <strong>EDU Email:</strong> {profileData.user?.edu_email || 'Not set'}
                  {profileData.user?.edu_email && (
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      profileData.user.edu_email_verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profileData.user.edu_email_verified ? 'Verified ✅' : 'Not Verified ❌'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Your Account Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your.account@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loadingProfile}
            />
          </div>

          <div>
            <label htmlFor="eduEmail" className="block text-sm font-medium mb-2">
              Your .edu Email
            </label>
            <Input
              id="eduEmail"
              type="email"
              placeholder="your.name@college.edu"
              value={eduEmail}
              onChange={(e) => setEduEmail(e.target.value)}
              disabled={loadingProfile}
            />
            <p className="text-xs text-gray-500 mt-1">
              {profileData?.user?.edu_email 
                ? "This is your current .edu email from your account" 
                : "Enter your .edu email to add it to your account"
              }
            </p>
          </div>

          <Button 
            onClick={handleFix} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Fixing...' : 'Fix Verification Status'}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm font-medium">✅ Fixed successfully!</p>
              <p className="text-green-700 text-xs mt-1">
                Edu email {result.eduEmail} is now marked as verified.
              </p>
              <p className="text-green-700 text-xs">
                Refresh your profile page to see the change.
              </p>
            </div>
          )}

          <div className="text-center pt-4">
            <a href="/dashboard/profile" className="text-blue-600 hover:underline text-sm">
              ← Back to Profile
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 