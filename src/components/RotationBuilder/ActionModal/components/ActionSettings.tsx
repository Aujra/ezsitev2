import { Box, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { RotationAction, Target } from '@/types/rotation';
import { TARGETS } from '../constants';

interface ActionSettingsProps {
  action: RotationAction;
  onChange: (updates: Partial<RotationAction>) => void;
}

export function ActionSettings({ action, onChange }: ActionSettingsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
      <TextField
        label="Spell Name"
        value={action.spellName}
        onChange={e => onChange({ spellName: e.target.value })}
        sx={{ width: '300px' }}
      />
      <FormControl sx={{ width: '200px' }}>
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
      <TextField
        label="Weight"
        type="number"
        value={action.weight}
        onChange={e => onChange({ weight: Number(e.target.value) })}
        sx={{ width: '100px' }}
      />
      <TextField
        label="Priority"
        type="number"
        value={action.priority}
        onChange={e => onChange({ priority: Number(e.target.value) })}
        sx={{ width: '100px' }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={action.interruptible}
            onChange={e => onChange({ interruptible: e.target.checked })}
          />
        }
        label="Interruptible"
      />
    </Box>
  );
}
