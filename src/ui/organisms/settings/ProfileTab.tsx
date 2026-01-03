'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/ui/atoms/Button';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import { ErrorMessage } from '@/ui/molecules/ErrorMessage';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} from '@/services/user.service';
import type { UserProfile } from '@/services/user.service';

export function ProfileTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const profileFormRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordFormRef = useRef<HTMLFormElement>(null);
  const currentPasswordInputRef = useRef<HTMLInputElement>(null);

  const [profileFormData, setProfileFormData] = useState({
    email: '',
    name: '',
  });

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const result = await getUserProfile();
      if (result.success && result.data) {
        setProfile(result.data);
        setProfileFormData({
          email: result.data.email,
          name: result.data.name || '',
        });
      } else {
        setError(result.error || 'Failed to load profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    setError(undefined);
    setSuccessMessage(undefined);

    try {
      const updateData: { email?: string; name?: string } = {};

      if (profileFormData.email !== profile?.email) {
        updateData.email = profileFormData.email;
      }

      // Always include name if it's different from current value (even if empty string)
      const currentName = profile?.name || '';
      if (profileFormData.name !== currentName) {
        // Always send the name value, even if it's an empty string
        updateData.name = profileFormData.name;
      }
      
      console.log('Sending update data:', updateData);

      if (Object.keys(updateData).length === 0) {
        setSuccessMessage('No changes to save');
        setIsSubmittingProfile(false);
        return;
      }

      const result = await updateUserProfile(updateData);
      if (!result.success) {
        setError(result.error || 'Failed to update profile');
        return;
      }

      if (result.data) {
        setProfile(result.data);
        setSuccessMessage('Profile updated successfully!');
        
        // If email changed, reload the page to get new token
        if (updateData.email) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPassword(true);
    setError(undefined);
    setSuccessMessage(undefined);

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setError('New passwords do not match');
      setIsSubmittingPassword(false);
      return;
    }

    try {
      const result = await updateUserPassword({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
      });

      if (!result.success) {
        setError(result.error || 'Failed to update password');
        return;
      }

      setSuccessMessage('Password updated successfully!');
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Profile Update Form */}
      <form
        ref={profileFormRef}
        onSubmit={handleProfileSubmit}
        className="space-y-4 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-indigo-900">👤 Update Profile</h3>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {successMessage && (
          <div className="rounded-lg bg-green-100 p-3 text-sm text-green-800">
            {successMessage}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              ref={emailInputRef}
              id="email"
              type="email"
              value={profileFormData.email}
              onChange={(e) =>
                setProfileFormData({ ...profileFormData, email: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              type="text"
              value={profileFormData.name}
              onChange={(e) =>
                setProfileFormData({ ...profileFormData, name: e.target.value })
              }
              className="mt-1"
              placeholder="Your name"
              maxLength={100}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            isLoading={isSubmittingProfile}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
          >
            💾 Save Profile
          </Button>
        </div>
      </form>

      {/* Password Update Form */}
      <form
        ref={passwordFormRef}
        onSubmit={handlePasswordSubmit}
        className="space-y-4 rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-red-50/50 p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-orange-900">🔒 Change Password</h3>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {successMessage && (
          <div className="rounded-lg bg-green-100 p-3 text-sm text-green-800">
            {successMessage}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              ref={currentPasswordInputRef}
              id="currentPassword"
              type="password"
              value={passwordFormData.currentPassword}
              onChange={(e) =>
                setPasswordFormData({
                  ...passwordFormData,
                  currentPassword: e.target.value,
                })
              }
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordFormData.newPassword}
              onChange={(e) =>
                setPasswordFormData({
                  ...passwordFormData,
                  newPassword: e.target.value,
                })
              }
              required
              className="mt-1"
              minLength={8}
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordFormData.confirmPassword}
              onChange={(e) =>
                setPasswordFormData({
                  ...passwordFormData,
                  confirmPassword: e.target.value,
                })
              }
              required
              className="mt-1"
              minLength={8}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            isLoading={isSubmittingPassword}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:shadow-xl"
          >
            🔒 Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}

