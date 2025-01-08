'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShopIcon from '@mui/icons-material/Shop';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAppTheme } from '../theme/ThemeContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Profile from './components/Profile';

const DRAWER_WIDTH = 240;

interface NavItem {
  text: string;
  icon: JSX.Element;
  onClick?: () => void;
}

export default function Dashboard() {
  const { isDarkMode, toggleTheme } = useAppTheme();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out...');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully', { id: loadingToast });
      router.push('/login');
    } catch (error) {
      toast.error('Error logging out', { id: loadingToast });
    }
  };

  const navItems: NavItem[] = [
    { text: 'Profile', icon: <PersonIcon /> },
    { text: 'Shop', icon: <ShopIcon /> },
    { text: 'Orders', icon: <ShoppingCartIcon /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={selectedItem === item.text}
              onClick={() => {
                setSelectedItem(item.text);
                if (item.onClick) item.onClick();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
      <Divider />
      <List>
        <ListItem>
          <ListItemButton onClick={toggleTheme}>
            <ListItemIcon>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText primary={isDarkMode ? "Light Mode" : "Dark Mode"} />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => router.push('/admin')}>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Go to Admin Dashboard" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (selectedItem) {
      case 'Profile':
        return <Profile />;
      default:
        return (
          <>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {selectedItem}
            </Typography>
            <Typography paragraph>
              Welcome to your dashboard! Select an option from the menu to get started.
            </Typography>
          </>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              backgroundColor: 'background.paper',
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Box>
        {renderContent()}
      </Box>
    </Box>
  );
}
