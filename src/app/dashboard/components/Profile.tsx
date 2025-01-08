'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress, 
  Alert,
  TextField,
  Button,
  Divider
} from '@mui/material';
import toast from 'react-hot-toast';
import { formatDistance } from 'date-fns';

interface UserProfile {
  email: string;
  discordId: string | null;
  createdAt: string;
  license: {
    key: string;
    expiresAt: string;
  } | null;
}

interface EditableProfile {
  email: string;
  discordId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function formatTimeBalance(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

  return parts.length > 0 ? parts.join(' ') : '0s';
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EditableProfile>({
    email: '',
    discordId: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setFormData({
        email: data.email,
        discordId: data.discordId || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const loadingToast = toast.loading('Updating profile...');
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          discordId: formData.discordId || null,
          ...(formData.newPassword ? {
            currentPassword: formData.currentPassword,
            password: formData.newPassword,
          } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully', { id: loadingToast });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile', { id: loadingToast });
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!profile) return <Alert severity="info" sx={{ mt: 4 }}>No profile data available</Alert>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Profile</Typography>
      
      {/* License Information Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>License Information</Typography>
        {profile?.license ? (
          <>
            <Typography>License Key: {profile.license.key}</Typography>
            <Typography>
              Time Remaining: {formatTimeBalance(profile.license.timeBalance)}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => router.push('/shop')}
            >
              Add More Time
            </Button>
          </>
        ) : (
          <Alert severity="warning">
            No license found. Please contact support.
          </Alert>
        )}
      </Paper>

      {/* Existing Profile Information Card */}
      <Paper sx={{ p: 3 }}>
        {!isEditing ? (
          <>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <Typography>Email: {profile.email}</Typography>
            <Typography>Discord ID: {profile.discordId || 'Not set'}</Typography>
            <Typography>Member since: {new Date(profile.createdAt).toLocaleDateString()}</Typography>
            <Button 
              variant="contained" 
              onClick={() => setIsEditing(true)}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Discord ID"
                  value={formData.discordId}
                  onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Change Password</Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  error={formData.newPassword !== formData.confirmPassword}
                  helperText={formData.newPassword !== formData.confirmPassword ? "Passwords don't match" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button type="submit" variant="contained">
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
}
