'use client';

import { Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import { useAppTheme } from '@/context/ThemeContext';

export function ThemeSelector() {
  const { currentTheme, setTheme, availableThemes } = useAppTheme();

  const handleChange = (event: SelectChangeEvent) => {
    setTheme(event.target.value as any);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={currentTheme}
        onChange={handleChange}
        sx={{
          bgcolor: 'background.paper',
          '& .MuiSelect-select': {
            py: 1,
          }
        }}
      >
        {availableThemes.map((theme) => (
          <MenuItem key={theme} value={theme} sx={{ textTransform: 'capitalize' }}>
            {theme}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
