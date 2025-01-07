'use client'
import "./globals.css";
import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '@/theme';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

const Layout: React.FC = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Set initial theme to dark for testing

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <CssBaseline />
      <Box 
        component="div" 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </Box>
        <Box
          component="footer"
          sx={{
            py: 3,
            textAlign: 'center',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <p>© 2023 My Application</p>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
