"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TransferPlanningSection from "@/components/dashboard/TransferPlanningSection";
import { ChevronLeft, Save, User } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { profileApi } from "@/lib/api";

interface FormData {
  year: string;
  quarter: string;
  major: string;
  institution: string;
  transfer: string;
}

interface UserProfile {
  user: {
    id: number;
    email: string;
    name: string;
    edu_email?: string;
    edu_email_verified: boolean;
    is_verified: boolean;
    created_at?: string;
    updated_at?: string;
  };
  academic_profile?: {
    id: number;
    current_institution?: string;  // Legacy field
    current_institution_name?: string;  // Actual field in DB
    current_major?: string;  // Legacy field
    current_major_name?: string;  // Actual field in DB
    current_quarter?: string;
    current_year?: number;
    target_institution?: string;  // Legacy field
    target_institution_name?: string;  // Actual field in DB
    target_major?: string;  // Legacy field
    target_major_name?: string;  // Actual field in DB
    expected_transfer_year: number;
    expected_transfer_quarter?: string;
    max_credits_per_quarter?: number;
    max_units_per_quarter?: number;  // Alternative field name
    created_at?: string;
    updated_at?: string;
  };
}

const TransferPlanningPage = (): JSX.Element => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    year: "",
    quarter: "",
    major: "",
    institution: "",
    transfer: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load user profile data when component mounts
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      console.log('🔧 Frontend: Starting profile load...');
      const result = await profileApi.getProfile();
      console.log('🔧 Frontend: Profile API result:', result);
      const profile = result.data;
      console.log('🔧 Frontend: Profile data:', profile);
      console.log('🔧 Frontend: Academic profile:', profile?.academic_profile);
      setProfileData(profile);
      
      // Auto-fill form with existing data
      console.log('🔧 Frontend: Checking academic profile existence:', !!profile?.academic_profile);
      console.log('🔧 Frontend: Academic profile object:', profile?.academic_profile);
      if (profile?.academic_profile) {
        const academicProfile = profile.academic_profile;
        console.log('🔧 Frontend: Found academic profile, filling form:', academicProfile);
        setFormData({
          year: academicProfile.expected_transfer_year?.toString() || "",
          quarter: academicProfile.expected_transfer_quarter || "",
          major: academicProfile.current_major_name || academicProfile.current_major || "",
          institution: academicProfile.current_institution_name || academicProfile.current_institution || "",
          transfer: academicProfile.target_institution_name || academicProfile.target_institution || "",
        });
        console.log('🔧 Frontend: Form data set:', {
          year: academicProfile.expected_transfer_year?.toString() || "",
          quarter: academicProfile.expected_transfer_quarter || "",
          major: academicProfile.current_major_name || academicProfile.current_major || "",
          institution: academicProfile.current_institution_name || academicProfile.current_institution || "",
          transfer: academicProfile.target_institution_name || academicProfile.target_institution || "",
        });
      } else {
        console.log('🔧 Frontend: No academic profile found');
      }
    } catch (error) {
      console.error('❌ Frontend: Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfileChanges = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        current_institution: formData.institution,
        current_major: formData.major,
        target_institution: formData.transfer,
        expected_transfer_year: parseInt(formData.year),
        expected_transfer_quarter: formData.quarter.toLowerCase(),
      };

      await profileApi.updateProfile(updateData);
      setHasChanges(false);
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleNext = () => {
    // Basic validation
    if (!formData.year || !formData.quarter || !formData.major || !formData.institution || !formData.transfer) {
      alert("Please fill in all fields");
      return;
    }

    // Store form data locally (no API call yet)
    localStorage.setItem('transferPlanningData', JSON.stringify(formData));
    
    // Navigate directly to courses page
    router.push('/dashboard/courses');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full bg-white">
        <TransferPlanningSection />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#0c7ff2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#607589]">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <TransferPlanningSection />

      <div className="flex flex-col w-full bg-white">
        <div className="flex flex-col w-full">
          <div className="flex justify-center px-40 py-5 w-full">
            <div className="flex flex-col max-w-[960px] w-full">
              <section className="flex flex-col gap-4 p-4 w-full">
                <Link href="/dashboard" className="flex items-center gap-2 text-[#607589] hover:text-[#111416] transition-colors w-fit">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </Link>
                <div className="flex flex-col w-72">
                  <h1 className="font-sans font-bold text-[32px] leading-10 text-[#111416] tracking-[0]">
                    AI Transfer Scheduler
                  </h1>
                </div>

                {/* Profile status indicator */}
                <div className="flex items-center gap-3 p-4 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                  <User className="h-5 w-5 text-[#0c7ff2]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#111416]">
                      {profileData?.academic_profile 
                        ? "Your information has been pre-filled from your profile. You can edit any field."
                        : "Please fill in your transfer planning information."
                      }
                    </p>
                    {hasChanges && (
                      <p className="text-xs text-[#0c7ff2] mt-1">
                        You have unsaved changes.
                      </p>
                    )}
                  </div>
                  {hasChanges && (
                    <Button 
                      onClick={saveProfileChanges}
                      disabled={saving}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </div>
              </section>

              <form onSubmit={handleSubmit} className="w-full px-4">
                {/* Year of Transfer - Row 1 */}
                <div className="flex flex-col items-start px-4 py-3 w-full">
                  <label
                    htmlFor="year"
                    className="font-medium text-[#111416] text-base mb-2"
                  >
                    Year of Transfer
                  </label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full"
                    placeholder="Enter the year you want to transfer"
                    required
                  />
                </div>

                {/* Quarter - Row 2 */}
                <div className="flex flex-col items-start px-4 py-3 w-full">
                  <label
                    htmlFor="quarter"
                    className="font-medium text-[#111416] text-base mb-2"
                  >
                    Quarter
                  </label>
                  <select
                    id="quarter"
                    value={formData.quarter}
                    onChange={(e) => handleInputChange("quarter", e.target.value)}
                    className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full px-3"
                    required
                  >
                    <option value="">Select your expected transfer quarter</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                  </select>
                </div>

                {/* Current Major - Row 3 */}
                <div className="flex flex-col items-start px-4 py-3 w-full">
                  <label
                    htmlFor="major"
                    className="font-medium text-[#111416] text-base mb-2"
                  >
                    Current Major
                  </label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                    className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full"
                    placeholder="Enter your current major"
                    required
                  />
                </div>

                {/* Current Institution - Row 4 */}
                <div className="flex flex-col items-start px-4 py-3 w-full">
                  <label
                    htmlFor="institution"
                    className="font-medium text-[#111416] text-base mb-2"
                  >
                    Current Institution
                  </label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full"
                    placeholder="Enter your current institution"
                    required
                  />
                </div>

                {/* Intended Transfer Institution - Row 5 */}
                <div className="flex flex-col items-start px-4 py-3 w-full">
                  <label
                    htmlFor="transfer"
                    className="font-medium text-[#111416] text-base mb-2"
                  >
                    Intended Transfer Institution
                  </label>
                  <Input
                    id="transfer"
                    value={formData.transfer}
                    onChange={(e) => handleInputChange("transfer", e.target.value)}
                    className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full"
                    placeholder="Enter your intended transfer institution"
                    required
                  />
                </div>

                <div className="flex items-center justify-between px-4 py-3 w-full">
                  <div className="flex items-center gap-2">
                    {hasChanges && (
                      <Button 
                        type="button"
                        onClick={saveProfileChanges}
                        disabled={saving}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : "Save Profile"}
                      </Button>
                    )}
                  </div>
                  <Button 
                    type="button"
                    onClick={handleNext}
                    className="w-[84px] h-10 bg-[#0c7ff2] rounded-lg text-white font-bold hover:bg-[#0a6fd1] transition-colors"
                  >
                    Next
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPlanningPage; 