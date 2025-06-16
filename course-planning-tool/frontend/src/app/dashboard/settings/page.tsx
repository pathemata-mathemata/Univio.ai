"use client";

import { useState, useEffect } from "react";
import { profileApi } from "@/lib/api";
import TransferPlanningSection from "@/components/dashboard/TransferPlanningSection";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

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
    current_institution: string;
    current_major: string;
    current_quarter?: string;
    current_year: number;
    target_institution: string;
    target_major: string;
    expected_transfer_year: number;
    expected_transfer_quarter?: string;
    max_credits_per_quarter: number;
    created_at?: string;
    updated_at?: string;
  };
}

export default function SettingsPage() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileApi.getProfile();
        if (response.success) {
          setProfileData(response.data);
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col w-full bg-white">
        <TransferPlanningSection />
        <div className="flex justify-center items-center py-20">
          <div className="text-[#607589]">Loading profile data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full bg-white">
        <TransferPlanningSection />
        <div className="flex justify-center items-center py-20">
          <div className="text-red-500">{error}</div>
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
                    My Profile
                  </h1>
                </div>
              </section>

              <div className="px-4 w-full">
                <div className="flex flex-col gap-6 w-full">
                  {/* Profile Information Section */}
                  <section className="flex flex-col gap-4 p-6 border border-[#dbe0e5] rounded-lg">
                    <h2 className="font-semibold text-xl text-[#111416]">Profile Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-[#111416] text-sm">Full Name</label>
                        <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                          <p className="text-[#111416] text-sm">
                            {profileData?.user.name || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-[#111416] text-sm">Email</label>
                        <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                          <p className="text-[#111416] text-sm">
                            {profileData?.user.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-[#111416] text-sm">Educational Email</label>
                        <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                          <p className="text-[#111416] text-sm">
                            {profileData?.user.edu_email || "Not provided"}
                            {profileData?.user.edu_email && (
                              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                profileData.user.edu_email_verified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {profileData.user.edu_email_verified ? 'Verified' : 'Not Verified'}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-[#111416] text-sm">Account Status</label>
                        <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                          <p className="text-[#111416] text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              profileData?.user.is_verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {profileData?.user.is_verified ? 'Verified' : 'Pending Verification'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Academic Information Section */}
                  <section className="flex flex-col gap-4 p-6 border border-[#dbe0e5] rounded-lg">
                    <h2 className="font-semibold text-xl text-[#111416]">Academic Information</h2>
                    {profileData?.academic_profile ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[#111416] text-sm">Current Institution</label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] text-sm">
                              {profileData.academic_profile.current_institution}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[#111416] text-sm">Current Major</label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] text-sm">
                              {profileData.academic_profile.current_major}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[#111416] text-sm">Target Institution</label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] text-sm">
                              {profileData.academic_profile.target_institution}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[#111416] text-sm">Target Major</label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] text-sm">
                              {profileData.academic_profile.target_major}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[#111416] text-sm">Current Academic Year</label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] text-sm">
                              {profileData.academic_profile.current_quarter} {profileData.academic_profile.current_year}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-medium text-[#111416] text-sm">Expected Transfer</label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] text-sm">
                              {profileData.academic_profile.expected_transfer_quarter} {profileData.academic_profile.expected_transfer_year}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          Academic profile not set up yet. Please complete your transfer planning to add this information.
                        </p>
                      </div>
                    )}
                  </section>

                  {/* Academic Preferences Section */}
                  <section className="flex flex-col gap-4 p-6 border border-[#dbe0e5] rounded-lg">
                    <h2 className="font-semibold text-xl text-[#111416]">Academic Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-[#111416] text-sm">Max Credits Per Quarter</label>
                        <select 
                          className="p-3 bg-white rounded-lg border border-[#dbe0e5] text-[#111416]"
                          defaultValue={profileData?.academic_profile?.max_credits_per_quarter || 15}
                        >
                          <option value="12">12 Credits</option>
                          <option value="15">15 Credits</option>
                          <option value="18">18 Credits</option>
                          <option value="21">21 Credits</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-[#111416] text-sm">Preferred Schedule Type</label>
                        <select className="p-3 bg-white rounded-lg border border-[#dbe0e5] text-[#111416]">
                          <option value="morning">Morning Classes</option>
                          <option value="afternoon">Afternoon Classes</option>
                          <option value="evening">Evening Classes</option>
                          <option value="mixed">Mixed Schedule</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Course Planning Preferences */}
                  <section className="flex flex-col gap-4 p-6 border border-[#dbe0e5] rounded-lg">
                    <h2 className="font-semibold text-xl text-[#111416]">Course Planning Preferences</h2>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#dbe0e5]">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#111416] text-sm">Prioritize Transfer Requirements</span>
                          <span className="text-[#607589] text-xs">Focus on courses needed for transfer first</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" defaultChecked className="h-4 w-4 text-[#111416] rounded border-[#dbe0e5]" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#dbe0e5]">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#111416] text-sm">Avoid Back-to-Back Classes</span>
                          <span className="text-[#607589] text-xs">Leave breaks between classes when possible</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-[#111416] rounded border-[#dbe0e5]" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#dbe0e5]">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#111416] text-sm">Prefer Online Classes</span>
                          <span className="text-[#607589] text-xs">Prioritize online/hybrid courses when available</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-[#111416] rounded border-[#dbe0e5]" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Notification Preferences */}
                  <section className="flex flex-col gap-4 p-6 border border-[#dbe0e5] rounded-lg">
                    <h2 className="font-semibold text-xl text-[#111416]">Notification Preferences</h2>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#dbe0e5]">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#111416] text-sm">Email Notifications</span>
                          <span className="text-[#607589] text-xs">Receive updates about deadlines and requirements</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" defaultChecked className="h-4 w-4 text-[#111416] rounded border-[#dbe0e5]" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#dbe0e5]">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#111416] text-sm">Deadline Reminders</span>
                          <span className="text-[#607589] text-xs">Get notified about upcoming application deadlines</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" defaultChecked className="h-4 w-4 text-[#111416] rounded border-[#dbe0e5]" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#dbe0e5]">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#111416] text-sm">Course Updates</span>
                          <span className="text-[#607589] text-xs">Notifications about new course offerings and changes</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-[#111416] rounded border-[#dbe0e5]" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Save Settings Button */}
                  <div className="flex justify-end px-4 py-4">
                    <button className="px-6 py-2 bg-[#0c7ff2] text-white rounded-lg font-medium hover:bg-[#0a6fd1] transition-colors">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 