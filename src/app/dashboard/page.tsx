'use client';

import { Box, Typography, Container, IconButton, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppTheme } from '../theme/ThemeContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { isDarkMode, toggleTheme } = useAppTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    router.push('/login');
  };

  return (
    <Container>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Dashboard</Typography>
        <Box>
          <IconButton onClick={toggleTheme} sx={{ mr: 2 }}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography>Welcome to your dashboard!</Typography>
      </Box>
    </Container>
  );
}
