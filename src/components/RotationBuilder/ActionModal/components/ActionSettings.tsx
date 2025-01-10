'use client';

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { RotationAction, Target } from '@/types/rotation';
import { TARGETS } from '../constants';

interface ActionSettingsProps {
  action: RotationAction;
  onChange: (updates: Partial<RotationAction>) => void;
}

export function ActionSettings({ action, onChange }: ActionSettingsProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2,
      '& > *': { 
        minWidth: { xs: '100%', md: 'auto' }
      }
    }}>
      <TextField
        label="Spell Name"
        value={action.spellName}
        onChange={e => onChange({ spellName: e.target.value })}
        sx={{ flex: { md: 2 } }}
      />
      <FormControl>
        <InputLabel>Target</InputLabel>
        <Select
          value={action.target}
          label="Target"
          onChange={e => onChange({ target: e.target.value as Target })}
        >
          {TARGETS.map(target => (
            <MenuItem key={target} value={target}>{target}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        flexDirection: { xs: 'row', md: 'row' },
        flex: 1
      }}>
        <TextField
          label="Weight"
          type="number"
          value={action.weight}
          onChange={e => onChange({ weight: Number(e.target.value) })}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Priority"
          type="number"
          value={action.priority}
          onChange={e => onChange({ priority: Number(e.target.value) })}
          sx={{ flex: 1 }}
        />
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={action.interruptible}
            onChange={e => onChange({ interruptible: e.target.checked })}
          />
        }
        label="Interruptible"
        sx={{ m: 0 }}
      />
    </Box>
  );
}
