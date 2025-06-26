"use client";

import { useState, useEffect, useRef } from "react";
import { profileApi } from "@/lib/api";
import TransferPlanningSection from "@/components/dashboard/TransferPlanningSection";
import { ChevronLeft, Edit, Mail, GraduationCap, Calendar, MapPin, Camera, Save, X, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import imageCompression from 'browser-image-compression';

interface UserProfile {
  user: {
    id: number;
    email: string;
    name: string;
    bio?: string;
    profile_photo?: string;
    edu_email?: string;
    edu_email_verified: boolean;
    is_verified: boolean;
    created_at?: string;
    updated_at?: string;
  };
  academic_profile?: {
    id: number;
    current_institution_name?: string;
    current_major_name?: string;
    current_quarter?: string;
    current_year?: number;
    target_institution_name?: string;
    target_major_name?: string;
    expected_transfer_year: number;
    expected_transfer_quarter?: string;
    max_credits_per_quarter?: number;
    max_units_per_quarter?: number;
    created_at?: string;
    updated_at?: string;
  };
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    profilePhoto: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileApi.getProfile();
        
        if (response.success) {
          setProfileData(response.data);
          // Initialize edit data
          setEditData({
            name: response.data.user?.name || '',
            bio: response.data.user?.bio || '',
            profilePhoto: response.data.user?.profile_photo || ''
          });
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset edit data to original values
    if (profileData) {
      setEditData({
        name: profileData.user?.name || '',
        bio: profileData.user?.bio || '',
        profilePhoto: profileData.user?.profile_photo || ''
      });
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      setError(null); // Clear any previous errors
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Authentication required');
        return;
      }

      // Compress image before upload
      const compressionOptions = {
        maxSizeMB: 1, // Maximum file size after compression
        maxWidthOrHeight: 800, // Maximum width/height for profile photos
        useWebWorker: true, // Use web worker for better performance
        fileType: 'image/jpeg', // Convert to JPEG for better compression
        initialQuality: 0.8 // Initial quality
      };

      console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      setUploadProgress('Compressing image...');
      
      let compressedFile;
      try {
        compressedFile = await imageCompression(file, compressionOptions);
        console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
        setUploadProgress('Uploading to cloud...');
      } catch (compressionError) {
        console.error('Image compression failed:', compressionError);
        setError('Failed to process image. Please try a different image.');
        return;
      }

      // Create unique filename
      const fileName = `${user.id}-${Date.now()}.jpg`; // Always use .jpg for compressed images
      const filePath = `profile-photos/${fileName}`;

      // Upload compressed file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        if (uploadError.message.includes('exceeded')) {
          setError('File size too large. Please choose an image under 10MB.');
        } else if (uploadError.message.includes('policy')) {
          setError('Upload not allowed. Please check your permissions.');
        } else {
          setError('Failed to upload image. Please try again.');
        }
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      // Clean up old profile photo if it exists
      if (editData.profilePhoto && editData.profilePhoto.includes('supabase')) {
        try {
          const oldPath = editData.profilePhoto.split('/').slice(-2).join('/'); // Get path from URL
          await supabase.storage
            .from('user-uploads')
            .remove([oldPath]);
        } catch (cleanupError) {
          console.warn('Failed to cleanup old profile photo:', cleanupError);
          // Don't fail the upload if cleanup fails
        }
      }

      // Update edit data with the public URL
      setEditData(prev => ({ ...prev, profilePhoto: publicUrl }));
      
      // Show success message with compression info
      const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(0);
      setSuccessMessage(`Profile photo uploaded successfully! (${compressionRatio}% size reduction)`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (err) {
      console.error('Photo upload error:', err);
      setError('Failed to upload image');
    } finally {
      setUploadingPhoto(false);
      setUploadProgress('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await profileApi.updateProfile({
        name: editData.name,
        bio: editData.bio,
        profilePhoto: editData.profilePhoto
      });
      
      if (response.success) {
        // Update local profile data
        if (profileData) {
          setProfileData({
            ...profileData,
            user: {
              ...profileData.user,
              name: editData.name,
              bio: editData.bio,
              profile_photo: editData.profilePhoto
            }
          });
        }
        setIsEditing(false);
      } else {
        setError('Failed to save profile changes');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
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

  if (error) {
    return (
      <div className="flex flex-col w-full bg-white">
        <TransferPlanningSection />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">{error}</div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
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
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h1 className="font-sans font-bold text-[32px] leading-10 text-[#111416] tracking-[0]">
                      My Profile
                    </h1>
                    <p className="text-[#607589] text-sm mt-1">
                      View and manage your account information
                    </p>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={handleEdit}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </section>

              <div className="px-4 w-full">
                <div className="flex flex-col gap-6 w-full">
                  {/* Profile Overview Card */}
                  <section className="flex flex-col gap-6 p-6 border border-[#dbe0e5] rounded-lg bg-gradient-to-r from-[#f8f9fa] to-white">
                    <div className="flex items-start gap-4">
                      {/* Profile Photo */}
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          {(isEditing ? editData.profilePhoto : profileData?.user.profile_photo) ? (
                            <img 
                              src={isEditing ? editData.profilePhoto : profileData?.user.profile_photo} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#0c7ff2] flex items-center justify-center">
                              <span className="text-white text-2xl font-bold">
                                {(isEditing ? editData.name : profileData?.user.name)?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPhoto}
                            className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                          >
                            {uploadingPhoto ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                              <Camera className="h-6 w-6 text-white" />
                            )}
                          </button>
                        )}
                        {uploadingPhoto && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <span className="text-xs text-[#0c7ff2] bg-white px-2 py-1 rounded-full shadow-sm">
                              {uploadProgress || 'Processing...'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        {/* Name */}
                        {isEditing ? (
                          <Input
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="text-2xl font-bold mb-2 border-0 shadow-none p-0 bg-transparent"
                            placeholder="Your name"
                          />
                        ) : (
                          <h2 className="text-2xl font-bold text-[#111416] mb-2">
                            {profileData?.user.name || "Student"}
                          </h2>
                        )}

                        {/* Email */}
                        <p className="text-[#607589] flex items-center gap-2 mb-3">
                          <Mail className="h-4 w-4" />
                          {profileData?.user.email}
                        </p>

                        {/* Bio */}
                        <div className="mb-3">
                          {isEditing ? (
                            <Textarea
                              value={editData.bio}
                              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                              placeholder="Tell us about yourself..."
                              className="min-h-[80px] resize-none"
                              maxLength={300}
                            />
                          ) : (
                            <p className="text-[#607589] text-sm leading-relaxed">
                              {profileData?.user.bio || "No bio added yet. Click 'Edit Profile' to add one!"}
                            </p>
                          )}
                          {isEditing && (
                            <p className="text-xs text-[#607589] mt-1">
                              {editData.bio.length}/300 characters
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          profileData?.user.is_verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {profileData?.user.is_verified ? '✅ Verified' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Hidden file input for photo upload */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </section>

                  {/* Success/Error Messages */}
                  {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-600 text-sm">{successMessage}</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <section className="flex flex-col gap-4 p-6 border border-[#dbe0e5] rounded-lg">
                    <h3 className="font-semibold text-xl text-[#111416] flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#607589] mb-2">
                          Primary Email
                        </label>
                        <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                          <p className="text-[#111416] font-medium">
                            {profileData?.user.email}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#607589] mb-2">
                          Educational Email
                        </label>
                        <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                          <div className="flex items-center justify-between">
                            <p className="text-[#111416] flex-1">
                              {profileData?.user.edu_email || "Not provided"}
                            </p>
                            {profileData?.user.edu_email && (
                              <span className={`ml-3 text-xs px-2 py-1 rounded-full font-medium ${
                                profileData.user.edu_email_verified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {profileData.user.edu_email_verified ? 'Verified' : 'Not Verified'}
                              </span>
                            )}
                          </div>
                          {!profileData?.user.edu_email_verified && profileData?.user.edu_email && (
                            <Link href="/fix-verification" className="text-[#0c7ff2] text-xs hover:underline mt-1 inline-block">
                              Fix verification status →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Academic Information */}
                  <section className="flex flex-col gap-4 p-6 border border-[#dbe0e5] rounded-lg">
                    <h3 className="font-semibold text-xl text-[#111416] flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Academic Information
                    </h3>
                    {profileData?.academic_profile ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[#607589] mb-2">
                            Current Institution
                          </label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[#607589]" />
                              {profileData.academic_profile.current_institution_name || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#607589] mb-2">
                            Current Major
                          </label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] font-medium">
                              {profileData.academic_profile.current_major_name || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#607589] mb-2">
                            Target Institution
                          </label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[#607589]" />
                              {profileData.academic_profile.target_institution_name || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#607589] mb-2">
                            Target Major
                          </label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] font-medium">
                              {profileData.academic_profile.target_major_name || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#607589] mb-2">
                            Current Academic Period
                          </label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#607589]" />
                              {profileData.academic_profile.current_quarter} {profileData.academic_profile.current_year}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#607589] mb-2">
                            Expected Transfer
                          </label>
                          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#dbe0e5]">
                            <p className="text-[#111416] font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#607589]" />
                              {profileData.academic_profile.expected_transfer_quarter} {profileData.academic_profile.expected_transfer_year}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <GraduationCap className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                        <h4 className="text-lg font-medium text-yellow-800 mb-2">Academic Profile Not Set Up</h4>
                        <p className="text-yellow-700 text-sm mb-4">
                          Complete your transfer planning to add academic information to your profile.
                        </p>
                        <Link href="/dashboard/planning/new">
                          <Button className="bg-yellow-600 hover:bg-yellow-700">
                            Set Up Academic Profile
                          </Button>
                        </Link>
                      </div>
                    )}
                  </section>

                  {/* Action Buttons */}
                  <section className="flex flex-col gap-4 p-6 border border-[#dbe0e5] rounded-lg bg-[#f8f9fa]">
                    <h3 className="font-semibold text-lg text-[#111416]">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/dashboard/settings">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Preferences & Settings
                        </Button>
                      </Link>
                      <Link href="/dashboard/planning/new">
                        <Button variant="outline" className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Plan Transfer Path
                        </Button>
                      </Link>
                      {!profileData?.user.edu_email_verified && (
                        <Link href="/fix-verification">
                          <Button variant="outline" className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                            <Mail className="h-4 w-4" />
                            Fix Email Verification
                          </Button>
                        </Link>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 