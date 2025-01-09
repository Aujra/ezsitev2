'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const themes = {
  light: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2563eb', // Modern blue
        light: '#60a5fa',
        dark: '#1d4ed8',
      },
      secondary: {
        main: '#7c3aed', // Modern purple
        light: '#a78bfa',
        dark: '#5b21b6',
      },
      background: {
        default: '#f8fafc',
        paper: '#ffffff',
      },
      text: {
        primary: '#1e293b',
        secondary: '#475569',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
              transform: 'translateY(-2px)',
              '&::before': {
                transform: 'scaleX(1.2) translateX(100%)',
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
              transition: 'transform 0.5s ease-in-out',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)',
              transform: 'translateY(-2px)',
              '&::before': {
                transform: 'scaleX(1.2) translateX(100%)',
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
              transition: 'transform 0.5s ease-in-out',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
          colorPrimary: {
            backgroundColor: '#60a5fa',
            color: '#ffffff',
          },
          colorWarning: {
            backgroundColor: '#fbbf24',
            color: '#ffffff',
          },
          colorError: {
            backgroundColor: '#ef4444',
            color: '#ffffff',
          },
        },
      },
    },
  }),
  dark: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#60a5fa', // Lighter blue for dark mode
        light: '#93c5fd',
        dark: '#3b82f6',
      },
      secondary: {
        main: '#a78bfa', // Lighter purple for dark mode
        light: '#c4b5fd',
        dark: '#8b5cf6',
      },
      background: {
        default: '#0f172a',
        paper: '#1e293b',
      },
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
              transform: 'translateY(-2px)',
              '&::before': {
                transform: 'scaleX(1.2) translateX(100%)',
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              transition: 'transform 0.5s ease-in-out',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
              transform: 'translateY(-2px)',
              '&::before': {
                transform: 'scaleX(1.2) translateX(100%)',
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              transition: 'transform 0.5s ease-in-out',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
          colorPrimary: {
            backgroundColor: '#3b82f6',
            color: '#ffffff',
          },
          colorWarning: {
            backgroundColor: '#d97706',
            color: '#ffffff',
          },
          colorError: {
            backgroundColor: '#dc2626',
            color: '#ffffff',
          },
        },
      },
    },
  }),
  nature: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
      },
      secondary: {
        main: '#ff7043',
        light: '#ff8a65',
        dark: '#f4511e',
      },
      background: {
        default: '#f1f8e9',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
          },
          contained: {
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 50%, #81c784 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
              transform: 'translateY(-2px)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #f4511e 0%, #ff7043 50%, #ff8a65 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #e64a19 0%, #f4511e 50%, #ff7043 100%)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
  }),
  ocean: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#006064',
        light: '#0097a7',
        dark: '#00363a',
      },
      secondary: {
        main: '#fb8c00',
        light: '#ffbd45',
        dark: '#c25e00',
      },
      background: {
        default: '#001c24',
        paper: '#00363a',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
          },
          contained: {
            background: 'linear-gradient(135deg, #006064 0%, #0097a7 50%, #00bcd4 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #00363a 0%, #006064 50%, #0097a7 100%)',
              transform: 'translateY(-2px)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #c25e00 0%, #fb8c00 50%, #ffbd45 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #a65100 0%, #c25e00 50%, #fb8c00 100%)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
  }),
  sunset: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#ff6b6b',
        light: '#ff8a8a',
        dark: '#e64c4c',
      },
      secondary: {
        main: '#ffd93d',
        light: '#ffe066',
        dark: '#ffc814',
      },
      background: {
        default: '#fff5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
          },
          contained: {
            background: 'linear-gradient(135deg, #e64c4c 0%, #ff6b6b 50%, #ff8a8a 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #d32f2f 0%, #e64c4c 50%, #ff6b6b 100%)',
              transform: 'translateY(-2px)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #ffc814 0%, #ffd93d 50%, #ffe066 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #ffb300 0%, #ffc814 50%, #ffd93d 100%)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
  }),
  cosmic: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      secondary: {
        main: '#00bcd4',
        light: '#4dd0e1',
        dark: '#0097a7',
      },
      background: {
        default: '#170B2E',
        paper: '#2D1B50',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
          },
          contained: {
            background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 50%, #ba68c8 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #6a1b9a 0%, #7b1fa2 50%, #9c27b0 100%)',
              transform: 'translateY(-2px)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #0097a7 0%, #00bcd4 50%, #4dd0e1 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #00838f 0%, #0097a7 50%, #00bcd4 100%)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
  }),
  forest: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2e7c67',
        light: '#4c9a82',
        dark: '#1b5e4d',
      },
      secondary: {
        main: '#d4ac0d',
        light: '#e3c44d',
        dark: '#b38f00',
      },
      background: {
        default: '#f0f7f4',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
          },
          contained: {
            background: 'linear-gradient(135deg, #1b5e4d 0%, #2e7c67 50%, #4c9a82 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #134a3e 0%, #1b5e4d 50%, #2e7c67 100%)',
              transform: 'translateY(-2px)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #b38f00 0%, #d4ac0d 50%, #e3c44d 100%)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #997a00 0%, #b38f00 50%, #d4ac0d 100%)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
  }),
  cyberpunk: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00ff9f',
        light: '#66ffc4',
        dark: '#00cc7f',
      },
      secondary: {
        main: '#ff00ff',
        light: '#ff66ff',
        dark: '#cc00cc',
      },
      background: {
        default: '#0a0a2c',
        paper: '#1a1a4c',
      },
      text: {
        primary: '#00ff9f',
        secondary: '#ff00ff',
      },
    },
    typography: {
      fontFamily: '"Orbitron", "Roboto", sans-serif',
      h1: {
        textShadow: '0 0 10px #00ff9f, 0 0 20px #00ff9f, 0 0 30px #00ff9f',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '0px',
            clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
            transition: 'all 0.3s ease',
          },
          contained: {
            background: 'linear-gradient(45deg, #00ff9f 0%, #00ccff 100%)',
            border: '2px solid #00ff9f',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 0 20px #00ff9f',
            },
          },
        },
      },
    },
  }),

  retrowave: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ff2d55',
        light: '#ff668c',
        dark: '#cc0029',
      },
      secondary: {
        main: '#08f7fe',
        light: '#6dfafe',
        dark: '#00c4cb',
      },
      background: {
        default: 'linear-gradient(180deg, #2b0036 0%, #000000 100%)',
        paper: '#1f0029',
      },
      text: {
        primary: '#ff2d55',
        secondary: '#08f7fe',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: 'linear-gradient(45deg, #ff2d55 0%, #ff36f7 100%)',
            border: '2px solid #ff2d55',
            textShadow: '0 0 5px #ff2d55',
            '&:hover': {
              textShadow: '0 0 10px #ff2d55',
              boxShadow: '0 0 20px rgba(255,45,85,0.5)',
            },
          },
        },
      },
    },
  }),

  candyland: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#ff6b98',
        light: '#ff9cc0',
        dark: '#ff3975',
      },
      secondary: {
        main: '#7df9ff',
        light: '#a5fbff',
        dark: '#55f7ff',
      },
      background: {
        default: '#fff0f5',
        paper: '#ffffff',
      },
      text: {
        primary: '#ff6b98',
        secondary: '#7df9ff',
      },
    },
    typography: {
      fontFamily: '"Comic Sans MS", "Poppins", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: 'linear-gradient(-45deg, #ff6b98, #ff9cc0, #7df9ff, #a5fbff)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            border: '3px dashed #ff6b98',
            borderRadius: '25px',
            '&:hover': {
              transform: 'rotate(-3deg)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '30px',
            border: '5px solid #ff6b98',
            background: 'linear-gradient(135deg, #fff0f5 0%, #ffffff 100%)',
          },
        },
      },
    },
  }),

  matrix: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00ff41',
        light: '#66ff7f',
        dark: '#00cc34',
      },
      secondary: {
        main: '#008f11',
        light: '#00bf17',
        dark: '#006f0c',
      },
      background: {
        default: '#000000',
        paper: '#0a0a0a',
      },
      text: {
        primary: '#00ff41',
        secondary: '#008f11',
      },
    },
    typography: {
      fontFamily: '"Source Code Pro", monospace',
      h1: {
        fontFamily: '"Matrix Code NFI", "Source Code Pro", monospace',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: '#000000',
            border: '1px solid #00ff41',
            color: '#00ff41',
            textShadow: '0 0 5px #00ff41',
            '&:hover': {
              background: '#00ff41',
              color: '#000000',
              boxShadow: '0 0 20px #00ff41',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: '1px solid #00ff41',
            boxShadow: '0 0 10px #00ff41',
          },
        },
      },
    },
  }),

  underwater: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00ffff',
        light: '#66ffff',
        dark: '#00cccc',
      },
      secondary: {
        main: '#ff7eef',
        light: '#ffa6f5',
        dark: '#ff56e9',
      },
      background: {
        default: '#001440',
        paper: '#002466',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: 'linear-gradient(45deg, rgba(0,255,255,0.8) 0%, rgba(0,150,255,0.8) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 0 20px rgba(0,255,255,0.5)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: 'rgba(0,36,102,0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        },
      },
    },
  }),

  vaporwave: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ff71ce',
        light: '#ff9ee5',
        dark: '#ff43b7',
      },
      secondary: {
        main: '#01cdfe',
        light: '#4ddbfe',
        dark: '#00a3cb',
      },
      background: {
        default: '#614385',
        paper: '#516395',
      },
      text: {
        primary: '#fffb96',
        secondary: '#05ffa1',
      },
    },
    typography: {
      fontFamily: '"VT323", "Press Start 2P", monospace',
      h1: {
        textShadow: '3px 3px 0px #ff71ce, 6px 6px 0px #01cdfe',
        letterSpacing: '2px',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: 'linear-gradient(45deg, #ff71ce, #01cdfe, #05ffa1)',
            border: '3px solid #fffb96',
            animation: 'buttonGlow 2s ease-in-out infinite alternate',
            '&:hover': {
              transform: 'scale(1.1) rotate(-2deg)',
            },
          },
        },
      },
    },
  }),

  neonNoir: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#fe0000',
        light: '#ff4d4d',
        dark: '#cb0000',
      },
      secondary: {
        main: '#4900ff',
        light: '#7c4dff',
        dark: '#3700cb',
      },
      background: {
        default: '#000000',
        paper: '#141414',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: '#000000',
            border: '2px solid #fe0000',
            boxShadow: '0 0 10px #fe0000, inset 0 0 10px #fe0000',
            color: '#fe0000',
            '&:hover': {
              background: '#fe0000',
              color: '#000000',
              boxShadow: '0 0 20px #fe0000, 0 0 40px #fe0000',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(10px)',
            background: 'rgba(20, 20, 20, 0.8)',
            borderLeft: '4px solid #fe0000',
          },
        },
      },
    },
  }),

  crystalline: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#88c0d0',
        light: '#afd4de',
        dark: '#6096a8',
      },
      secondary: {
        main: '#b48ead',
        light: '#c6aec2',
        dark: '#8c677d',
      },
      background: {
        default: '#eceff4',
        paper: '#e5e9f0',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: 'rgba(136, 192, 208, 0.3)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(136, 192, 208, 0.2)',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: '0 12px 40px rgba(136, 192, 208, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(136, 192, 208, 0.1)',
          },
        },
      },
    },
  }),

  botanica: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#557c55',
        light: '#7c997c',
        dark: '#3e5b3e',
      },
      secondary: {
        main: '#d4a373',
        light: '#e2bf9b',
        dark: '#b88c5d',
      },
      background: {
        default: '#fefae0',
        paper: '#ffffff',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: 'linear-gradient(135deg, #557c55, #7c997c)',
            boxShadow: '0 4px 12px rgba(85, 124, 85, 0.2)',
            border: '1px solid #a3b18a',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(85, 124, 85, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            border: '1px solid #e9edc9',
            boxShadow: '0 4px 12px rgba(85, 124, 85, 0.1)',
          },
        },
      },
    },
  }),

  holographic: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ff1493',
        light: '#ff71b8',
        dark: '#cc0f75',
      },
      secondary: {
        main: '#00ffff',
        light: '#66ffff',
        dark: '#00cccc',
      },
      background: {
        default: '#000022',
        paper: '#000033',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: 'linear-gradient(45deg, #ff1493, #00ffff, #ff1493)',
            backgroundSize: '200% 200%',
            animation: 'holographic 3s ease infinite',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 0 30px rgba(255, 20, 147, 0.5)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, rgba(255,20,147,0.1), rgba(0,255,255,0.1))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(255, 20, 147, 0.2)',
          },
        },
      },
    },
  }),
};

export type ThemeName = keyof typeof themes;

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'light',
  setTheme: () => {},
  availableThemes: [],
});

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      availableThemes: Object.keys(themes) as ThemeName[] 
    }}>
      <ThemeProvider theme={themes[currentTheme]}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
