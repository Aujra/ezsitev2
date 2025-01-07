import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import NavigationCard from './NavigationCard';
import { useAuth } from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const navigationItems = [
    {
      title: 'Character Management',
      description: 'View and manage your WoW characters',
      icon: 'person',
      path: '/characters',
      requiredRole: 'user'
    },
    {
      title: 'Admin Dashboard',
      description: 'Manage users and system settings',
      icon: 'admin_panel_settings',
      path: '/admin',
      requiredRole: 'admin'
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: 'settings',
      path: '/settings',
      requiredRole: 'user'
    }
  ];

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {navigationItems.map((item) => (
          user.roles.includes(item.requiredRole) && (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.path}>
              <NavigationCard {...item} />
            </Grid>
          )
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
