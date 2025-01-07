'use client'
import React, { useState } from 'react';
import { Button, Select, MenuItem, TextField, Typography, Container } from '@mui/material';

const ThemePage: React.FC = () => {
  const [theme, setTheme] = useState('light');

  const handleThemeChange = (event: any) => {
    setTheme(event.target.value);
  };

  return (
    <Container sx={{ 
      bgcolor: 'background.default',
      color: 'text.primary', // Add explicit color
      minHeight: '100vh',
      py: 3
    }}>
      <Typography variant="h4">Select Theme</Typography>
      <Select
        value={theme}
        onChange={handleThemeChange}
        style={{ width: 200 }}
      >
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>
      <div className={`theme-container ${theme}`}>
        <Typography>This is a {theme} themed container.</Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="contained">Primary Button</Button>
        <TextField placeholder="Text Input" variant="outlined" />
        <Select
          displayEmpty
          defaultValue=""
          style={{ width: 200 }}
        >
          <MenuItem value="" disabled>Select an option</MenuItem>
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </Select>
        <TextField placeholder="Text Area" variant="outlined" multiline rows={4} />
        <Typography>Sample paragraph text to test typography.</Typography>
        <Typography variant="h5">Sample Heading 3</Typography>
        <Typography variant="h6">Sample Heading 4</Typography>
      </div>
    </Container>
  );
};

export default ThemePage;
