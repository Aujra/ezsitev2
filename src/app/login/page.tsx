'use client';

import { useState } from 'react';
import { Button, TextField, Box, Typography, Container, IconButton, Paper } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppTheme } from '../theme/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { isDarkMode, toggleTheme } = useAppTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    const loadingToast = toast.loading('Signing in...');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        toast.success('Welcome back!', { id: loadingToast });
        // Use replace instead of push to prevent back navigation
        await router.replace('/dashboard');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Login failed', { id: loadingToast });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          backgroundColor: theme => theme.palette.mode === 'dark' ? 'background.paper' : 'white',
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '0 4px 20px 0 rgba(0,0,0,0.4)'
            : '0 4px 20px 0 rgba(0,0,0,0.1)',
        }}
      >
        <Logo isDarkMode={isDarkMode} />

        <IconButton 
        aria-label = {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
          }} 
          onClick={toggleTheme}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
          }}
        >
          Welcome Back
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mb: 3 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Don&apos;t have an account? Sign Up
            </Typography>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
