'use client';

import { Box } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  isDarkMode: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDarkMode }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Box 
      sx={{ 
        mb: 4, 
        position: 'relative',
        width: '180px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!imageError ? (
        <Image
          src={isDarkMode ? '/logoWhite2.png' : '/logoBlack2.png'}
          alt="EZWoW Logo"
          fill
          style={{ 
            objectFit: 'contain',
          }}
          onError={() => {
            console.error('Logo failed to load');
            setImageError(true);
          }}
        />
      ) : (
        <Box 
          sx={{ 
            typography: 'h4',
            fontWeight: 700,
            color: theme => isDarkMode ? theme.palette.common.white : theme.palette.common.black,
            letterSpacing: '0.05em',
            userSelect: 'none',
          }}
        >
          EZWoW
        </Box>
      )}
    </Box>
  );
};

export default Logo;
