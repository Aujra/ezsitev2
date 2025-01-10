import { Box, FormControl, InputLabel, Select, MenuItem, TextField, FormControlLabel, Switch } from '@mui/material';
import { Condition, FieldDefinition, CONDITION_FIELD_DEFINITIONS } from '@/types/rotation';

interface ConditionFieldsProps {
  condition: Condition;
  onUpdate: (updates: Partial<Omit<Condition, 'type'>>) => void;
}

export function ConditionFields({ condition, onUpdate }: ConditionFieldsProps) {
  const renderField = (field: FieldDefinition) => {
    if (field.dependent && condition[field.dependent.key] !== field.dependent.value) {
      return null;
    }

    switch (field.type) {
      case 'text':
        return (
          <TextField
            label={field.label}
            value={condition[field.key] || ''}
            onChange={e => onUpdate({ [field.key]: e.target.value })}
            sx={{ width: '200px' }}
          />
        );
      case 'number':
        return (
          <TextField
            label={field.label}
            type="number"
            value={condition[field.key] || 0}
            onChange={e => onUpdate({ [field.key]: Number(e.target.value) })}
            sx={{ width: '100px' }}
          />
        );
      case 'select':
        return (
          <FormControl sx={{ width: '150px' }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={condition[field.key] || ''}
              label={field.label}
              onChange={e => onUpdate({ [field.key]: e.target.value })}
            >
              {field.options?.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!condition[field.key]}
                onChange={e => onUpdate({ [field.key]: e.target.checked })}
              />
            }
            label={field.label}
          />
        );
    }
  };

  const fields = CONDITION_FIELD_DEFINITIONS[condition.type];

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {fields.map((field, index) => (
        <Box key={`${field.key}-${index}`}>
          {renderField(field)}
        </Box>
      ))}
    </Box>
  );
}
