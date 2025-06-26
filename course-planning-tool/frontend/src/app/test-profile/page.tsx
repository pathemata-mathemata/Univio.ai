"use client";

import { useState, useEffect } from 'react';
import { profileApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Testing profile API...');
      const response = await profileApi.getProfile();
      console.log('📊 Raw API response:', response);
      
      setProfileData(response);
      
      if (response.success) {
        console.log('✅ Profile API working correctly');
        console.log('📝 User data:', response.data?.user);
        console.log('🎓 Academic data:', response.data?.academic_profile);
      } else {
        setError('API returned success: false');
      }
    } catch (err) {
      console.error('❌ Profile API error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile API Test</CardTitle>
            <Button onClick={fetchProfile} disabled={loading}>
              {loading ? 'Testing...' : 'Test API Again'}
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error:</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {profileData && (
              <div className="space-y-4">
                {/* API Response Status */}
                <div className={`p-4 rounded-lg ${
                  profileData.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-medium ${
                    profileData.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    API Success: {profileData.success ? 'TRUE ✅' : 'FALSE ❌'}
                  </p>
                </div>

                {/* User Data */}
                {profileData.data?.user && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Name:</strong> {profileData.data.user.name || 'Not set'}</div>
                        <div><strong>Email:</strong> {profileData.data.user.email || 'Not set'}</div>
                        <div><strong>EDU Email:</strong> {profileData.data.user.edu_email || 'Not set'}</div>
                        <div><strong>EDU Verified:</strong> {profileData.data.user.edu_email_verified ? '✅ YES' : '❌ NO'}</div>
                        <div><strong>Account Verified:</strong> {profileData.data.user.is_verified ? '✅ YES' : '❌ NO'}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Academic Profile Data */}
                {profileData.data?.academic_profile ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Academic Profile ✅</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Current Institution:</strong> {
                          profileData.data.academic_profile.current_institution_name || 
                          profileData.data.academic_profile.current_institution || 
                          'Not set'
                        }</div>
                        <div><strong>Current Major:</strong> {
                          profileData.data.academic_profile.current_major_name || 
                          profileData.data.academic_profile.current_major || 
                          'Not set'
                        }</div>
                        <div><strong>Target Institution:</strong> {
                          profileData.data.academic_profile.target_institution_name || 
                          profileData.data.academic_profile.target_institution || 
                          'Not set'
                        }</div>
                        <div><strong>Target Major:</strong> {
                          profileData.data.academic_profile.target_major_name || 
                          profileData.data.academic_profile.target_major || 
                          'Not set'
                        }</div>
                        <div><strong>Transfer Year:</strong> {profileData.data.academic_profile.expected_transfer_year || 'Not set'}</div>
                        <div><strong>Transfer Quarter:</strong> {profileData.data.academic_profile.expected_transfer_quarter || 'Not set'}</div>
                        <div><strong>Max Units:</strong> {
                          profileData.data.academic_profile.max_credits_per_quarter || 
                          profileData.data.academic_profile.max_units_per_quarter || 
                          'Not set'
                        }</div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-yellow-700">Academic Profile ⚠️</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-yellow-800">No academic profile found. This might be why the settings page appears empty.</p>
                    </CardContent>
                  </Card>
                )}

                {/* Raw JSON Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Raw JSON Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(profileData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <a href="/dashboard/settings" className="text-blue-600 hover:underline">
            ← Back to Settings Page
          </a>
        </div>
      </div>
    </div>
  );
} 