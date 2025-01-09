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
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';

interface UserProfile {
  email: string;
  discordId: string | null;
  createdAt: string;
  license: {
    key: string;
    timeBalance: number;  // Changed from expiresAt to timeBalance
  } | null;
}

interface EditableProfile {
  email: string;
  discordId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
  const { addItem } = useCart();
  const [days, setDays] = useState<number>(1);

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

  const handleAddToCart = async () => {
    if (days < 1) {
      toast.error('Please enter at least 1 day');
      return;
    }

    const loadingToast = toast.loading('Adding to cart...');
    try {     
      addItem({
        id: `game-time-${Date.now()}`,
        name: `${days} Days Game Time`,
        price: Math.pow(days, 2), // Square the days for price
        quantity: 1,
        days: days,
        type: 'game-time',
      });

      toast.success(`Added ${days} days to cart`, { id: loadingToast });
    } catch {
      toast.error('Failed to add to cart', { id: loadingToast });
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!profile) return <Alert severity="info" sx={{ mt: 4 }}>No profile data available</Alert>;

  function formatTimeBalance(seconds: number): string {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;
  
    const parts = [
      `${days} days`,
      `${hours} hours`,
      `${minutes} minutes`,
      `${remainingSeconds} seconds`
    ];
  
    return parts.join(' ');
  }
  

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Profile</Typography>
      
      {/* License Information Card with integrated AddTime */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>License Information</Typography>
        {profile?.license ? (
          <>
            <Typography>License Key: {profile.license.key}</Typography>
            <Typography sx={{ mb: 3 }}>
              Time Remaining: {formatTimeBalance(profile.license.timeBalance)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                type="number"
                label="Number of Days"
                value={days}
                onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 0))}
                InputProps={{ inputProps: { min: 1 } }}
                size="small"
              />
              <Button 
                variant="contained" 
                onClick={handleAddToCart}
                sx={{ minWidth: '120px' }}
              >
                Add to Cart (${days})
              </Button>
            </Box>
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
